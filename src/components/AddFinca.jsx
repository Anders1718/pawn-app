import React from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, TextInput, View } from 'react-native'
import StyledTextInput from '../components/StyledTextInput'
import StyledText from '../components/StyledText'
import { farmValidation } from '../validationSchemas/login'
import { addFinca } from '../hooks/useRepositories'

const initialValues = {
    finca: '',
    nombre: '',
    nit: '',
    tel: '',
    ubicacion: '',
    direccion: '',
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

const addFincas = async (values, actualizarFincas, setIsOpen) => {
    await addFinca(values);
    actualizarFincas();
    setIsOpen(false);
};

const FormikInputValue = ({ name, onSubmitEditing, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <StyledTextInput
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                onSubmitEditing={onSubmitEditing}
                {...props}
            />
        </>

    )
}

export default function LogInPage({actualizarFincas, setIsOpen}) {
    return <Formik validationSchema={farmValidation} initialValues={initialValues} onSubmit={values => {
        addFincas(values, actualizarFincas, setIsOpen)
    }}>
        {({ handleChange, handleSubmit, values, isValid }) => {
            return (
                <View style={styles.form}>
                    <FormikInputValue
                        name='finca'
                        placeholder='Finca'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <FormikInputValue
                        name='nombre'
                        placeholder='Cliente'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <FormikInputValue
                        name='nit'
                        placeholder='NIT/C.C'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <FormikInputValue
                        name='tel'
                        placeholder='Tel'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <FormikInputValue
                        name='ubicacion'
                        placeholder='Ubicación'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <FormikInputValue
                        name='direccion'
                        placeholder='Dirección'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit();
                        }}
                    />
                    <Button onPress={handleSubmit} title='Guardar' />
                </View>
            )
        }}
    </Formik>
}