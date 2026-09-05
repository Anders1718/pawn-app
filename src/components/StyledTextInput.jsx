import React from 'react'
import Input from '../ui/Input'

// Compatibility wrapper; new code should use Input from '../ui'.
export default function StyledTextInput(props) {
    return <Input {...props} />
}
