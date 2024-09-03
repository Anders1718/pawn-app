import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { Alert, Button, StyleSheet, TextInput, View, Pressable } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { historialVacasValidation } from '../validationSchemas/login'
import { editHistorialVacas, deleteHistorialVacas } from '../hooks/useRepositories'

const initialValues = (props) => {
    return {
        id_animal: props.nombre_vaca,
        enfermedades: props.enfermedades,
        extremidad: props.extremidad,
        tratamientos: props.tratamiento,
        nota: props.nota,
        fecha: props.fecha,
        sala: props.sala,
        id: props.id,
    };
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

const addVacas = async (values, fetchFincas, setIsOpen, isDelete) => {
    if (isDelete) {
        await deleteHistorialVacas(values);
    } else {
        await editHistorialVacas(values);
    }
    fetchFincas();
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

export default function LogInPage(props) {

    const [isDelete, setIsDelete] = useState(false);

    return <Formik validationSchema={historialVacasValidation} initialValues={initialValues(props)} onSubmit={values => {
        addVacas(values, props.fetchFincas, props.setIsOpen, isDelete)
    }}>
        {({ handleChange, handleSubmit, values }) => {

            

            const pressDelete = () => {
                Alert.alert(
                    "Eliminar animal",
                    "¿Estás seguro de que deseas continuar?",
                    [
                      {
                        text: "Cancelar",
                        onPress: () => props.setIsOpen(false),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => {
                        setIsDelete(true);
                        handleSubmit();
                      } }
                    ],
                    { cancelable: false }
                  );
            }

            return (
                <View style={styles.form}>
                    <FormikInputValue
                        name='id_animal'
                        placeholder='Animal'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='extremidad'
                        placeholder='Extremidad'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='enfermedades'
                        placeholder='Enfermedades'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='tratamientos'
                        placeholder='Tratamientos'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='nota'
                        placeholder='Nota'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='fecha'
                        placeholder='Fecha'
                        placeholderTextColor="#c2c0c0"
                    />
                    <FormikInputValue
                        name='sala'
                        placeholder='Sala'
                        placeholderTextColor="#c2c0c0"
                    />
                    <Button onPress={handleSubmit} title='Editar' />
                    <Button onPress={pressDelete} title='Eliminar' />
                </View>
            )
        }}
    </Formik>
}