import React, { useEffect, useState } from "react";
import { Formik } from 'formik'
import { Button, Image, StyleSheet, View, Pressable, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { loginValidationSchema } from '../validationSchemas/login'
import { ModalPaw } from "../components/ModalPaw";
import Card from "../component-button/card/Card";

import ComponentButton from "../component-button";
import StyledText from "../components/StyledText";
import { Link } from "react-router-native";
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import Dropdown from "../components/Dropdown";
import { fetchVacasId, fetchEnfermedades } from "../hooks/useRepositories";
import CowValidation from "../components/AddVaca";
import { addHistorialVacas } from "../hooks/useRepositories";
import { initialValues, optionsPawn, optionsTratement, optionsSeverity } from '../utils/pawOptions'
import Hoof from '../pata-svg/Hoof';
import HoofSide from "../patas-lado-svg/Hoof";
import HoofSideUp from "../patas-lado-arriba-svg/Hoof";
import StyledTextInput from "../components/StyledTextInput";
import Enfermedades from "../components/AddEnfermedad";

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
    textInput: {
        marginTop: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 10,
        padding: 10,
        fontSize: 28,
    }
})

export default function PawPage() {

    const [modalCowAddOpen, setModalCowAddOpen] = useState(false)
    const [cowList, setCowList] = useState([])
    const [iscowSelected, setIsCowSelected] = useState(false)
    const [cowName, setCowName] = useState(null)
    const [terapeutic, isTerapeuctic] = useState(false)
    const [pawn, setPawn] = useState(null);
    const [note, setNote] = useState('');
    const [sala, setSala] = useState('');
    const [modalEnfermedadesOpen, setModalEnfermedadesOpen] = useState(false);
    const [enfermedades, setEnfermedades] = useState([]);

    // Paws 
    const [pawList, setPawList] = useState([false, false, false, false, false, false, false, false]);
    const [idPaw, setIdPaw] = useState(null);
    const [numberPawnPart, setNumberPawnPart] = useState(null);
    const [numberSidePawnPart, setNumberSidePawnPart] = useState(null);
    const [numberUpPawnPart, setNumberUpPawnPart] = useState(null);


    //Sicks
    // Crear un nuevo string con las partes que si tengan texto
    const [sickList, setSickList] = useState(['', '', '', '', '', '', '', ''])
    const [firstPartSick, setFirstPartSick] = useState(null)
    const [secondPartSick, setSecondPartSick] = useState(null)
    const [contadorBotones, setContadorBotones] = useState(0);
    const [tratamiento, setTratamiento] = useState(null);

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

        const fetchEnfermedadesList = async () => {
            const resultado = await fetchEnfermedades();
            setEnfermedades(resultado);
        };

        fetchVacas();
        fetchEnfermedadesList();
    }, [setIdPaw]);

    const clearAllData = async () => {
        setModalCowAddOpen(false);
        setCowList([]);
        setIsCowSelected(false);
        setCowName(null);
        isTerapeuctic(false);
        setPawn(null);
        setNote('');
        setSala('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw(null);
        setNumberPawnPart(null);
        setSickList(['', '', '', '', '', '', '', '']);
        setFirstPartSick(null);
        setSecondPartSick(null);
        setContadorBotones(0);
        setNumberPawnSave([-1, -1, -1, -1]);
        setNumberSickSave([-1, -1, -1, -1]);
        setNumberTratSave([-1, -1, -1, -1]);
        setNumberSeverSave([-1, -1, -1, -1]);

        actualizarVacas();
    };

    const clearCowData = async () => {
        setModalCowAddOpen(false);
        isTerapeuctic(false);
        setPawn(null);
        setNote('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw(null);
        setNumberPawnPart(null);
        setSickList(['', '', '', '', '', '', '', '']);
        setFirstPartSick(null);
        setSecondPartSick(null);
        setContadorBotones(0);
        setNumberPawnSave([-1, -1, -1, -1]);
        setNumberSickSave([-1, -1, -1, -1]);
        setNumberTratSave([-1, -1, -1, -1]);
        setNumberSeverSave([-1, -1, -1, -1]);
    };

    const actualizarVacas = async () => {
        const resultado = await fetchVacasId(id);
        setCowList(resultado);
    };

    const actualizarEnfermedades = async () => {
        const resultado = await fetchEnfermedades();
        setEnfermedades(resultado);
    };

    const addNote = (text) => {
        setNote(text)
    }

    const modificarPosicion = (index, value) => {

        const identificadorPata = `${pawn}: ${firstPartSick} ${secondPartSick} ${value} ${numberPawnPart} ${numberSidePawnPart} ${numberUpPawnPart} `

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

    const handleChangeDropdown = (value, label, sala) => {
        setCowName(label)
        setIsCowSelected(true);
        setSala(sala);
        clearCowData();
    }

    const onSubmitCow = async () => {
        var fechaHoy = new Date();

        const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria);

        if (terapeutic) {
            const stringUnido = sickList.join(" ");
            const enfermedades = stringUnido ? stringUnido : 'Libre de enfermedad';
            console.log("enfermedades", enfermedades)
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, note, tratamiento);
            clearAllData();
            return Alert.alert('Guardado con éxito');
        } else {
            const enfermedades = 'Libre de enfermedades, se hizo tratamiento preventivo';
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, note, tratamiento);
            clearAllData();
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
                    {sala && <StyledText style={styles.farmName}>🏡Sala: {sala}</StyledText>}
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
                            <CowValidation finca={finca} actualizarVacas={actualizarVacas} id={id} setModalCowAddOpen={setModalCowAddOpen} />
                        </View>
                    </ModalPaw>
                    <ModalPaw
                        isOpen={modalEnfermedadesOpen}
                    >
                        <View style={styles.modalView}>
                            <Pressable onPress={() => { setModalEnfermedadesOpen(false) }}>
                                <StyledText style={{ fontSize: 20 }}> X </StyledText>
                            </Pressable>
                            <Enfermedades
                                actualizarEnfermedades={actualizarEnfermedades}
                                setModalEnfermedadesOpen={setModalEnfermedadesOpen}
                            />
                        </View>
                    </ModalPaw>
                    {iscowSelected &&
                        <>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                <>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            setTratamiento('Terapéutico')
                                            isTerapeuctic(true)
                                        }}
                                    >
                                        <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Terapéutico</StyledText>
                                    </TouchableOpacity>
                                    {!terapeutic &&
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => {
                                                setTratamiento('Preventivo')
                                                handleSubmit()
                                            }}
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

                                            <Hoof numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberPawnPart} numberPawnPart={numberPawnPart} />
                                            <View style={{flexDirection: 'row', marginBottom:35}}>
                                                <HoofSide numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberSidePawnPart} numberSidePawnPart={numberSidePawnPart} />
                                                <HoofSideUp numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberUpPawnPart} numberPawnPart={numberUpPawnPart} />
                                            </View>


                                            <ComponentButton title="Enfermedades" options={enfermedades} numberSickSave={numberSickSave} optionsSelectedSave={numberSickSave} idPaw={idPaw} setNumberSickSave={setNumberSickSave} setFirstPartSick={setFirstPartSick} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            <Card onPress={() => setModalEnfermedadesOpen(true)}> + </Card>
                                            <ComponentButton title="Tratamiento" options={optionsTratement} numberTratSave={numberTratSave} optionsSelectedSave={numberTratSave} idPaw={idPaw} setNumberTratSave={setNumberTratSave} setSecondPartSick={setSecondPartSick} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            <ComponentButton title="Severidad" options={optionsSeverity} numberSeverSave={numberSeverSave} optionsSelectedSave={numberSeverSave} setNumberSeverSave={setNumberSeverSave} modificarPosicionSick={modificarPosicionSick} modificarPosicion={modificarPosicion} idPaw={idPaw} setContadorBotones={setContadorBotones} contadorBotones={contadorBotones} />
                                            <StyledTextInput
                                                placeholder='Nota (opcional)'
                                                placeholderTextColor="#c2c0c0"
                                                onChangeText={(text) => addNote(text)}
                                                style={styles.textInput}
                                            />
                                            {contadorBotones >= 3 && (
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