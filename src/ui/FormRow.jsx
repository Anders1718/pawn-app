import React from 'react'
import { View } from 'react-native'
import useResponsive from './useResponsive'

// Lays out form fields side by side on tablets and stacked on phones.
export default function FormRow({ children, style }) {
    const { isTablet } = useResponsive()
    const items = React.Children.toArray(children)
    if (!isTablet) return <View style={style}>{items}</View>
    return (
        <View style={[{ flexDirection: 'row', gap: 12 }, style]}>
            {items.map((child, i) => <View key={i} style={{ flex: 1 }}>{child}</View>)}
        </View>
    )
}
