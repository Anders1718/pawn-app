import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

export default function EmptyState({ icon = 'file-tray-outline', title, description, action, style }) {
    return (
        <View style={[styles.wrap, style]}>
            <View style={styles.iconWrap}>
                <Icon name={icon} size={30} color={theme.colors.textMuted} />
            </View>
            <Text variant="subheading" align="center">{title}</Text>
            {description ? <Text variant="body" color="textMuted" align="center" style={styles.desc}>{description}</Text> : null}
            {action ? <View style={styles.action}>{action}</View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
    iconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    desc: { marginTop: 6, maxWidth: 320 },
    action: { marginTop: 18 },
})
