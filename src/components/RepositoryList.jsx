import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useLocation } from 'react-router-native'
import queryString from 'query-string'
import RepositoryItem from './RepositoryItem.jsx'
import FincaForm from './AddFinca.jsx'
import { useRepositories } from '../hooks/useRepositories.js'
import { Screen, Header, SearchBar, EmptyState, Sheet, IconButton, Button, Text } from '../ui'
import theme from '../theme'

export default function RepositoryList() {
    const location = useLocation()
    const { isBill } = queryString.parse(location.search)

    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [masterData, setMasterData] = useState([])

    const loadFincas = useCallback(async () => {
        const resultado = await useRepositories()
        setMasterData(resultado.fincas)
    }, [])

    useEffect(() => { loadFincas() }, [loadFincas])

    const filterData = search
        ? masterData.filter(item => (item.nombre_finca || '').toUpperCase().includes(search.toUpperCase()))
        : masterData

    return (
        <Screen
            scroll={false}
            header={
                <Header
                    title={isBill ? 'Facturar' : 'Fincas'}
                    subtitle={isBill ? 'Selecciona la finca a facturar' : `${masterData.length} ${masterData.length === 1 ? 'finca registrada' : 'fincas registradas'}`}
                    backTo="/"
                    right={!isBill ? <IconButton icon="add" variant="primary" onPress={() => setIsOpen(true)} accessibilityLabel="Agregar finca" /> : null}
                />
            }
        >
            <FlatList
                data={filterData}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={<SearchBar value={search} onChangeText={setSearch} placeholder="Buscar finca..." />}
                ListEmptyComponent={
                    <EmptyState
                        icon="mci:barn"
                        title={search ? 'Sin resultados' : 'Aún no hay fincas'}
                        description={search ? 'Prueba con otro nombre.' : 'Registra la primera finca para empezar a llevar el historial de sus animales.'}
                        action={!isBill && !search ? <Button title="Agregar finca" icon="add" onPress={() => setIsOpen(true)} /> : null}
                    />
                }
                renderItem={({ item }) => (
                    <RepositoryItem {...item} isBill={!!isBill} actualizarFincas={loadFincas} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <Sheet visible={isOpen} onClose={() => setIsOpen(false)} title="Nueva finca" subtitle="Datos del predio y del cliente">
                <FincaForm actualizarFincas={loadFincas} setIsOpen={setIsOpen} />
            </Sheet>
        </Screen>
    )
}

const styles = StyleSheet.create({
    list: { paddingTop: 4, paddingBottom: 40, flexGrow: 1 },
})
