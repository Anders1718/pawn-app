import React from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { useNavigate } from 'react-router-native'
import Text from './Text'
import IconButton from './IconButton'
import useResponsive from './useResponsive'
import theme from '../theme'

// Screen header with optional back navigation and a right-hand slot.
// `backTo` navigates to a route; `onBack` runs a callback instead.
export default function Header({ title, subtitle, backTo, onBack, right, large, style }) {
    const navigate = useNavigate()
    const { gutter, contentWidth } = useResponsive()
    const hasBack = !!(backTo || onBack)

    const goBack = () => {
        if (onBack) return onBack()
        navigate(backTo)
    }

    return (
        <View style={[styles.wrap, { paddingTop: Constants.statusBarHeight + 6 }, style]}>
            <View style={[styles.inner, { paddingHorizontal: gutter, maxWidth: contentWidth }]}>
                {hasBack ? <IconButton icon="chevron-back" onPress={goBack} accessibilityLabel="Volver" style={styles.back} /> : null}
                <View style={styles.titles}>
                    <Text variant={large ? 'display' : 'title'} numberOfLines={1}>{title}</Text>
                    {subtitle ? <Text variant="body" color="textMuted" numberOfLines={1} style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                {right ? <View style={styles.right}>{right}</View> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { backgroundColor: theme.colors.bg, paddingBottom: 10 },
    inner: { flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'center' },
    back: { marginRight: 10 },
    titles: { flex: 1 },
    subtitle: { marginTop: 2 },
    right: { marginLeft: 10, flexDirection: 'row', alignItems: 'center' },
})
