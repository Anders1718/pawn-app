import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useLocation } from 'react-router-native'
import queryString from 'query-string'
import CreatePDF from '../../components/PDFGeneerate'
import CreatereportPDF from '../../components/PDFBillReport'
import Precio from './components/precio'
import DateRangePicker from '../../components/DatePicker'
import { fetchHistorialVacas, fetchUsers } from '../../hooks/useRepositories'
import { Screen, Header, Card, Button, Text, Icon, SectionTitle } from '../../ui'
import theme from '../../theme'

const fetchData = async (id, startDate, endDate, setResponse, setTerapeuticosCount, setPreventivosCount, setRevisionCount, setTalonAdicionalCount, setPrices, setPricesExist, setReport, setUsers, setHabilitado) => {
    // Cubrir todo el día en zona horaria local
    const adjustedStartDate = new Date(startDate)
    adjustedStartDate.setHours(0, 0, 0, 0)
    const startDateOffset = new Date(adjustedStartDate.getTime() - adjustedStartDate.getTimezoneOffset() * 60000)

    const adjustedEndDate = new Date(endDate)
    adjustedEndDate.setHours(23, 59, 59, 999)
    const endDateOffset = new Date(adjustedEndDate.getTime() - adjustedEndDate.getTimezoneOffset() * 60000)

    const response = await fetchHistorialVacas(id, startDateOffset.toISOString(), endDateOffset.toISOString())
    setReport(response)
    const uniqueVacas = response.reduce((acc, current) => {
        const x = acc.find(item => item.nombre_vaca === current.nombre_vaca)
        if (!x) {
            return acc.concat([current])
        } else {
            return acc
        }
    }, [])

    const terapeuticosCount = uniqueVacas.filter(item => item.tratamiento && item.tratamiento.includes("Terapéutico")).length
    const preventivosCount = uniqueVacas.filter(item => item.tratamiento && item.tratamiento.includes("Preventivo")).length
    const revisionCount = uniqueVacas.filter(item => item.tratamiento && item.tratamiento.includes("Revisión")).length

    const normalizarTexto = (texto) =>
        texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    const talonAdicionalCount = response.filter(item =>
        item.tratamiento && normalizarTexto(item.tratamiento).includes('tacon adicional')
    ).length

    const users = await fetchUsers()
    setUsers(users[0])

    setResponse(uniqueVacas)
    setTerapeuticosCount(terapeuticosCount)
    setPreventivosCount(preventivosCount)
    setRevisionCount(revisionCount)
    setTalonAdicionalCount(talonAdicionalCount)
    setPrices([terapeuticosCount, revisionCount, preventivosCount])
    setPricesExist(true)
    setHabilitado(false)
}

const fechaHoy = new Date()
const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000
const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria)
const fechaLocalTransformada = fechaLocal.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fechaHoyFormateada = fechaLocalTransformada.split('/').join('/')

const InfoRow = ({ icon, label, value }) => {
    if (!value) return null
    return (
        <View style={styles.infoRow}>
            <Icon name={icon} size={15} color={theme.colors.textFaint} />
            <Text variant="caption" style={styles.infoLabel}>{label}</Text>
            <Text variant="body" style={{ flex: 1 }} numberOfLines={2}>{value}</Text>
        </View>
    )
}

const Stat = ({ label, value, color }) => (
    <View style={styles.stat}>
        <Text variant="title" style={{ color }}>{value}</Text>
        <Text variant="caption" numberOfLines={1}>{label}</Text>
    </View>
)

