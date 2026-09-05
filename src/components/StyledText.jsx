import React from 'react'
import Text from '../ui/Text'

// Compatibility wrapper around the new Text primitive. Prefer importing
// Text from '../ui' in new code.
export default function StyledText({ children, align, color, fontSize, fontWeight, style, ...rest }) {
    const variant = fontSize === 'title' ? 'title' : fontSize === 'subheading' ? 'subheading' : 'body'
    const tone = color === 'primary' ? 'primary' : color === 'secondary' ? 'textMuted' : undefined
    return (
        <Text variant={variant} color={tone} weight={fontWeight === 'bold' ? 'bold' : undefined} align={align} style={style} {...rest}>
            {children}
        </Text>
    )
}
