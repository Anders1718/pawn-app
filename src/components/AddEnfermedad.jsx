import React from 'react'
import { Formik } from 'formik'
import { View } from 'react-native'
import { enfermedadesValidation } from '../validationSchemas/login'
import { addEnfermedades } from '../hooks/useRepositories'
import { FormField, FormRow, Button, Text } from '../ui'

const initialValues = { nombre: '', id: '' }

export default function AddEnfermedad({ actualizarEnfermedades, setModalEnfermedadesOpen }) {
    const submit = async (values) => {
        await addEnfermedades(values.id.toUpperCase(), values.nombre)
        actualizarEnfermedades()
        setModalEnfermedadesOpen(false)
    }

    return (
        <Formik validationSchema={enfermedadesValidation} initialValues={initialValues} onSubmit={submit}>
            {({ handleSubmit, isSubmitting }) => (
                <View>
                    <FormRow>
                        <FormField name="id" label="Código" placeholder="Ej. LB" icon="pricetag-outline" autoCapitalize="characters" autoFocus hint="Abreviatura que verás en el botón." />
                        <FormField name="nombre" label="Nombre de la enfermedad" placeholder="Ej. enfermedad de línea blanca" icon="medkit-outline" />
                    </FormRow>
                    <Button title="Guardar enfermedad" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                </View>
            )}
        </Formik>
    )
}
