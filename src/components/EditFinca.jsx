import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { farmValidation } from '../validationSchemas/login'
import { editFinca, deleteFinca } from '../hooks/useRepositories'

const initialValues = (props) => {
    return {
        finca: props.nombre_finca,
        nombre: props.nombre_propietario,
        nit: props.nit,
        tel: props.telefono,
        ubicacion: props.ubicacion,
        direccion: props.direccion,
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

const addFincas = async (values, actualizarFincas, setIsOpen, isDelete) => {
    if (isDelete) {
        await deleteFinca(values);
    } else {
        await editFinca(values);
    }
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

export default function LogInPage(props) {

    const [isDelete, setIsDelete] = useState(false);

    return <Formik validationSchema={farmValidation} initialValues={initialValues(props)} onSubmit={values => {
        addFincas(values, props.actualizarFincas, props.setIsOpen, isDelete)
    }}>
        {({ handleChange, handleSubmit, values }) => {

            

            const pressDelete = () => {
                Alert.alert(
                    "Eliminar predio",
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
                    <FormikInputValue
                        name='direccion'
                        placeholder='Dirección'
                        placeholderTextColor="#c2c0c0"
                    />
                    <Button onPress={handleSubmit} title='Editar' />
                    <Button onPress={pressDelete} title='Eliminar' />
                </View>
            )
        }}
    </Formik>
}