import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import EditHistorialForm from './EditHistorialVaca'
import { Card, Text, Icon, Badge, treatmentTone, Sheet } from '../ui'
import theme from '../theme'

const convertirFecha = (fecha) => {
    const d = new Date(fecha)
    if (isNaN(d.getTime())) return fecha || ''
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

// Strips the zone letters so "AI-Lateral 2L 11" reads as "AI-Lateral 2 11".
const convertExtremidad = (value) => {
    if (!value) return value
    return value.split(',').map(seccion =>
        seccion.trim().split(' ').map(palabra => /\d/.test(palabra) ? palabra.replace(/[^\d]/g, '') : palabra).join(' ')
    ).join(', ')
}

const Row = ({ icon, label, value }) => {
    if (!value) return null
    return (
        <View style={styles.row}>
            <Icon name={icon} size={15} color={theme.colors.textFaint} style={{ marginTop: 2 }} />
            <Text variant="caption" style={styles.rowLabel}>{label}</Text>
            <Text variant="body" style={styles.rowValue}>{value}</Text>
        </View>
    )
}

export default function RepositoryHistorial(props) {
    const [isEditOpen, setIsEditOpen] = useState(false)

    return (
        <>
            <Card onPress={() => setIsEditOpen(true)} onLongPress={() => setIsEditOpen(true)} accessibilityLabel={`Registro de ${props.nombre_vaca}`}>
                <View style={styles.head}>
                    <View style={styles.idWrap}>
                        <Icon name="mci:cow" size={18} color={theme.colors.primary} />
                        <Text variant="subheading" style={{ marginLeft: 8 }} numberOfLines={1}>{props.nombre_vaca}</Text>
                    </View>
                    <Badge label={props.tratamiento || 'Sin tratamiento'} tone={treatmentTone(props.tratamiento)} />
                </View>
                <View style={styles.metaRow}>
                    <View style={styles.meta}>
                        <Icon name="calendar-outline" size={14} color={theme.colors.textMuted} />
                        <Text variant="caption" style={{ marginLeft: 4 }}>{convertirFecha(props.fecha)}</Text>
                    </View>
                    {props.sala ? (
                        <View style={styles.meta}>
                            <Icon name="home-outline" size={14} color={theme.colors.textMuted} />
                            <Text variant="caption" style={{ marginLeft: 4 }}>Sala {props.sala}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={styles.divider} />
                <Row icon="medkit-outline" label="Enfermedad" value={props.enfermedades} />
                <Row icon="mci:foot-print" label="Extremidad" value={convertExtremidad(props.extremidad) || 'N/A'} />
                {props.nota && props.nota !== 'N/A' ? <Row icon="chatbox-ellipses-outline" label="Nota" value={props.nota} /> : null}
                <View style={styles.editHint}>
                    <Icon name="create-outline" size={13} color={theme.colors.textFaint} />
                    <Text variant="caption" style={{ marginLeft: 4, color: theme.colors.textFaint }}>Toca para editar</Text>
                </View>
            </Card>

            <Sheet visible={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar registro" subtitle={`Animal ${props.nombre_vaca} · ${convertirFecha(props.fecha)}`}>
                <EditHistorialForm fetchFincas={props.fetchFincas} setIsOpen={setIsEditOpen} {...props} />
            </Sheet>
        </>
    )
}

const styles = StyleSheet.create({
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    idWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    metaRow: { flexDirection: 'row', gap: 14, marginTop: 6 },
    meta: { flexDirection: 'row', alignItems: 'center' },
    divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
    row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    rowLabel: { width: 84, marginLeft: 8 },
    rowValue: { flex: 1 },
    editHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
})
