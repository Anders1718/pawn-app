import React from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Text from './Text'
import IconButton from './IconButton'
import useResponsive from './useResponsive'
import theme from '../theme'

// Modal dialog. Bottom-sheet on phones, centred dialog on tablets.
export default function Sheet({ visible, onClose, title, subtitle, children, scroll = true, footer, maxHeightRatio = 0.9 }) {
    const { isTablet, height } = useResponsive()

    const body = scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.body} bounces={false}>
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.body, styles.shrink]}>{children}</View>
    )

    return (
        <Modal visible={!!visible} transparent animationType={isTablet ? 'fade' : 'slide'} statusBarTranslucent onRequestClose={onClose}>
            <View style={styles.root}>
                <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.kav, isTablet ? styles.kavCenter : styles.kavBottom]} pointerEvents="box-none">
                    <View style={[styles.card, isTablet ? styles.cardCenter : styles.cardBottom, { maxHeight: height * maxHeightRatio }]}>
                        {!isTablet ? <View style={styles.grabber} /> : null}
                        <View style={styles.header}>
                            <View style={styles.flex}>
                                {title ? <Text variant="subheading" numberOfLines={1}>{title}</Text> : null}
                                {subtitle ? <Text variant="caption" style={{ marginTop: 2 }} numberOfLines={2}>{subtitle}</Text> : null}
                            </View>
                            {onClose ? <IconButton icon="close" onPress={onClose} size={38} iconSize={20} accessibilityLabel="Cerrar" /> : null}
                        </View>
                        {body}
                        {footer ? <View style={styles.footer}>{footer}</View> : null}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.overlay },
    backdrop: { ...StyleSheet.absoluteFillObject },
    kav: { flex: 1 },
    kavBottom: { justifyContent: 'flex-end' },
    kavCenter: { justifyContent: 'center', alignItems: 'center', padding: 24 },
    flex: { flex: 1 },
    shrink: { flexShrink: 1 },
    card: {
        flexShrink: 1,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        ...theme.shadow.sheet,
    },
    cardBottom: {
        width: '100%',
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    cardCenter: {
        width: '100%',
        maxWidth: 620,
        borderRadius: theme.radius.xl,
    },
    grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.borderStrong, alignSelf: 'center', marginTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
    body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    footer: { paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', gap: 12 },
})
