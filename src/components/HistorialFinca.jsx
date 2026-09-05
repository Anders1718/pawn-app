import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useLocation } from 'react-router-native'
import queryString from 'query-string'
import RepositoryHistorial from './RepositoryIHistorial.jsx'
import GenerarInforme from './GenerateReport.jsx'
import { historialVacas } from '../hooks/useRepositories.js'
import { Screen, Header, SearchBar, EmptyState, Sheet, IconButton, Button, Text, Icon } from '../ui'
import theme from '../theme'

const Stat = ({ label, value, color }) => (
    <View style={styles.stat}>
        <Text variant="title" style={{ color }}>{value}</Text>
        <Text variant="caption" numberOfLines={1}>{label}</Text>
    </View>
)

export default function HistorialFinca() {
    const location = useLocation()
    const { finca, id, cliente, lugar } = queryString.parse(location.search)

    const [search, setSearch] = useState('')
    const [masterData, setMasterData] = useState([])
    const [reportOpen, setReportOpen] = useState(false)

    const loadHistorial = useCallback(async () => {
        const resultado = await historialVacas(id)
        setMasterData(resultado.vacas)
    }, [id])

    useEffect(() => { loadHistorial() }, [loadHistorial])

    const filterData = search
        ? masterData.filter(item => (item.nombre_vaca || '').toUpperCase().includes(search.toUpperCase()))
        : masterData

    const count = (needle) => masterData.filter(i => (i.tratamiento || '').toLowerCase().includes(needle)).length

    return (
        <Screen
            scroll={false}
            header={
                <Header
                    title={finca || 'Historial'}
                    subtitle={[cliente, lugar].filter(Boolean).join(' · ')}
                    backTo="/home"
                    right={<IconButton icon="document-text-outline" variant="primary" onPress={() => setReportOpen(true)} accessibilityLabel="Generar informe" />}
                />
            }
        >
            <FlatList
                data={filterData}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View>
                        {masterData.length > 0 && (
                            <View style={styles.stats}>
                                <Stat label="Registros" value={masterData.length} color={theme.colors.text} />
                                <Stat label="Preventivos" value={count('prevent')} color={theme.colors.primary} />
                                <Stat label="Terapéuticos" value={count('terap')} color={theme.colors.accent} />
                                <Stat label="Revisiones" value={count('revis')} color="#93C5FD" />
                            </View>
                        )}
                        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar animal..." />
                    </View>
                }
                ListEmptyComponent={
                    <EmptyState
                        icon="mci:cow"
                        title={search ? 'Sin resultados' : 'Sin registros todavía'}
                        description={search ? 'Prueba con otro ID de animal.' : 'Los casos registrados desde la pantalla Animal aparecerán aquí.'}
                    />
                }
                renderItem={({ item }) => <RepositoryHistorial fetchFincas={loadHistorial} {...item} />}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <Sheet visible={reportOpen} onClose={() => setReportOpen(false)} title="Generar informe" subtitle={finca}>
                <GenerarInforme id={id} finca={finca} cliente={cliente} lugar={lugar} setIsOpen={setReportOpen} />
            </Sheet>
        </Screen>
    )
}

const styles = StyleSheet.create({
    list: { paddingTop: 4, paddingBottom: 40, flexGrow: 1 },
    stats: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 12, paddingHorizontal: 6, marginBottom: 14 },
    stat: { flex: 1, alignItems: 'center' },
})
