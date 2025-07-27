import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import StyledText from '../../../../components/StyledText'
import { useState } from 'react'
import StyledTextInput from '../../../../components/StyledTextInput'
import { Formik, useField } from 'formik'
import * as Yup from 'yup'
import { precioValidation } from '../../../../validationSchemas/login'
import { initialValuePrice } from '../../../../utils/initialValuePrice'

const Precio = ({ setTotalCuenta, setSumaTotal, sumaTotal, setButtonContinue, buttonContinue, prices, preventivosCount, terapeuticosCount, revisionCount }) => {

    // Función para formatear números con comas
    const formatNumber = (number) => {
        if (number === 0 || number === '0' || !number) return '0';
        return Number(number).toLocaleString('es-CO');
    };

    const elementosMayoresACero = prices.filter(elemento => elemento > 0);
    const contadorFinal = elementosMayoresACero.length;

    const [campo, setCampo] = useState([]);
    const [cuenta, setCuenta] = useState([]);
    const [indexCuentaGuardar, setIndexCuentaGuardar] = useState(0);

    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);

    const [name, setName] = useState(['Recorte Terapéutico', 'Recorte Preventivo', 'Revisión']);

    const [total, setTotal] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);

    const contador = contadorFinal + 1;
    const contadorDesplazamiento = contadorFinal;

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

    const saveDesplazamiento = (values) => {
        const total = values.cantidadDesplazamiento * values.valorDesplazamiento;
        setTotal((prevTotal) => [...prevTotal, total]);
        setSumaTotal((prevTotal) => prevTotal + total);
        const cuentaFinal = {
            cantidad: values.cantidadDesplazamiento,
            descripcion: 'Desplazamiento',
            valor: values.valorDesplazamiento,
            total: total
        }
        setTotalCuenta((prevCuenta) => [...prevCuenta, cuentaFinal]);
        setButtonContinue(false);
    }

    const saveRevision = (values) => {
        const total = values.cantidadRevision * values.valorRevision;
        setTotal((prevTotal) => [...prevTotal, total]);
        setSumaTotal((prevTotal) => prevTotal + total);
        const cuentaFinal = {
            cantidad: values.cantidadRevision,
            descripcion: values.descripcionRevision,
            valor: values.valorRevision,
            total: total
        }
        setTotalCuenta((prevCuenta) => [...prevCuenta, cuentaFinal]);
        setButtonContinue(false);
    }

    const saveTerapeuticos = (values) => {
        const total = values.cantidadTerapeuticos * values.valorTerapeuticos;
        setTotal((prevTotal) => [...prevTotal, total]);
        setSumaTotal((prevTotal) => prevTotal + total);
        const cuentaFinal = {
            cantidad: values.cantidadTerapeuticos,
            descripcion: values.descripcionTerapeuticos,
            valor: values.valorTerapeuticos,
            total: total
        }
        setTotalCuenta((prevCuenta) => [...prevCuenta, cuentaFinal]);
        setButtonContinue(false);
    }

    const savePreventivos = (values) => {

        const total = values.cantidadPreventivos * values.valorPreventivos;
        setTotal((prevTotal) => [...prevTotal, total]);
        setSumaTotal((prevTotal) => prevTotal + total);
        const cuentaFinal = {
            cantidad: values.cantidadPreventivos,
            descripcion: values.descripcionPreventivos,
            valor: values.valorPreventivos,
            total: total
        }
        setTotalCuenta((prevCuenta) => [...prevCuenta, cuentaFinal]);
        setButtonContinue(false);
    }

    const validationSchema = Yup.object().shape({
        cantidad: Yup.number().required('Requerido'),
        descripcion: Yup.string().required('Requerido'),
        valor: Yup.number().required('Requerido')
    });

    const FormikInputValue = ({ name, value, isNumeric = false, ...props }) => {

        const [field, meta, helpers] = useField(name);

        const handleChangeText = (value) => {
            if (isNumeric) {
                // Remover todas las comas y puntos para obtener solo números
                const numericValue = value.replace(/[^\d]/g, '');
                helpers.setValue(numericValue);
            } else {
                helpers.setValue(value);
            }
        };

        const getDisplayValue = () => {
            if (isNumeric && field.value) {
                return formatNumber(field.value);
            }
            return String(field.value);
        };

        return (
            <View>
                <StyledTextInput
                    style={styles.input}
                    error={meta.error}
                    value={getDisplayValue()}
                    onChangeText={handleChangeText}
                    {...props}
                />
                {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
            </View>

        )
    }

    return (
        <View style={styles.conatiner}>
            <StyledText fontSize='title' style={{ marginBottom: 50 }}>Cuenta de Cobro</StyledText>


            <Formik
                initialValues={initialValuePrice(preventivosCount, terapeuticosCount, revisionCount, name)}
                validationSchema={precioValidation}
                onSubmit={(values) => {
                    if (terapeuticosCount > 0) {
                        saveTerapeuticos(values);
                    }
                    if (preventivosCount > 0) {
                        savePreventivos(values);
                    }
                    if (revisionCount > 0) {
                        saveRevision(values);
                    }
                    saveDesplazamiento(values);
                    setFirst(true);
                }}
            >
                {({ handleSubmit }) => (
                    <>
                        {terapeuticosCount > 0 && (
                            <View style={styles.item}>
                                <FormikInputValue
                                    name='cantidadTerapeuticos'
                                    placeholder='Cantidad'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledText style={styles.text}>{name[0]}</StyledText>
                                <FormikInputValue
                                    name='valorTerapeuticos'
                                    placeholder='Valor'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledTextInput editable={false} style={styles.textTotal} placeholder='Total' placeholderTextColor="#c2c0c0"> {formatNumber(total[0])} </StyledTextInput>
                            </View>
                        )}
                        {preventivosCount > 0 && (
                            <View style={styles.item}>
                                <FormikInputValue
                                    name='cantidadPreventivos'
                                    placeholder='Cantidad'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledText style={styles.text}>{name[1]}</StyledText>
                                <FormikInputValue
                                    name='valorPreventivos'
                                    placeholder='Valor'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledTextInput editable={false} style={styles.textTotal} placeholder='Total' placeholderTextColor="#c2c0c0"> {formatNumber(total[1] && terapeuticosCount > 0 ? total[1] : total[0] ? total[0] : 0)} </StyledTextInput>
                            </View>

                        )}
                        {revisionCount > 0 && (
                            <View style={styles.item}>
                                <FormikInputValue
                                    name='cantidadRevision'
                                    placeholder='Cantidad'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledText style={styles.text}>{name[2]}</StyledText>
                                <FormikInputValue
                                    name='valorRevision'
                                    placeholder='Valor'
                                    placeholderTextColor="#c2c0c0"
                                    keyboardType="numeric"
                                    isNumeric={true}
                                />
                                <StyledTextInput editable={false} style={styles.textTotal} placeholder='Total' placeholderTextColor="#c2c0c0"> {formatNumber(total.length > 0 ? total[contadorDesplazamiento - 1] : 0)} </StyledTextInput>
                            </View>

                        )}
                        <View style={styles.item}>
                            <FormikInputValue
                                name='cantidadDesplazamiento'
                                placeholder='Cantidad'
                                placeholderTextColor="#c2c0c0"
                                keyboardType="numeric"
                                isNumeric={true}
                            />
                            <StyledText style={styles.text}>Desplazamiento</StyledText>
                            <FormikInputValue
                                name='valorDesplazamiento'
                                placeholder='Valor'
                                placeholderTextColor="#c2c0c0"
                                keyboardType="numeric"
                                isNumeric={true}
                            />
                            <StyledTextInput editable={false} style={styles.textTotal} placeholder='Total' placeholderTextColor="#c2c0c0"> {formatNumber(total[contadorDesplazamiento])} </StyledTextInput>
                        </View>
                        {!first && (
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <StyledText fontSize='subheading'>Guardar y continuar</StyledText>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </Formik>
            {first && (
                <>



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
                                            isNumeric={true}
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
                                            isNumeric={true}
                                        />
                                        <StyledTextInput editable={false} placeholder='Total' style={styles.textTotal} placeholderTextColor="#c2c0c0"> {formatNumber(total[index + contador])} </StyledTextInput>
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
                        <StyledText fontSize='title'>Total: ${formatNumber(sumaTotal)}</StyledText>
                    </View>
                    {!buttonContinue && (
                        <TouchableOpacity style={styles.button} onPress={() => addCuenta()}>
                            <StyledText fontSize='subheading'>Agregar Campo</StyledText>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70
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
        width: 650,
        padding: 5
    },
    total: {
        marginTop: 20,
        marginBottom: 50,
    },
    input: {
        fontSize: 30,
    },
    text: {
        fontSize: 30,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    textTotal: {
        fontSize: 30,
        marginLeft: 20,
    }
})

export default Precio;