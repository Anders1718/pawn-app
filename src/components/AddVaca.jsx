import React from 'react'
import { Formik } from 'formik'
import { View } from 'react-native'
import { cowValidation } from '../validationSchemas/login'
import { addVaca } from '../hooks/useRepositories'
import { FormField, FormRow, Button } from '../ui'

const initialValues = (salaReport) => ({ id: '', sala: salaReport || '' })

export default function CowForm({ actualizarVacas, id, setModalCowAddOpen, finca, setSeleccionarAnimal, salaReport, setSalaReport }) {
    const submit = async (values) => {
        const sala = values.sala ? values.sala : finca
        await addVaca(id, values.id, sala)
        setSeleccionarAnimal({ nombre: values.id, sala })
        actualizarVacas()
        setModalCowAddOpen(false)
        setSalaReport(values.sala ? values.sala : '')
    }

    return (
        <Formik validationSchema={cowValidation} initialValues={initialValues(salaReport)} onSubmit={submit}>
            {({ handleSubmit, isSubmitting, isValid }) => (
                <View>
                    <FormRow>
                        <FormField name="id" label="ID del animal" placeholder="Ej. 850" icon="mci:cow" autoFocus returnKeyType="next" />
                        <FormField name="sala" label="Sala" placeholder="Opcional" icon="home-outline" hint="Si se deja vacía se usa el nombre de la finca." returnKeyType="done" onSubmitEditing={() => { if (isValid) handleSubmit() }} />
                    </FormRow>
                    <Button title="Guardar animal" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                </View>
            )}
        </Formik>
    )
}
