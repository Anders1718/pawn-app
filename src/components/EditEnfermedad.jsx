import React from 'react'
import { Formik } from 'formik'
import { Alert, View } from 'react-native'
import { enfermedadesValidation } from '../validationSchemas/login'
import { updateEnfermedades, deleteEnfermedad } from '../hooks/useRepositories'
import { FormField, FormRow, Button } from '../ui'

export default function EditEnfermedad({ actualizarEnfermedades, setModalEditSick, idEditPawn, valueEditPawn, namePawn }) {
    const submit = async (values) => {
        await updateEnfermedades(values, idEditPawn)
        actualizarEnfermedades()
        setModalEditSick(false)
    }

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar enfermedad',
            `Se eliminará "${namePawn}" de la lista. ¿Deseas continuar?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteEnfermedad(idEditPawn)
                        actualizarEnfermedades()
                        setModalEditSick(false)
                    },
                },
            ],
            { cancelable: true }
        )
    }

    return (
        <Formik validationSchema={enfermedadesValidation} initialValues={{ nombre: valueEditPawn, id: namePawn }} onSubmit={submit}>
            {({ handleSubmit, isSubmitting }) => (
                <View>
                    <FormRow>
                        <FormField name="id" label="Código" placeholder="Ej. LB" icon="pricetag-outline" autoCapitalize="characters" />
                        <FormField name="nombre" label="Nombre de la enfermedad" placeholder="Nombre completo" icon="medkit-outline" />
                    </FormRow>
                    <Button title="Guardar cambios" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                    <Button title="Eliminar enfermedad" icon="trash-outline" variant="danger" fullWidth onPress={confirmDelete} style={{ marginTop: 10 }} />
                </View>
            )}
        </Formik>
    )
}
