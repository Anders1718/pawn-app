import React from 'react'
import { Text as RNText, StyleSheet } from 'react-native'
import theme from '../theme'

const sizes = theme.fontSizes

// Typography primitive. `variant` picks size + weight; `color` picks a token.
export default function Text({ children, variant = 'body', color, weight, align, style, ...rest }) {
    const s = [
        styles.base,
        styles[variant],
        color && { color: theme.colors[color] || color },
        weight && { fontWeight: theme.fontWeights[weight] || weight },
        align && { textAlign: align },
        style,
    ]
    return <RNText style={s} {...rest}>{children}</RNText>
}

const styles = StyleSheet.create({
    base: { color: theme.colors.text, fontSize: sizes.body, fontWeight: theme.fontWeights.normal },
    caption: { fontSize: sizes.caption, color: theme.colors.textMuted },
    body: { fontSize: sizes.body },
    bodyLg: { fontSize: sizes.bodyLg },
    label: { fontSize: 13, fontWeight: theme.fontWeights.semibold, color: theme.colors.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' },
    subheading: { fontSize: sizes.subheading, fontWeight: theme.fontWeights.semibold },
    title: { fontSize: sizes.title, fontWeight: theme.fontWeights.bold, letterSpacing: -0.3 },
    display: { fontSize: sizes.display, fontWeight: theme.fontWeights.bold, letterSpacing: -0.5 },
})
