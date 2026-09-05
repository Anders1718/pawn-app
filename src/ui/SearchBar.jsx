import React from 'react'
import { StyleSheet } from 'react-native'
import Input from './Input'
import IconButton from './IconButton'
import theme from '../theme'

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...', style }) {
    return (
        <Input
            icon="search"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
            style={[styles.wrap, style]}
            right={value ? <IconButton icon="close-circle" variant="plain" size={32} iconSize={20} color={theme.colors.textFaint} onPress={() => onChangeText('')} accessibilityLabel="Limpiar búsqueda" /> : null}
        />
    )
}

const styles = StyleSheet.create({
    wrap: { marginBottom: theme.spacing.md },
})
