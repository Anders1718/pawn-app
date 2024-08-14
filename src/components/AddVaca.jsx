import React from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { cowValidation } from '../validationSchemas/login'
import { addVaca } from '../hooks/useRepositories'

const initialValues = {
    nombre: '',
    sala: '',
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

const addFincas = async (values, id, actualizarVacas, setModalCowAddOpen, finca, setSeleccionarAnimal) => {
    await addVaca(id, values.id, values.sala ? values.sala : finca);
    setSeleccionarAnimal({nombre: values.id, sala: values.sala ? values.sala : finca});
    actualizarVacas();
    setModalCowAddOpen(false)
};

const FormikInputValue = ({ name, onSubmitEditing, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <StyledTextInput
                error={meta.error}
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                onSubmitEditing={onSubmitEditing}
                {...props}
            />
            {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
        </>
    )
}

export default function CowValidation({actualizarVacas, id, setModalCowAddOpen, finca, setSeleccionarAnimal}) {
    return (
        <Formik 
            validationSchema={cowValidation} 
            initialValues={initialValues} 
            onSubmit={values => {
                addFincas(values, id, actualizarVacas, setModalCowAddOpen, finca, setSeleccionarAnimal)
            }}
        >
            {({ handleSubmit, isValid }) => (
                <View style={styles.form}>
                    <FormikInputValue
                        name='id'
                        placeholder='Id del animal'
                        placeholderTextColor="#c2c0c0"
                        keyboardType="numeric"
                        autoFocus={true}
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit()
                        }}
                    />
                    <FormikInputValue
                        name='sala'
                        placeholder='Sala'
                        placeholderTextColor="#c2c0c0"
                        onSubmitEditing={() => {
                            if (isValid) handleSubmit()
                        }}
                    />
                    <Button 
                        onPress={handleSubmit} 
                        title='Guardar' 
                    />
                </View>
            )}
        </Formik>
    )
}