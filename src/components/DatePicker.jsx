import React, { useState } from 'react'
import { View, Platform, StyleSheet, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text, Icon, PressableScale } from '../ui'
import theme from '../theme'

const fmt = (d) => d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

const DateField = ({ label, value, active, onPress }) => (
    <PressableScale onPress={onPress} style={[styles.field, active && styles.fieldActive]} accessibilityRole="button" accessibilityLabel={`${label}: ${fmt(value)}`}>
        <Icon name="calendar-outline" size={20} color={active ? theme.colors.primary : theme.colors.textFaint} />
        <View style={{ marginLeft: 10, flex: 1 }}>
            <Text variant="caption">{label}</Text>
            <Text variant="bodyLg" weight="semibold" numberOfLines={1}>{fmt(value)}</Text>
        </View>
    </PressableScale>
)

// Range picker used by reports and invoices. Same props as before so callers
// keep working: startDate/endDate + setters + setHabilitado.
export default function DateRangePicker({ startDate, endDate, setEndDate, setStartDate, setHabilitado }) {
    const [editing, setEditing] = useState(null) // 'start' | 'end' | null

    const onChangeStart = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || startDate
            setStartDate(currentDate)
            setHabilitado(true)
        }
        setEditing(null)
    }

    const onChangeEnd = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || endDate
            if (currentDate < startDate) {
                setHabilitado(false)
                Alert.alert('Rango inválido', 'La fecha de fin no puede ser anterior a la fecha de inicio')
            } else {
                setEndDate(currentDate)
                setHabilitado(true)
            }
        }
        setEditing(null)
    }

    const display = Platform.OS === 'ios' ? 'inline' : 'default'

    return (
        <View>
            <View style={styles.row}>
                <DateField label="Desde" value={startDate} active={editing === 'start'} onPress={() => setEditing(editing === 'start' ? null : 'start')} />
                <DateField label="Hasta" value={endDate} active={editing === 'end'} onPress={() => setEditing(editing === 'end' ? null : 'end')} />
            </View>
            {editing === 'start' && (
                <View style={styles.pickerWrap}>
                    <DateTimePicker testID="startDateTimePicker" value={startDate} mode="date" display={display} onChange={onChangeStart} themeVariant="dark" accentColor={theme.colors.primary} locale="es-CO" />
                </View>
            )}
            {editing === 'end' && (
                <View style={styles.pickerWrap}>
                    <DateTimePicker testID="endDateTimePicker" value={endDate} mode="date" display={display} onChange={onChangeEnd} themeVariant="dark" accentColor={theme.colors.primary} locale="es-CO" minimumDate={startDate} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 12 },
    field: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: 14,
        paddingVertical: 10,
        minHeight: 60,
    },
    fieldActive: { borderColor: theme.colors.primary },
    pickerWrap: { marginTop: 10, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: Platform.OS === 'ios' ? 6 : 0, overflow: 'hidden' },
})
