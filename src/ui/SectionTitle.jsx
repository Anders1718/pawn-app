import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

export default function SectionTitle({ title, subtitle, icon, right, style }) {
    return (
        <View style={[styles.wrap, style]}>
            <View style={styles.left}>
                {icon ? <Icon name={icon} size={18} color={theme.colors.primary} style={styles.icon} /> : null}
                <View style={{ flex: 1 }}>
                    <Text variant="subheading" numberOfLines={1}>{title}</Text>
                    {subtitle ? <Text variant="caption" style={{ marginTop: 2 }}>{subtitle}</Text> : null}
                </View>
            </View>
            {right}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    icon: { marginRight: 8 },
})
