import React from 'react'
import { StyleSheet } from 'react-native'
import PressableScale from './PressableScale'
import Icon from './Icon'
import theme from '../theme'

// Square icon-only tap target (44pt minimum for accessibility).
export default function IconButton({ icon, onPress, onLongPress, size = 44, iconSize = 22, color = theme.colors.text, variant = 'subtle', style, accessibilityLabel, disabled }) {
    const bg = variant === 'plain' ? 'transparent' : variant === 'danger' ? theme.colors.dangerSoft : variant === 'primary' ? theme.colors.primarySoft : theme.colors.surfaceAlt
    const tint = variant === 'danger' ? theme.colors.danger : variant === 'primary' ? theme.colors.primary : color
    return (
        <PressableScale
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={disabled}
            scaleTo={0.9}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            style={[styles.base, { width: size, height: size, borderRadius: size / 2.6, backgroundColor: bg }, style]}
        >
            <Icon name={icon} size={iconSize} color={tint} />
        </PressableScale>
    )
}

const styles = StyleSheet.create({
    base: { alignItems: 'center', justifyContent: 'center' },
})
