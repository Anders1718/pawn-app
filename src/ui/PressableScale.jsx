import React, { useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'

// Layout props must live on the outer Pressable so flex rows and widths
// behave; visual props go on the animated inner view.
const LAYOUT_KEYS = new Set([
    'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'width', 'minWidth', 'maxWidth', 'alignSelf',
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
    'position', 'top', 'left', 'right', 'bottom', 'zIndex',
])

const splitStyle = (style) => {
    const flat = StyleSheet.flatten(style) || {}
    const outer = {}
    const inner = {}
    Object.keys(flat).forEach((key) => {
        if (LAYOUT_KEYS.has(key)) outer[key] = flat[key]
        else inner[key] = flat[key]
    })
    return { outer, inner }
}

// Pressable with a subtle scale + opacity feedback. Used by buttons, chips and
// tappable cards so every touch target reacts the same way.
export default function PressableScale({ children, style, disabled, scaleTo = 0.97, onPressIn, onPressOut, ...rest }) {
    const scale = useRef(new Animated.Value(1)).current
    const { outer, inner } = splitStyle(style)

    const animate = (to) => {
        Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 4 }).start()
    }

    return (
        <Pressable
            disabled={disabled}
            style={outer}
            onPressIn={(e) => { animate(scaleTo); onPressIn && onPressIn(e) }}
            onPressOut={(e) => { animate(1); onPressOut && onPressOut(e) }}
            {...rest}
        >
            {({ pressed }) => (
                <Animated.View style={[inner, { transform: [{ scale }], opacity: disabled ? 0.5 : pressed ? 0.9 : 1 }]}>
                    {typeof children === 'function' ? children({ pressed }) : children}
                </Animated.View>
            )}
        </Pressable>
    )
}
