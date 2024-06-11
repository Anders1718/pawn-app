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

export default function LogInPage({actualizarFincas, setIsOpen}) {
    return <Formik validationSchema={farmValidation} initialValues={initialValues} onSubmit={values => {
        addFincas(values, actualizarFincas, setIsOpen)
    }}>
        {({ handleChange, handleSubmit, values }) => {
            return (
                <View style={styles.form}>
                    <FormikInputValue
                        name='finca'
                        placeholder='Finca'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='nombre'
                        placeholder='Cliente'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='nit'
                        placeholder='NIT/C.C'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='tel'
                        placeholder='Tel'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='ubicacion'
                        placeholder='Ubicación'
                        placeholderTextColor="#c2c0c0"
                    />
                    <Button onPress={handleSubmit} title='Guardar' />
                </View>
            )
        }}
    </Formik>
}