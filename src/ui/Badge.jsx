import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

const tones = {
    primary: { bg: theme.colors.primarySoft, text: theme.colors.primary },
    accent: { bg: theme.colors.accentSoft, text: theme.colors.accent },
    info: { bg: theme.colors.infoSoft, text: '#93C5FD' },
    danger: { bg: theme.colors.dangerSoft, text: theme.colors.danger },
    neutral: { bg: theme.colors.surfaceAlt, text: theme.colors.textMuted },
}

export default function Badge({ label, tone = 'neutral', icon, style }) {
    const t = tones[tone] || tones.neutral
    return (
        <View style={[styles.base, { backgroundColor: t.bg }, style]}>
            {icon ? <Icon name={icon} size={13} color={t.text} style={{ marginRight: 4 }} /> : null}
            <Text style={{ color: t.text, fontSize: 12, fontWeight: theme.fontWeights.semibold }} numberOfLines={1}>{label}</Text>
        </View>
    )
}

// Picks the badge colour for a treatment string coming from the DB.
export function treatmentTone(tratamiento = '') {
    const t = String(tratamiento || '').toLowerCase()
    if (t.includes('terap')) return 'accent'
    if (t.includes('revis')) return 'info'
    if (t.includes('prevent')) return 'primary'
    return 'neutral'
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radius.pill,
    },
})
