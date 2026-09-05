import React from 'react'
import { Formik } from 'formik'
import { View } from 'react-native'
import { farmValidation } from '../validationSchemas/login'
import { addFinca } from '../hooks/useRepositories'
import { FormField, FormRow, Button } from '../ui'

const initialValues = { finca: '', nombre: '', nit: '', tel: '', ubicacion: '', direccion: '' }

export default function FincaForm({ actualizarFincas, setIsOpen }) {
    const submit = async (values) => {
        await addFinca(values)
        actualizarFincas()
        setIsOpen(false)
    }

    return (
        <Formik validationSchema={farmValidation} initialValues={initialValues} onSubmit={submit}>
            {({ handleSubmit, isSubmitting }) => (
                <View>
                    <FormField name="finca" label="Finca" placeholder="Nombre del predio" icon="mci:barn" autoFocus />
                    <FormField name="nombre" label="Cliente" placeholder="Nombre del propietario" icon="person-outline" />
                    <FormRow>
                        <FormField name="nit" label="NIT / C.C." placeholder="Documento" icon="id-card-outline" />
                        <FormField name="tel" label="Teléfono" placeholder="Número de contacto" icon="call-outline" keyboardType="phone-pad" />
                    </FormRow>
                    <FormField name="ubicacion" label="Ubicación" placeholder="Vereda o municipio" icon="location-outline" />
                    <FormField name="direccion" label="Dirección" placeholder="Dirección de facturación" icon="home-outline" returnKeyType="done" onSubmitEditing={handleSubmit} />
                    <Button title="Guardar finca" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                </View>
            )}
        </Formik>
    )
}
