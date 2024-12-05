import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { Alert, Button, StyleSheet, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { enfermedadesValidation } from '../validationSchemas/login'
import { updateEnfermedades, deleteEnfermedad } from '../hooks/useRepositories'

const initialValues = (nombre, id) => {
    return {
        nombre: nombre,
        id: id,
    }
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

const editEnfermedades = async (values,idEditPawn, actualizarEnfermedades, setModalEditSick, isDelete) => {
    if (isDelete) {
        await deleteEnfermedad(idEditPawn)
    } else {
        await updateEnfermedades(values, idEditPawn);
    }
    actualizarEnfermedades();
    setModalEditSick(false);
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

export default function EditEnfermedad({ actualizarEnfermedades, setModalEditSick, idEditPawn, valueEditPawn, namePawn }) {
    const [isDelete, setIsDelete] = useState(false);

    return <Formik validationSchema={enfermedadesValidation} initialValues={initialValues( valueEditPawn, namePawn)} onSubmit={values => {
        editEnfermedades(values, idEditPawn, actualizarEnfermedades, setModalEditSick, isDelete)
    }}>
        {({ handleChange, handleSubmit, values }) => {

            const pressDelete = () => {
                Alert.alert(
                    "Eliminar enfermedad",
                    "¿Estás seguro de que deseas continuar?",
                    [
                        {
                            text: "Cancelar",
                            onPress: () => setModalEditSick(false),
                            style: "cancel"
                        },
                        {
                            text: "OK", onPress: () => {
                                setIsDelete(true);
                                handleSubmit();
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }

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
                    <Button onPress={handleSubmit} title='Editar' />
                    <Button onPress={pressDelete} title='Eliminar' />

                </View>
            )
        }}
    </Formik>
}