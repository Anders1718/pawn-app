import React from 'react'
import { Alert, View, StyleSheet } from 'react-native'
import { deleteVacasId } from '../hooks/useRepositories'
import { Card, Text, Icon, IconButton } from '../ui'
import theme from '../theme'

export default function RepositoryVacasEdit(props) {
    const deleteAnimal = async () => {
        await deleteVacasId(props.id)
        props.fetchFincas()
        props.actualizarVacas()
    }

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar animal',
            `Se eliminará el animal ${props.nombre_vaca}. ¿Deseas continuar?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: deleteAnimal },
            ],
            { cancelable: true }
        )
    }

    return (
        <Card padded={false} style={styles.card} tone="alt">
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Icon name="mci:cow" size={18} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLg" weight="semibold" numberOfLines={1}>{props.nombre_vaca}</Text>
                    {props.sala ? <Text variant="caption" numberOfLines={1}>Sala {props.sala}</Text> : null}
                </View>
                <IconButton icon="trash-outline" variant="danger" size={38} iconSize={18} onPress={confirmDelete} accessibilityLabel={`Eliminar animal ${props.nombre_vaca}`} />
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: { paddingHorizontal: 12, paddingVertical: 10, shadowOpacity: 0, elevation: 0 },
    row: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
})
