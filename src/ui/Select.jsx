import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import Text from './Text'
import Icon from './Icon'
import theme from '../theme'

// Themed wrapper around react-native-element-dropdown. onChange receives
// (value, label, item) so existing callers keep working.
export default function Select({ data = [], value, onChange, placeholder = 'Seleccionar', label, icon, search = true, searchPlaceholder = 'Buscar...', style, disabled }) {
    return (
        <View style={[styles.wrap, style]}>
            {label ? <Text variant="label" style={styles.label}>{label}</Text> : null}
            <Dropdown
                style={[styles.dropdown, disabled && { opacity: 0.5 }]}
                containerStyle={styles.list}
                itemContainerStyle={styles.item}
                itemTextStyle={styles.itemText}
                activeColor={theme.colors.surfaceHover}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selected}
                inputSearchStyle={styles.search}
                iconStyle={styles.chevron}
                iconColor={theme.colors.textMuted}
                data={data}
                search={search}
                maxHeight={320}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                value={value}
                disable={disabled}
                renderLeftIcon={icon ? () => <Icon name={icon} size={20} color={theme.colors.primary} style={styles.leftIcon} /> : undefined}
                onChange={(item) => onChange && onChange(item.value, item.label, item.sala, item)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: { marginBottom: theme.spacing.md },
    label: { marginBottom: 6 },
    dropdown: {
        height: 52,
        backgroundColor: theme.colors.surfaceAlt,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.md,
        paddingHorizontal: 14,
    },
    list: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.md, overflow: 'hidden', marginTop: 4 },
    item: { paddingVertical: 2 },
    itemText: { color: theme.colors.text, fontSize: 16 },
    placeholder: { color: theme.colors.textFaint, fontSize: 16 },
    selected: { color: theme.colors.text, fontSize: 16, fontWeight: theme.fontWeights.medium },
    search: { height: 44, fontSize: 16, color: theme.colors.text, borderColor: theme.colors.border, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surfaceAlt },
    chevron: { width: 22, height: 22 },
    leftIcon: { marginRight: 10 },
})
