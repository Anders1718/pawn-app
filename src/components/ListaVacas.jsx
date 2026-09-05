import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { useLocation } from 'react-router-native'
import queryString from 'query-string'
import RepositoryVacasEdit from './RepositoryVacasEdit.jsx'
import { listadoVacasId } from '../hooks/useRepositories.js'
import { SearchBar, EmptyState } from '../ui'

export default function ListaVacas({ setIsEdit, actualizarVacas }) {
    const location = useLocation()
    const { id } = queryString.parse(location.search)

    const [search, setSearch] = useState('')
    const [masterData, setMasterData] = useState([])

    const loadVacas = useCallback(async () => {
        const resultado = await listadoVacasId(id)
        setMasterData(resultado.vacas)
    }, [id])

    useEffect(() => { loadVacas() }, [loadVacas])

    const filterData = search
        ? masterData.filter(item => (item.nombre_vaca || '').toUpperCase().includes(search.toUpperCase()))
        : masterData

    return (
        <View style={styles.container}>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar animal..." />
            <FlatList
                data={filterData}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                renderItem={({ item }) => (
                    <RepositoryVacasEdit setIsEdit={setIsEdit} actualizarVacas={actualizarVacas} fetchFincas={loadVacas} {...item} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                ListEmptyComponent={<EmptyState icon="mci:cow" title={search ? 'Sin resultados' : 'No hay animales'} description={search ? 'Prueba con otro ID.' : 'Agrega animales desde el botón Añadir.'} />}
                contentContainerStyle={{ paddingBottom: 12 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { minHeight: 260, flexShrink: 1 },
    list: { flexShrink: 1 },
})
