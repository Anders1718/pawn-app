import React from 'react'
import { useField } from 'formik'
import Input from './Input'

// Formik-bound Input. Replaces the FormikInputValue helpers that were copied
// into every form file.
export default function FormField({ name, showErrorImmediately = false, ...props }) {
    const [field, meta, helpers] = useField(name)
    const value = field.value === null || field.value === undefined ? '' : String(field.value)
    const error = meta.error && (meta.touched || showErrorImmediately) ? meta.error : undefined

    return (
        <Input
            value={value}
            onChangeText={(text) => helpers.setValue(text)}
            onBlur={() => helpers.setTouched(true)}
            error={error}
            {...props}
        />
    )
}
