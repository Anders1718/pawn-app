import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import useResponsive from './useResponsive'
import theme from '../theme'

// Page scaffold: themed background, keyboard avoidance, centred + capped
// content column on tablets, optional sticky footer.
// scroll=false renders children in a flex:1 container (use for FlatList).
export default function Screen({ children, header, footer, scroll = true, contentStyle, style, keyboardOffset = 0 }) {
    const { gutter, contentWidth } = useResponsive()
    const column = { width: '100%', maxWidth: contentWidth, alignSelf: 'center', paddingHorizontal: gutter }

    return (
        <View style={[styles.root, style]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex} keyboardVerticalOffset={keyboardOffset}>
                {header}
                {scroll ? (
                    <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[column, contentStyle]}>{children}</View>
                    </ScrollView>
                ) : (
                    <View style={[styles.flex, column, contentStyle]}>{children}</View>
                )}
                {footer ? (
                    <View style={styles.footer}>
                        <View style={[column, styles.footerInner]}>{footer}</View>
                    </View>
                ) : null}
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.bg },
    flex: { flex: 1 },
    scrollContent: { paddingBottom: 48, flexGrow: 1 },
    footer: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.bg,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    },
    footerInner: { flexDirection: 'row', gap: 12 },
})
