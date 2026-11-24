import React, { useEffect, useState } from 'react'
import { Formik, useFormikContext } from 'formik'
import { StyleSheet, View } from 'react-native'
import { cowValidation } from '../validationSchemas/login'
import { addVaca, ultimaHistoriaVaca } from '../hooks/useRepositories'
import { FormField, FormRow, Button, Chip, Text } from '../ui'
import theme from '../theme'

const initialValues = (salaReport) => ({ id: '', sala: salaReport || '' })

const mismaSala = (a, b) => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase()

// Salas ya usadas por el cliente. Tocar una llena el campo "Sala"; tocar la
// seleccionada lo vacía (se usa el nombre de la finca).
function SalaPicker({ salas }) {
    const { values, setFieldValue } = useFormikContext()
    if (salas.length === 0) return null
    return (
        <View style={styles.picker}>
            <Text variant="label" style={styles.pickerLabel}>Salas del cliente</Text>
            <View style={styles.chips}>
                {salas.map(sala => {
                    const selected = mismaSala(values.sala, sala)
                    return <Chip key={sala} label={sala} icon="home-outline" selected={selected} onPress={() => setFieldValue('sala', selected ? '' : sala)} style={styles.chip} textStyle={styles.chipText} />
                })}
            </View>
        </View>
    )
}

// Campo del ID. Si el animal ya tiene un trabajo en la finca indica en qué sala.
function AnimalField({ fincaId, mostrarSala }) {
    const { values } = useFormikContext()
    const [salaAnterior, setSalaAnterior] = useState('')
    const nombre = values.id

    useEffect(() => {
        let vigente = true
        setSalaAnterior('')
        if (!mostrarSala || !nombre) return undefined
        const buscar = async () => {
            const historia = await ultimaHistoriaVaca(fincaId, nombre)
            if (vigente) setSalaAnterior(historia[0]?.sala || '')
        }
        const timer = setTimeout(() => { buscar().catch(() => {}) }, 250)
        return () => { vigente = false; clearTimeout(timer) }
    }, [fincaId, nombre, mostrarSala])

    return <FormField name="id" label="ID del animal" placeholder="Ej. 850" icon="mci:cow" autoFocus returnKeyType="next" hint={salaAnterior ? `Último trabajo en: Sala ${salaAnterior}` : undefined} />
}

export default function CowForm({ actualizarVacas, id, setModalCowAddOpen, finca, setSeleccionarAnimal, salaReport, setSalaReport, salas = [] }) {
    const submit = async (values) => {
        const salaEscrita = (values.sala || '').trim()
        const sala = salaEscrita || finca
        await addVaca(id, values.id, sala)
        setSeleccionarAnimal({ nombre: values.id, sala })
        actualizarVacas()
        setModalCowAddOpen(false)
        setSalaReport(salaEscrita)
    }

    // El nombre de la finca es el valor por defecto al dejar la sala vacía.
    const opciones = salas.filter(sala => !mismaSala(sala, finca))

    return (
        <Formik validationSchema={cowValidation} initialValues={initialValues(salaReport)} onSubmit={submit}>
            {({ handleSubmit, isSubmitting, isValid }) => (
                <View>
                    <FormRow>
                        <AnimalField fincaId={id} mostrarSala={salas.length > 1} />
                        <FormField name="sala" label="Sala" placeholder="Opcional" icon="home-outline" hint="Si se deja vacía se usa el nombre de la finca." returnKeyType="done" onSubmitEditing={() => { if (isValid) handleSubmit() }} />
                    </FormRow>
                    <SalaPicker salas={opciones} />
                    <Button title="Guardar animal" icon="save-outline" size="lg" fullWidth onPress={handleSubmit} loading={isSubmitting} style={{ marginTop: 6 }} />
                </View>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    picker: { marginBottom: theme.spacing.md },
    pickerLabel: { marginBottom: 6 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { maxWidth: '100%' },
    chipText: { flexShrink: 1 },
})
