import React from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, TextInput, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { enfermedadesValidation } from '../validationSchemas/login'
import { addEnfermedades } from '../hooks/useRepositories'

const initialValues = {
    nombre: '',
    id: '',
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
        marginTop: -5
    },
    form: {
        margin: 12,
        color: 'snow'
    }
})

const addEnfermedadesRepo = async (values, actualizarEnfermedades, setModalEnfermedadesOpen) => {
    await addEnfermedades(values.id.toUpperCase(), values.nombre );
    actualizarEnfermedades();
    setModalEnfermedadesOpen(false);
};

const FormikInputValue = ({ name, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <StyledTextInput
                error={meta.error}
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                {...props}
            />
            {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
        </>

    )
}

export default function AddEnfermedad({actualizarEnfermedades, setModalEnfermedadesOpen}) {
    return <Formik validationSchema={enfermedadesValidation} initialValues={initialValues} onSubmit={values => {
        addEnfermedadesRepo(values, actualizarEnfermedades, setModalEnfermedadesOpen)
    }}>
        {({ handleChange, handleSubmit, values }) => {
            return (
                <View style={styles.form}>
                    <FormikInputValue
                        name='nombre'
                        placeholder='Nombre Enfermedad'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='id'
                        placeholder='Identificación Enfermedad'
                        placeholderTextColor="#c2c0c0"
                    />

                    <Button onPress={handleSubmit} title='Guardar' />
                </View>
            )
        }}
    </Formik>
}