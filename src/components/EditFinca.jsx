import React from 'react'
import { Formik } from 'formik'
import { Alert, View } from 'react-native'
import { farmValidation } from '../validationSchemas/login'
import { editFinca, deleteFinca } from '../hooks/useRepositories'
import { FormField, FormRow, Button } from '../ui'

const initialValues = (props) => ({
    finca: props.nombre_finca,
    nombre: props.nombre_propietario,
    nit: props.nit,
    tel: props.telefono,
    ubicacion: props.ubicacion,
    direccion: props.direccion,
    id: props.id,
})

export default function EditFincaForm(props) {
    const submit = async (values) => {
        await editFinca(values)
        props.actualizarFincas()
        props.setIsOpen(false)
    }

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar finca',
            `Se eliminará "${props.nombre_finca}". ¿Deseas continuar?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteFinca({ id: props.id })
                        props.actualizarFincas()
                        props.setIsOpen(false)
                    },
                },
            ],
            { cancelable: true }
        )
    }

    return (
        <Formik validationSchema={farmValidation} initialValues={initialValues(props)} onSubmit={submit}>
            {({ handleSubmit, isSubmitting }) => (
                <View>
                    <FormField name="finca" label="Finca" placeholder="Nombre del predio" icon="mci:barn" />
                    <FormField name="nombre" label="Cliente" placeholder="Nombre del propietario" icon="person-outline" />
                    <FormRow>
                        <FormField name="nit" label="NIT / C.C." placeholder="Documento" icon="id-card-outline" />
                        <FormField name="tel" label="Teléfono" placeholder="Número de contacto" icon="call-outline" keyboardType="phone-pad" />
                    </FormRow>
                    <FormField name="ubicacion" label="Ubicación" placeholder="Vereda o municipio" icon="location-outline" />
                    <FormField name="direccion" label="Dirección" placeholder="Dirección de facturación" icon="home-outline" />
                    <Button title="Guardar cambios" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                    <Button title="Eliminar finca" icon="trash-outline" variant="danger" fullWidth onPress={confirmDelete} style={{ marginTop: 10 }} />
                </View>
            )}
        </Formik>
    )
}