export default function BillPage() {
    const location = useLocation()
    const { id, finca, cliente, lugar, nit, tel, direccion } = queryString.parse(location.search)

    const [listaVacas, setListaVacas] = useState([])
    const [totalCuenta, setTotalCuenta] = useState([])
    const [sumaTotal, setSumaTotal] = useState(0)
    const [buttonContinue, setButtonContinue] = useState(true)
    const [terapeuticosCount, setTerapeuticosCount] = useState(0)
    const [preventivosCount, setPreventivosCount] = useState(0)
    const [revisionCount, setRevisionCount] = useState(0)
    const [talonAdicionalCount, setTalonAdicionalCount] = useState(0)
    const [users, setUsers] = useState([])
    const [habilitado, setHabilitado] = useState(true)
    const [pricesExist, setPricesExist] = useState(false)
    const [prices, setPrices] = useState([terapeuticosCount, preventivosCount, revisionCount])
    const [response, setResponse] = useState([])
    const [report, setReport] = useState([])
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })
    const [endDate, setEndDate] = useState(() => { const d = new Date(); d.setHours(18, 59, 0, 0); return d })

    const continuar = async () => {
        setLoading(true)
        try {
            await fetchData(id, startDate, endDate, setResponse, setTerapeuticosCount, setPreventivosCount, setRevisionCount, setTalonAdicionalCount, setPrices, setPricesExist, setReport, setUsers, setHabilitado)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen header={<Header title="Factura" subtitle={[finca, cliente].filter(Boolean).join(' · ')} backTo="/home?isBill=true" />}>
            <Card style={{ marginTop: 4 }}>
                <View style={styles.cardHead}>
                    <Icon name="business-outline" size={18} color={theme.colors.primary} />
                    <Text variant="subheading" style={{ marginLeft: 8 }} numberOfLines={1}>{finca}</Text>
                </View>
                <InfoRow icon="person-outline" label="Cliente" value={cliente} />
                <InfoRow icon="id-card-outline" label="NIT" value={nit} />
                <InfoRow icon="call-outline" label="Tel" value={tel} />
                <InfoRow icon="location-outline" label="Lugar" value={lugar} />
                <InfoRow icon="home-outline" label="Dirección" value={direccion} />
                <InfoRow icon="calendar-outline" label="Fecha" value={fechaHoyFormateada} />
            </Card>

            <SectionTitle title="Periodo a facturar" icon="calendar-outline" subtitle="Se cuentan los animales atendidos entre estas fechas" />
            <Card>
                <DateRangePicker
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    habilitado={habilitado}
                    setHabilitado={setHabilitado}
                />
                {habilitado && (
                    <Button title="Continuar" iconRight="arrow-forward" size="lg" fullWidth loading={loading} onPress={continuar} style={{ marginTop: 16 }} />
                )}
            </Card>

            {pricesExist && (
                <>
                    <View style={styles.stats}>
                        <Stat label="Terapéuticos" value={terapeuticosCount} color={theme.colors.accent} />
                        <Stat label="Preventivos" value={preventivosCount} color={theme.colors.primary} />
                        <Stat label="Revisiones" value={revisionCount} color="#93C5FD" />
                        <Stat label="Tacón adic." value={talonAdicionalCount} color={theme.colors.text} />
                    </View>
                    <Precio
                        setTotalCuenta={setTotalCuenta}
                        totalCuenta={totalCuenta}
                        setSumaTotal={setSumaTotal}
                        sumaTotal={sumaTotal}
                        setButtonContinue={setButtonContinue}
                        buttonContinue={buttonContinue}
                        terapeuticosCount={terapeuticosCount}
                        preventivosCount={preventivosCount}
                        revisionCount={revisionCount}
                        talonAdicionalCount={talonAdicionalCount}
                        prices={prices}
                    />
                </>
            )}

            {!buttonContinue && (
                <>
                    <SectionTitle title="Documentos" icon="document-text-outline" subtitle="Se generan en Google Docs con los datos de arriba" />
                    <CreatePDF
                        finca={finca}
                        direccion={direccion}
                        cliente={cliente}
                        lugar={lugar}
                        totalCuenta={totalCuenta}
                        listaVacas={listaVacas}
                        fechaHoyFormateada={fechaHoyFormateada}
                        nit={nit}
                        tel={tel}
                        sumaTotal={sumaTotal}
                        users={users}
                    />
                    <CreatereportPDF
                        finca={finca}
                        direccion={direccion}
                        cliente={cliente}
                        lugar={lugar}
                        totalCuenta={totalCuenta}
                        listaVacas={listaVacas}
                        fechaHoyFormateada={fechaHoyFormateada}
                        nit={nit}
                        tel={tel}
                        sumaTotal={sumaTotal}
                        report={report}
                        users={users}
                    />
                </>
            )}
        </Screen>
    )
}

const styles = StyleSheet.create({
    cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    infoLabel: { width: 70, marginLeft: 8, marginTop: 1 },
    stats: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 12, paddingHorizontal: 6, marginTop: 20 },
    stat: { flex: 1, alignItems: 'center' },
})
