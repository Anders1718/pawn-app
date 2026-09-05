import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigate } from 'react-router-native'
import EditFincaForm from './EditFinca'
import { Card, Text, Icon, IconButton, Sheet } from '../ui'
import theme from '../theme'

const Meta = ({ icon, value }) => {
    if (!value) return null
    return (
        <View style={styles.meta}>
            <Icon name={icon} size={14} color={theme.colors.textFaint} />
            <Text variant="caption" style={styles.metaText} numberOfLines={1}>{value}</Text>
        </View>
    )
}

export default function RepositoryItem(props) {
    const navigate = useNavigate()
    const [isEditOpen, setIsEditOpen] = useState(false)

    const open = () => {
        if (props.isBill) {
            const params = new URLSearchParams({
                finca: props.nombre_finca || '',
                cliente: props.nombre_propietario || '',
                lugar: props.ubicacion || '',
                direccion: props.direccion || '',
                nit: props.nit || '',
                tel: props.telefono || '',
                id: String(props.id),
            })
            navigate(`/bill?${params.toString()}`)
        } else {
            const params = new URLSearchParams({
                finca: props.nombre_finca || '',
                id: String(props.id),
                cliente: props.nombre_propietario || '',
                lugar: props.ubicacion || '',
            })
            navigate(`/historial?${params.toString()}`)
        }
    }

    return (
        <>
            <Card onPress={open} onLongPress={!props.isBill ? () => setIsEditOpen(true) : undefined} accessibilityLabel={`Finca ${props.nombre_finca}`}>
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <Icon name="mci:barn" size={22} color={theme.colors.primary} />
                    </View>
                    <View style={styles.body}>
                        <Text variant="subheading" numberOfLines={1}>{props.nombre_finca}</Text>
                        <View style={styles.ownerRow}>
                            <Icon name="person-outline" size={14} color={theme.colors.textMuted} />
                            <Text variant="body" color="textMuted" numberOfLines={1} style={{ marginLeft: 5, flex: 1 }}>{props.nombre_propietario}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Meta icon="location-outline" value={props.ubicacion} />
                            <Meta icon="call-outline" value={props.telefono} />
                            <Meta icon="id-card-outline" value={props.nit} />
                        </View>
                    </View>
                    {props.isBill ? (
                        <Icon name="chevron-forward" size={20} color={theme.colors.textFaint} />
                    ) : (
                        <IconButton icon="create-outline" size={38} iconSize={19} onPress={() => setIsEditOpen(true)} accessibilityLabel="Editar finca" />
                    )}
                </View>
            </Card>

            <Sheet visible={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar finca" subtitle={props.nombre_finca}>
                <EditFincaForm actualizarFincas={props.actualizarFincas} setIsOpen={setIsEditOpen} {...props} />
            </Sheet>
        </>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    body: { flex: 1 },
    ownerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 10 },
    meta: { flexDirection: 'row', alignItems: 'center', maxWidth: '100%' },
    metaText: { marginLeft: 4 },
})
