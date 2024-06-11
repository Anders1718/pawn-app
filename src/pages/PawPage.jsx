import React, { useEffect, useState } from "react";
import { Formik } from 'formik'
import { Button, Image, StyleSheet, View, Pressable, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { loginValidationSchema } from '../validationSchemas/login'
import { ModalPaw } from "../components/ModalPaw";

import ComponentButton from "../component-button";
import StyledText from "../components/StyledText";
import { Link } from "react-router-native";
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import Dropdown from "../components/Dropdown";
import { fetchVacasId } from "../hooks/useRepositories";
import CowValidation from "../components/AddVaca";
import { addHistorialVacas } from "../hooks/useRepositories";
import { initialValues, optionsSick, optionsPawn, optionsTratement, optionsSeverity, numbersPawns } from '../utils/pawOptions'

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 20,
        marginTop: -5,
        textAlign: 'center',
    },
    form: {
        margin: 45,
        marginTop: 60
    },
    paw: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalView: {
        // margin: 20,
        width: 400,
        backgroundColor: '#0f172a',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    save: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    returnMenu: {
        fontSize: 17,
        marginBottom: 15,
        fontWeight: 300,
        width: 80,
        color: 'gray'
    },
    cowName: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 400
    },
    farmName: {
        fontSize: 17,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'purple',

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
    buttonContinue: {
        borderColor: "#334155",
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10,
        marginBottom: 20
    },
    image: {
        width: 270,
        height: 270,
        borderRadius: 4,
        display: 'flex',
        display: 'row',
        justifyContent: 'center',
        textAlign: 'center'
    },
})

