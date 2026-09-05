import React from 'react'
import { StyleSheet, View } from 'react-native'
import PressableScale from './PressableScale'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

const tones = {
    primary: { bg: theme.colors.primarySoft, border: theme.colors.primary, text: theme.colors.primary },
    accent: { bg: theme.colors.accentSoft, border: theme.colors.accent, text: theme.colors.accent },
    info: { bg: theme.colors.infoSoft, border: theme.colors.info, text: '#93C5FD' },
    danger: { bg: theme.colors.dangerSoft, border: theme.colors.danger, text: theme.colors.danger },
}

const sizes = {
    sm: { h: 32, px: 12, font: 13 },
    md: { h: 42, px: 16, font: 15 },
    lg: { h: 56, px: 18, font: 20, minW: 64 },
    xl: { h: 72, px: 20, font: 26, minW: 84 },
}

// Selectable pill/tile. Used for option grids (diseases, treatments,
// severity, hoof) and for filter-like toggles.
export default function Chip({ label, selected, onPress, onLongPress, tone = 'primary', size = 'md', icon, disabled, style, textStyle }) {
    const t = tones[tone] || tones.primary
    const s = sizes[size] || sizes.md

    return (
        <PressableScale
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={450}
            disabled={disabled}
            scaleTo={0.94}
            accessibilityRole="button"
            accessibilityState={{ selected: !!selected, disabled: !!disabled }}
            style={[
                styles.base,
                { height: s.h, paddingHorizontal: s.px, minWidth: s.minW },
                selected ? { backgroundColor: t.bg, borderColor: t.border } : styles.idle,
                style,
            ]}
        >
            <View style={styles.row}>
                {icon ? <Icon name={icon} size={s.font + 2} color={selected ? t.text : theme.colors.textMuted} style={label ? { marginRight: 6 } : null} /> : null}
                {label !== undefined && label !== null ? (
                    <Text style={[{ fontSize: s.font, fontWeight: theme.fontWeights.semibold, color: selected ? t.text : theme.colors.text }, textStyle]} numberOfLines={1}>
                        {label}
                    </Text>
                ) : null}
            </View>
        </PressableScale>
    )
}

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.radius.md,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    idle: { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
})
