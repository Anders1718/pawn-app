import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import StyledText from '../../../../components/StyledText'
import { useState } from 'react'
import StyledTextInput from '../../../../components/StyledTextInput'
import { Formik, useField } from 'formik'
import * as Yup from 'yup'

const Precio = ({ setTotalCuenta, setSumaTotal, sumaTotal, setButtonContinue, buttonContinue }) => {

    const [campo, setCampo] = useState([]);
    const [cuenta, setCuenta] = useState([]);
    const [indexCuentaGuardar, setIndexCuentaGuardar] = useState(0);
    
    const [total, setTotal] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const addCuenta = () => {
        const longitudCuenta = cuenta.length + 1;
        setCampo((prevCuenta) => [...prevCuenta, longitudCuenta]);
        setIndexCuentaGuardar(longitudCuenta);
        setButtonContinue(true);
    }

    const saveCuenta = (values) => {
        const total = values.cantidad * values.valor;
        setTotal((prevTotal) => [...prevTotal, total]);
        setSumaTotal((prevTotal) => prevTotal + total);
        const cuentaFinal = {
            cantidad: values.cantidad,
            descripcion: values.descripcion,
            valor: values.valor,
            total: total
        }
        setTotalCuenta((prevCuenta) => [...prevCuenta, cuentaFinal]);

    }

    const validationSchema = Yup.object().shape({
        cantidad: Yup.number().required('Requerido'),
        descripcion: Yup.string().required('Requerido'),
        valor: Yup.number().required('Requerido')
    });

    const FormikInputValue = ({ name, ...props }) => {
        const [field, meta, helpers] = useField(name)

        return (
            <View>
                <StyledTextInput
                    error={meta.error}
                    value={field.value}
                    onChangeText={value => helpers.setValue(value)}
                    {...props}
                />
                {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
            </View>

        )
    }

    return (
        <View style={styles.conatiner}>
            <StyledText fontSize='title'>Cuenta de Cobro</StyledText>
            {campo.map((item, index) => (
                <Formik
                    key={index}
                    initialValues={{ cantidad: '', descripcion: '', valor: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        setButtonContinue(false);
                        saveCuenta(values);
                    }}
                >
                    {({ handleSubmit }) => (
                        <>
                            <View style={styles.item}>
                                <FormikInputValue
                                    name='cantidad'
                                    placeholder='Cantidad'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                />
                                <FormikInputValue
                                    name='descripcion'
                                    placeholder='Descripción'
                                    placeholderTextColor="#c2c0c0"
                                />
                                <FormikInputValue
                                    name='valor'
                                    placeholder='Valor'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                />
                                <StyledTextInput editable={false} placeholder='Total' placeholderTextColor="#c2c0c0"> {total[index] ? total[index] : 'Total'} </StyledTextInput>
                            </View>
                            {buttonContinue && index === campo.length - 1 && (
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <StyledText fontSize='subheading'>Continuar</StyledText>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </Formik>
            ))}
            <View style={styles.total}>
                <StyledText>Total: ${sumaTotal}</StyledText>
            </View>
            {!buttonContinue && (
                <TouchableOpacity style={styles.button} onPress={() => addCuenta()}>
                    <StyledText fontSize='subheading'>Agregar Campo</StyledText>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sala: {
        alignItems: 'center',
        marginBottom: 30,
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 410,
        padding: 5
    },
    button: {
        borderColor: "#334155",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10
    },
    animalInfo: {
        display: 'flex',
        flexDirection: 'row',
    },
    item: {
        borderBottomWidth: 0.3,
        borderBottomColor: 'snow',
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 410,
        padding: 5
    }
})

export default Precio;