export default function PawPage() {

    const [modalCowAddOpen, setModalCowAddOpen] = useState(false)
    const [cowList, setCowList] = useState([])
    const [iscowSelected, setIsCowSelected] = useState(false)
    const [cowName, setCowName] = useState(null)
    const [terapeutic, isTerapeuctic] = useState(false)
    const [pawn, setPawn] = useState(null);

    // Paws 
    const [pawList, setPawList] = useState([false, false, false, false, false, false, false, false]);
    const [idPaw, setIdPaw] = useState(null);
    const [numberPawnPart, setNumberPawnPart] = useState(null);

    //Sicks
    // Crear un nuevo string con las partes que si tengan texto
    const [sickList, setSickList] = useState(['', '', '', '', '', '', '', ''])
    const [firstPartSick, setFirstPartSick] = useState(null)
    const [secondPartSick, setSecondPartSick] = useState(null)
    const [contadorBotones, setContadorBotones] = useState(0);

    //Save pawns
    const [numberPawnSave, setNumberPawnSave] = useState([-1, -1, -1, -1])
    const [numberSickSave, setNumberSickSave] = useState([-1, -1, -1, -1])
    const [numberTratSave, setNumberTratSave] = useState([-1, -1, -1, -1])
    const [numberSeverSave, setNumberSeverSave] = useState([-1, -1, -1, -1])

    const location = useLocation();
    // Parsea la cadena de consulta para obtener los parámetros
    const queryParams = queryString.parse(location.search);
    const { finca, id } = queryParams;

    useEffect(() => {
        const fetchVacas = async () => {
            const resultado = await fetchVacasId(id);
            setCowList(resultado);
        };

        fetchVacas();
    }, [setIdPaw]);

    const actualizarVacas = async () => {
        const resultado = await fetchVacasId(id);
        setCowList(resultado);
    };



    const modificarPosicion = (index, value) => {

        const identificadorPata = `${pawn}: ${firstPartSick} ${secondPartSick} ${value} ${numberPawnPart}`

        // Clonar el array original
        const nuevoPaws = [...sickList];
        // Modificar la posición deseada
        nuevoPaws[index] = identificadorPata;
        // Actualizar el estado
        setSickList(nuevoPaws);
    };

    const modificarPosicionSick = (index, newValue) => {

        // Clonar el array original
        const nuevoPaws = [...pawList];
        // Modificar la posición deseada
        nuevoPaws[index] = newValue;
        // Actualizar el estado
        setPawList(nuevoPaws);
    };

    const handleChangeDropdown = (value, label) => {
        setCowName(label)
        setIsCowSelected(true);
    }

    const onSubmitCow = async () => {
        var fechaHoy = new Date();

        // Obtener el día, mes y año
        var dia = fechaHoy.getDate();
        var mes = fechaHoy.getMonth() + 1; // Los meses empiezan desde 0, por lo que necesitas sumar 1
        var año = fechaHoy.getFullYear();

        // Formatear la fecha como desees (por ejemplo, en formato dd/mm/aaaa)
        var fechaFormateada = dia + '/' + mes + '/' + año;

        if (terapeutic) {
            const stringUnido = sickList.join(" ");
            const enfermedades = stringUnido ? stringUnido : 'Libre de enfermedad';
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaFormateada);
            return Alert.alert('Guardado con éxito');
        } else {
            const enfermedades = 'Libre de enfermedades, se hizo tratamiento preventivo';
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaFormateada);
            return Alert.alert('Guardado con éxito');
        }
    }


    return <Formik validationSchema={loginValidationSchema} initialValues={initialValues} onSubmit={values => {
        onSubmitCow()
    }}>
        {({ handleChange, handleSubmit, values }) => {
            return (
                <ScrollView
                    style={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.title}>
                        <Link to='/' style={styles.returnMenu}>
                            <StyledText style={styles.returnMenu}>⬅ Volver</StyledText>
                        </Link>
                        <StyledText style={styles.farmName}>🚜 Finca: {finca}</StyledText>
                    </View>
                    <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
                        <Pressable onPress={() => setModalCowAddOpen(true)} >
                            <StyledText style={styles.farmName}>Añadir vaca +</StyledText>
                        </Pressable>
                        <StyledText style={styles.farmName}>{pawn ? `Pata: ${pawn}` : 'Seleccione la pata'}</StyledText>
                    </View>
                    <Dropdown
                        onChange={handleChangeDropdown}
                        data={cowList}
                        placeholder="🐮 Lista de vacas"
                    />
                    <ModalPaw
                        isOpen={modalCowAddOpen}
                    >
                        <View style={styles.modalView}>
                            <Pressable onPress={() => { setModalCowAddOpen(false) }}>
                                <StyledText style={{ fontSize: 20 }}> X </StyledText>
                            </Pressable>
                            <CowValidation actualizarVacas={actualizarVacas} id={id} setModalCowAddOpen={setModalCowAddOpen} />
                        </View>
                    </ModalPaw>
                    {iscowSelected &&
                        <>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                <>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => isTerapeuctic(true)}
                                    >
                                        <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Terapéutico</StyledText>
                                    </TouchableOpacity>
                                    {!terapeutic &&
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleSubmit}
                                        >
                                            <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Preventivo</StyledText>
                                        </TouchableOpacity>
                                    }
                                </>
                            </View>
                            {terapeutic &&
                                <>
                                    < ComponentButton title="Pata" options={optionsPawn} setPawn={setPawn} setIdPaw={setIdPaw} idPaw={idPaw} />

                                    {idPaw &&
                                        <>


                                            <View style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'center' }}>
                                                <Image style={styles.image} source={require(`../img/pesunia-vista-inferior.png`)} />
                                            </View>
                                            < ComponentButton title="Número" options={numbersPawns} numberPawnSave={numberPawnSave} optionsSelectedSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberPawnPart} numberPawnPart={numberPawnPart} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />

                                            <ComponentButton title="Enfermedades" options={optionsSick} numberSickSave={numberSickSave} optionsSelectedSave={numberSickSave} idPaw={idPaw} setNumberSickSave={setNumberSickSave} setFirstPartSick={setFirstPartSick} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            <ComponentButton title="Tratamiento" options={optionsTratement} numberTratSave={numberTratSave} optionsSelectedSave={numberTratSave} idPaw={idPaw} setNumberTratSave={setNumberTratSave} setSecondPartSick={setSecondPartSick} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            <ComponentButton title="Severidad" options={optionsSeverity} numberSeverSave={numberSeverSave} optionsSelectedSave={numberSeverSave} setNumberSeverSave={setNumberSeverSave} modificarPosicionSick={modificarPosicionSick} modificarPosicion={modificarPosicion} idPaw={idPaw} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            {contadorBotones >= 4 && (
                                                <View>
                                                    {/* <TouchableOpacity
                                                    style={styles.buttonContinue}
                                                    onPress={handleContinue}
                                                >
                                                    <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Continuar</StyledText>
                                                </TouchableOpacity> */}
                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={handleSubmit}
                                                    >
                                                        <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Guardar</StyledText>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </ScrollView>

            )
        }}
    </Formik>
}