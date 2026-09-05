import React from 'react'
import { StyleSheet, View } from 'react-native'
import PressableScale from './PressableScale'
import theme from '../theme'

// Surface container. Pass onPress to make the whole card tappable.
export default function Card({ children, style, onPress, onLongPress, padded = true, tone = 'surface', ...rest }) {
    const bg = tone === 'alt' ? theme.colors.surfaceAlt : tone === 'primary' ? theme.colors.primarySoft : tone === 'info' ? theme.colors.infoSoft : theme.colors.surface
    const border = tone === 'primary' ? theme.colors.primary : tone === 'info' ? theme.colors.info : theme.colors.border
    const base = [styles.card, { backgroundColor: bg, borderColor: border }, padded && styles.padded, style]

    if (onPress || onLongPress) {
        return (
            <PressableScale onPress={onPress} onLongPress={onLongPress} delayLongPress={450} style={base} scaleTo={0.985} {...rest}>
                {children}
            </PressableScale>
        )
    }
    return <View style={base} {...rest}>{children}</View>
}

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        ...theme.shadow.card,
    },
    padded: { padding: theme.spacing.lg },
})
