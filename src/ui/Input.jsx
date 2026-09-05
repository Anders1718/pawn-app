import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

// Labelled text field with focus ring, optional leading icon and error text.
export default function Input({ label, icon, error, hint, style, inputStyle, multiline, right, size = 'md', onFocus, onBlur, ...props }) {
    const [focused, setFocused] = useState(false)
    const height = multiline ? undefined : size === 'lg' ? 56 : 50

    return (
        <View style={[styles.wrap, style]}>
            {label ? <Text variant="label" style={styles.label}>{label}</Text> : null}
            <View style={[styles.field, { minHeight: height }, focused && styles.focused, error && styles.error, multiline && styles.multiline]}>
                {icon ? <Icon name={icon} size={20} color={focused ? theme.colors.primary : theme.colors.textFaint} style={styles.icon} /> : null}
                <TextInput
                    placeholderTextColor={theme.colors.textFaint}
                    style={[styles.input, { fontSize: size === 'lg' ? 18 : 16 }, multiline && styles.inputMultiline, inputStyle]}
                    multiline={multiline}
                    {...props}
                    onFocus={(e) => { setFocused(true); onFocus && onFocus(e) }}
                    onBlur={(e) => { setFocused(false); onBlur && onBlur(e) }}
                />
                {right}
            </View>
            {error ? <Text variant="caption" color="danger" style={styles.helper}>{error}</Text> : hint ? <Text variant="caption" style={styles.helper}>{hint}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { marginBottom: theme.spacing.md },
    label: { marginBottom: 6 },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: 14,
    },
    focused: { borderColor: theme.colors.primary },
    error: { borderColor: theme.colors.danger },
    multiline: { alignItems: 'flex-start', paddingVertical: 10 },
    icon: { marginRight: 10 },
    input: { flex: 1, color: theme.colors.text, paddingVertical: 12 },
    inputMultiline: { minHeight: 80, textAlignVertical: 'top', paddingVertical: 4 },
    helper: { marginTop: 6 },
})
