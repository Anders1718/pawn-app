import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import PressableScale from './PressableScale'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

const variants = {
    primary: { bg: theme.colors.primary, text: '#062B1E', border: theme.colors.primary },
    secondary: { bg: theme.colors.surfaceAlt, text: theme.colors.text, border: theme.colors.borderStrong },
    soft: { bg: theme.colors.primarySoft, text: theme.colors.primary, border: 'transparent' },
    ghost: { bg: 'transparent', text: theme.colors.textMuted, border: 'transparent' },
    danger: { bg: theme.colors.dangerSoft, text: theme.colors.danger, border: 'transparent' },
    info: { bg: theme.colors.infoSoft, text: '#93C5FD', border: 'transparent' },
    accent: { bg: theme.colors.accent, text: '#3B2300', border: theme.colors.accent },
}

const sizes = {
    sm: { height: 38, px: 14, font: 14, icon: 16 },
    md: { height: 48, px: 18, font: 16, icon: 19 },
    lg: { height: 56, px: 22, font: 18, icon: 22 },
}

export default function Button({ title, icon, iconRight, variant = 'primary', size = 'md', loading, disabled, fullWidth, style, textStyle, onPress, onLongPress, align = 'center' }) {
    const v = variants[variant] || variants.primary
    const s = sizes[size] || sizes.md
    const isDisabled = disabled || loading

    return (
        <PressableScale
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={title}
            style={[
                styles.base,
                { height: s.height, paddingHorizontal: s.px, backgroundColor: v.bg, borderColor: v.border, justifyContent: align === 'left' ? 'flex-start' : 'center' },
                fullWidth && styles.full,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={v.text} />
            ) : (
                <View style={styles.row}>
                    {icon ? <Icon name={icon} size={s.icon} color={v.text} style={title ? styles.iconLeft : null} /> : null}
                    {title ? <Text style={[{ color: v.text, fontSize: s.font, fontWeight: theme.fontWeights.semibold }, textStyle]} numberOfLines={1}>{title}</Text> : null}
                    {iconRight ? <Icon name={iconRight} size={s.icon} color={v.text} style={styles.iconRight} /> : null}
                </View>
            )}
        </PressableScale>
    )
}

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.radius.md,
        borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    full: { alignSelf: 'stretch', width: '100%' },
    row: { flexDirection: 'row', alignItems: 'center' },
    iconLeft: { marginRight: 8 },
    iconRight: { marginLeft: 8 },
})
