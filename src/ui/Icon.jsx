import React from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import theme from '../theme'

// Thin wrapper so callers only pass a name. Names prefixed with "mci:" come
// from MaterialCommunityIcons, everything else from Ionicons.
export default function Icon({ name, size = 20, color = theme.colors.text, style }) {
    if (!name) return null
    if (name.startsWith('mci:')) {
        return <MaterialCommunityIcons name={name.slice(4)} size={size} color={color} style={style} />
    }
    return <Ionicons name={name} size={size} color={color} style={style} />
}
