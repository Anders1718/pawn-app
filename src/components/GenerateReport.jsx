import React, { useState, useEffect } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { fetchHistorialVacas, fetchUsers } from '../hooks/useRepositories'
import DateRangePicker from './DatePicker'
import { Button, Text, Icon } from '../ui'
import theme from '../theme'

export default function GenerarInforme({ id, finca, cliente, lugar, setIsOpen }) {
    const [habilitado, setHabilitado] = useState(true)
    const [isConnected, setIsConnected] = useState(true)
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
    const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })
    const [endDate, setEndDate] = useState(() => { const d = new Date(); d.setHours(18, 59, 0, 0); return d })
    const [report, setReport] = useState([])
    const [users, setUsers] = useState([])

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}/${month}/${date.getFullYear()}`
    }
    const fechaHoyFormateada = formatDate(new Date())

    useEffect(() => {
        const checkConnectivity = async () => {
            try {
                const netInfoState = await NetInfo.fetch()
                setIsConnected(netInfoState.isConnected)
            } catch (error) {
                setIsConnected(true)
            }
        }
        const unsubscribe = NetInfo.addEventListener(state => setIsConnected(state.isConnected))
        checkConnectivity()
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const fetchUsersData = async () => {
            const result = await fetchUsers()
            setUsers(result[0])
        }
        fetchUsersData()
    }, [])

    const generateGoogleReport = async () => {
        if (!isConnected) {
            Alert.alert('Sin conexión', 'No hay conexión a internet')
            return
        }
        setIsLoadingGoogle(true)
        try {
            let reportData = report
            if (!reportData || reportData.length === 0) {
                const resultado = await fetchHistorialVacas(id, startDate.toISOString(), endDate.toISOString())
                reportData = Array.isArray(resultado) ? resultado : []
                setReport(reportData)
            }

            const requestBody = {
                finca: finca || '',
                lugar: lugar || '',
                cliente: cliente || '',
                report: Array.isArray(reportData) ? reportData : [],
                fechaHoyFormateada: fechaHoyFormateada || '',
                users: users || {},
                nombreDocumento: `Informe ${finca} - ${fechaHoyFormateada}`,
            }

            const response = await fetch('https://contractual.papeleo.co/api/generate-pawn-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            })
            const result = await response.json()

            if (result.success) {
                Alert.alert('Éxito', 'Documento generado exitosamente en Google Docs')
                if (setIsOpen) setIsOpen(false)
            } else {
                Alert.alert('Error', result.error || 'Error al generar el documento')
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al servidor')
        } finally {
            setIsLoadingGoogle(false)
        }
    }

    return (
        <View>
            <Text variant="label" style={{ marginBottom: 8 }}>Periodo del informe</Text>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setEndDate={(d) => { setEndDate(d); setReport([]) }}
                setStartDate={(d) => { setStartDate(d); setReport([]) }}
                setHabilitado={setHabilitado}
            />
            {!isConnected && (
                <View style={styles.offline}>
                    <Icon name="cloud-offline-outline" size={18} color={theme.colors.accent} />
                    <Text variant="caption" style={{ marginLeft: 8, flex: 1, color: theme.colors.accent }}>Sin conexión a internet. El informe se genera en Google Docs y requiere conexión.</Text>
                </View>
            )}
            <Button
                title="Generar informe en Google Docs"
                icon="logo-google"
                size="lg"
                fullWidth
                loading={isLoadingGoogle}
                disabled={!habilitado || !isConnected}
                onPress={generateGoogleReport}
                style={{ marginTop: 18 }}
            />
            <Text variant="caption" align="center" style={{ marginTop: 10 }}>Incluye todos los registros de {finca} entre las fechas seleccionadas.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    offline: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.accentSoft, borderRadius: theme.radius.md, padding: 12, marginTop: 14 },
})
