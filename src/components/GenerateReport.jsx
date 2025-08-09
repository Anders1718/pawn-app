import React, { useState, useEffect } from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, TextInput, View, TouchableOpacity, Alert } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import StyledTextInput from './StyledTextInput'
import StyledText from './StyledText'
import { reportValidation } from '../validationSchemas/login'
import { fetchHistorialVacas, fetchUsers } from '../hooks/useRepositories'
import DateRangePicker from './DatePicker'
import GenerateReport from './PDFGeneerateReport'

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
    },
})

const obtenerHistorialVacas = async (values, id, startDate, endDate, setReport, setIsOpen, setUsers) => {
    const report = await fetchHistorialVacas(id, startDate.toISOString(), endDate.toISOString());
    setReport(report);
};

const FormikInputValue = ({ name, startDate, endDate, setEndDate, setStartDate, setReport, setHabilitado, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                setHabilitado={setHabilitado}
            />
            {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
        </>

    )
}

export default function GenerarInforme({ id, finca, cliente, lugar, setIsOpen }) {

    const [habilitado, setHabilitado] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    // ... existing code ...
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
    const [report, setReport] = useState([]);
    const [users, setUsers] = useState([]);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fechaHoyFormateada = formatDate(new Date());

    const fetchUsersData = async () => {
        const users = await fetchUsers();
        setUsers(users[0]);
    }

    useEffect(() => {
        const checkConnectivity = async () => {
            try {
                const netInfoState = await NetInfo.fetch();
                setIsConnected(netInfoState.isConnected);
            } catch (error) {
                setIsConnected(true);
            }
        };

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        checkConnectivity();

        return () => {
            unsubscribe();
        };
    }, []);

    const generateGoogleReport = async () => {
        if (!isConnected) {
            Alert.alert('Error', 'No hay conexión a internet');
            return;
        }

        try {
            const totalCuenta = report.map(item => ({
                cantidad: 1,
                descripcion: `${item.nombre_vaca} - ${item.observaciones || 'Sin observaciones'}`,
                valor: 0,
                total: 0
            }));

            const requestBody = {
                direccion: lugar,
                cliente: cliente,
                totalCuenta: totalCuenta,
                fechaHoyFormateada: fechaHoyFormateada,
                nit: '',
                tel: '',
                sumaTotal: 0,
                users: users,
                nombreDocumento: `Informe ${finca} - ${fechaHoyFormateada}`
            };

            const response = await fetch('https://contractual.papeleo.co/api/generate-pawn-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert('Éxito', 'Documento generado exitosamente en Google Docs');
            } else {
                Alert.alert('Error', result.error || 'Error al generar el documento');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al servidor');
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);

    return <Formik validationSchema={reportValidation} initialValues={initialValues} onSubmit={values => {
        obtenerHistorialVacas(values, id, startDate, endDate, setReport, setIsOpen, setUsers)
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
                            setReport={setReport}
                            setHabilitado={setHabilitado}
                        />
                    </View>
                    {habilitado && (
                        <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Generar informe</StyledText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { opacity: isConnected && report.length > 0 ? 1 : 0.5, marginTop: 10 }]}
                            onPress={generateGoogleReport}
                            disabled={!isConnected || report.length === 0}
                        >
                            <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Generar informe google</StyledText>
                        </TouchableOpacity>
                        <GenerateReport
                            id={id}
                            startDate={startDate}
                            endDate={endDate}
                            setReport={setReport}
                            report={report}
                            finca={finca}
                            cliente={cliente}
                            lugar={lugar}
                            fechaHoyFormateada={fechaHoyFormateada}
                            setIsOpen={setIsOpen}
                            users={users}
                        />
                        </>
                    )}
                </View>
            )
        }}
    </Formik>
}