import React from 'react'
import { Text, StyleSheet } from 'react-native'
import theme from '../theme'

export default function StyledText ({children, align, color, fontSize, fontWeight, style, ...restOfProps}) {
    
    const textStyle = [
        styles.text,
        align === 'center' && styles.textAlignCenter,
        color === 'primary' && styles.colorPrimary,
        color === 'secondary' && styles.colorSecondary,
        fontSize === 'subheading' && styles.subheading,
        fontSize === 'title' && styles.title,
        fontWeight === 'bold' && styles.bold,
        style
    ]
    return (
        <Text style={textStyle} {...restOfProps}>
            {children}
        </Text> 
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: theme.fontSizes.body,
        color: theme.colors.textPrimary,
        // fontFamily: 'Wonder',
        fontWeight: theme.fontWeights.normal
    },
    colorPrimary: {
        color: theme.colors.primary
    },
    colorSecondary: {
        color: theme.colors.textSecondary
    },
    bold: {
        fontWeight: theme.fontWeights.bold
    },
    subheading: { 
        fontSize: theme.fontSizes.subheading
    },
    title: {
        fontSize: theme.fontSizes.title
    },
    textAlignCenter : {
        textAlign: 'center'
    }
})