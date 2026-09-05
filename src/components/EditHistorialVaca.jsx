import React from 'react'
import { Formik } from 'formik'
import { Alert, View } from 'react-native'
import { historialVacasValidation } from '../validationSchemas/login'
import { editHistorialVacas, deleteHistorialVacas } from '../hooks/useRepositories'
import { FormField, FormRow, Button } from '../ui'

const initialValues = (props) => ({
    id_animal: props.nombre_vaca,
    enfermedades: props.enfermedades,
    extremidad: props.extremidad,
    tratamientos: props.tratamiento,
    nota: props.nota,
    fecha: props.fecha,
    sala: props.sala,
    id: props.id,
})

export default function EditHistorialForm(props) {
    const submit = async (values) => {
        await editHistorialVacas(values)
        props.fetchFincas()
        props.setIsOpen(false)
    }

    const confirmDelete = () => {
        Alert.alert(
            'Eliminar registro',
            '¿Estás seguro de que deseas eliminar este registro del historial?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteHistorialVacas({ id: props.id })
                        props.fetchFincas()
                        props.setIsOpen(false)
                    },
                },
            ],
            { cancelable: true }
        )
    }

    return (
        <Formik validationSchema={historialVacasValidation} initialValues={initialValues(props)} onSubmit={submit}>
            {({ handleSubmit, isSubmitting }) => (
                <View>
                    <FormRow>
                        <FormField name="id_animal" label="Animal" placeholder="ID del animal" icon="mci:cow" />
                        <FormField name="sala" label="Sala" placeholder="Sala" icon="home-outline" />
                    </FormRow>
                    <FormField name="tratamientos" label="Tratamiento" placeholder="Preventivo, Terapéutico..." icon="medkit-outline" />
                    <FormField name="extremidad" label="Extremidad" placeholder="AI-Lateral 2 11" icon="mci:foot-print" />
                    <FormField name="enfermedades" label="Enfermedades" placeholder="Enfermedades" icon="pulse-outline" multiline />
                    <FormField name="nota" label="Nota" placeholder="Observaciones" icon="chatbox-ellipses-outline" multiline />
                    <FormField name="fecha" label="Fecha (ISO)" placeholder="2025-01-31T00:00:00.000Z" icon="calendar-outline" hint="Formato guardado por la app; cámbialo solo si es necesario." />
                    <Button title="Guardar cambios" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                    <Button title="Eliminar registro" icon="trash-outline" variant="danger" fullWidth onPress={confirmDelete} style={{ marginTop: 10 }} />
                </View>
            )}
        </Formik>
    )
}
