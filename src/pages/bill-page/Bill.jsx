import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { StyleSheet, View, ScrollView } from 'react-native'
import StyledTextInput from '../../components/StyledTextInput'
import StyledText from '../../components/StyledText'
import { loginValidationSchema } from '../../validationSchemas/login'
import CreatePDF from '../../components/PDFGeneerate'
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import { Link } from 'react-router-native';
import Informe from './components/informe'
import Sala from './components/sala'
import Precio from './components/precio'

const initialValues = {
    email: '',
    password: ''
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
        marginTop: -5
    },
    form: {
        paddingVertical: 50,

    },
    button: {
        borderColor: "#334155",
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10
    }
})

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

const fechaHoy = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
const fechaHoyFormateada = fechaHoy.split('/').join('/');

export default function BillPage() {

    const [listaVacas, setListaVacas] = useState([]);
    const [totalCuenta, setTotalCuenta] = useState([]);
    const [sumaTotal, setSumaTotal] = useState(0);
    const [buttonContinue, setButtonContinue] = useState(false);

    return <Formik validationSchema={loginValidationSchema} initialValues={initialValues} onSubmit={values => console.log(values)}>
        {({ handleChange, handleSubmit, values }) => {

            const location = useLocation();
            const queryParams = queryString.parse(location.search);
            const { id, finca, cliente, lugar, nit, tel } = queryParams;

            return (
                <ScrollView
                    contentContainerStyle={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    <Link to='/home?isBill=true'>
                        <StyledText fontWeight='bold' color='secondary' fontSize='subheading' style={styles.returnButton}>⬅ Volver</StyledText>
                    </Link>
                    <Informe cliente={cliente} lugar={lugar} finca={finca} fechaHoyFormateada={fechaHoyFormateada} />
                    <Sala listaVacas={listaVacas} setListaVacas={setListaVacas} />
                    <Precio
                        setTotalCuenta={setTotalCuenta}
                        totalCuenta={totalCuenta}
                        setSumaTotal={setSumaTotal}
                        sumaTotal={sumaTotal}
                        setButtonContinue={setButtonContinue}
                        buttonContinue={buttonContinue}
                    />
                    {!buttonContinue && (
                        <CreatePDF
                            finca={finca}
                            cliente={cliente}
                            lugar={lugar}
                            totalCuenta={totalCuenta}
                            listaVacas={listaVacas}
                            fechaHoyFormateada={fechaHoyFormateada}
                            nit={nit}
                            tel={tel}
                            sumaTotal={sumaTotal}
                        />
                    )}
                </ScrollView>
            )
        }}
    </Formik>
}