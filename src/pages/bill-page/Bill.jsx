import React, { useState } from 'react'
import { Formik, useField } from 'formik'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import StyledTextInput from '../../components/StyledTextInput'
import StyledText from '../../components/StyledText'
import { loginValidationSchema } from '../../validationSchemas/login'
import CreatePDF from '../../components/PDFGeneerate'
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import { Link } from 'react-router-native';
import Precio from './components/precio'
import DateRangePicker from '../../components/DatePicker'
import { fetchHistorialVacas } from '../../hooks/useRepositories';

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
        padding: 8,
        borderRadius: 15,
        borderWidth: 10,
        marginTop: 20,
        marginHorizontal: 80,
    },
    returnButton: {
        marginTop: 20,
        marginHorizontal: 40,
    }
})

const fetchData = async (id, startDate, endDate, setResponse, setTerapeuticosCount, setPreventivosCount, setPrices, setPricesExist, setHabilitado) => {
    const response = await fetchHistorialVacas(id, startDate.toISOString(), endDate.toISOString());

    const terapeuticosCount = response.filter(item => item.tratamiento === "Terapéutico").length;
    const preventivosCount = response.filter(item => item.tratamiento === "Preventivo").length;

    setResponse(response);
    setTerapeuticosCount(terapeuticosCount);
    setPreventivosCount(preventivosCount);
    setPrices([terapeuticosCount, preventivosCount]);
    setPricesExist(true);
    setHabilitado(false);
}

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

const fechaHoy = new Date();

const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000;
const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria);

const fechaLocalTransformada = fechaLocal.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fechaHoyFormateada = fechaLocalTransformada.split('/').join('/');

export default function BillPage() {

    const [listaVacas, setListaVacas] = useState([]);
    const [totalCuenta, setTotalCuenta] = useState([]);
    const [sumaTotal, setSumaTotal] = useState(0);
    const [buttonContinue, setButtonContinue] = useState(true);
    const [terapeuticosCount, setTerapeuticosCount] = useState(0);
    const [preventivosCount, setPreventivosCount] = useState(0);

    const [habilitado, setHabilitado] = useState(true);

    const [pricesExist, setPricesExist] = useState(false);

    const [prices, setPrices] = useState([terapeuticosCount, preventivosCount]);

    const [response, setResponse] = useState([]);

    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    });
    // ... existing code ...
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setHours(18, 59, 0, 0);
        return date;
    });





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

                    <DateRangePicker
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        habilitado={habilitado}
                        setHabilitado={setHabilitado}
                    />
                    {habilitado && (

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => fetchData(id, startDate, endDate, setResponse, setTerapeuticosCount, setPreventivosCount, setPrices, setPricesExist, setHabilitado)}
                        >
                            <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Continuar</StyledText>
                        </TouchableOpacity>
                    )}
                    {pricesExist && (
                        <Precio
                            setTotalCuenta={setTotalCuenta}
                            totalCuenta={totalCuenta}
                            setSumaTotal={setSumaTotal}
                            sumaTotal={sumaTotal}
                            setButtonContinue={setButtonContinue}
                            buttonContinue={buttonContinue}
                            terapeuticosCount={terapeuticosCount}
                            preventivosCount={preventivosCount}
                            prices={prices}
                        />
                    )}

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

