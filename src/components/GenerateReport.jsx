import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, TextInput, View } from 'react-native'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { reportValidation } from '../validationSchemas/login'
import { fetchHistorialVacas } from '../hooks/useRepositories'
import DateRangePicker from './DatePicker'

const initialValues = {
    fechaInicio: 'hola',
    fechaFin: 'hola',
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
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    datePicker: {
        marginBottom: 20,
    }
})

const obtenerHistorialVacas = async (values, id, setIsOpen, startDate, endDate) => {
    const report = await fetchHistorialVacas(id, startDate.toISOString(), endDate.toISOString());
    console.log(report);
    setIsOpen(false);
};

const FormikInputValue = ({ name, startDate, endDate, setEndDate, setStartDate, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
            />
            {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
        </>

    )
}

export default function GenerarInforme({ id, setIsOpen }) {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    return <Formik validationSchema={reportValidation} initialValues={initialValues} onSubmit={values => {
        obtenerHistorialVacas(values, id, setIsOpen, startDate, endDate)
    }}>
        {({ handleChange, handleSubmit, values }) => {




            return (
                <View style={styles.form}>
                    <StyledText fontWeight='bold' fontSize='subheading' style={styles.title}>Generar Informe</StyledText>
                    <View style={styles.datePicker}>
                        <FormikInputValue
                            name='fechaInicio'
                            placeholder='Fecha de inicio'
                            placeholderTextColor="#c2c0c0"
                            startDate={startDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            setStartDate={setStartDate}
                        />
                    </View>
                    <Button onPress={handleSubmit} title='Generar' />
                </View>
            )
        }}
    </Formik>
}