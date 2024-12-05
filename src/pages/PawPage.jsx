import React, { useEffect, useState } from "react";
import { Formik } from 'formik'
import { Button, Image, StyleSheet, View, Pressable, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { loginValidationSchema } from '../validationSchemas/login'
import { ModalPaw } from "../components/ModalPaw";
import Card from "../component-button/card/Card";

import ComponentButton from "../component-button";
import ComponentButtonTreatment from "../component-button-treatment";
import ComponentButtonSeverity from "../component-button-severity";
import StyledText from "../components/StyledText";
import { Link } from "react-router-native";
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import Dropdown from "../components/Dropdown";
import { fetchVacasId, fetchEnfermedades } from "../hooks/useRepositories";
import CowValidation from "../components/AddVaca";
import { addHistorialVacas, ultimaHistoriaVaca } from "../hooks/useRepositories";
import { initialValues, optionsPawn, optionsTratement, optionsSeverity } from '../utils/pawOptions'
import Hoof from '../pata-svg/Hoof';
import HoofSide from "../patas-lado-svg/Hoof";
import HoofSideUp from "../patas-lado-arriba-svg/Hoof";
import StyledTextInput from "../components/StyledTextInput";
import Enfermedades from "../components/AddEnfermedad";
import EditEnfermedad from "../components/EditEnfermedad";
import { formatDate } from "../utils/transformDate";
import ListaVacas from "../components/ListaVacas";

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
        marginTop: 60,
        paddingBottom: 120
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
    modalViewList: {
        height: 600,
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
        fontSize: 34,
        marginBottom: 15,
        fontWeight: 300,
        width: 140,
        color: 'gray',
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
        borderWidth: 10,
        marginBottom: 20
    },
    buttonFree: {
        borderColor: "#334155",
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10,
        marginTop: 20
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

    const [isEdit, setIsEdit] = useState(false);

    const [modalCowAddOpen, setModalCowAddOpen] = useState(false)
    const [cowList, setCowList] = useState([])
    const [iscowSelected, setIsCowSelected] = useState(false)
    const [cowName, setCowName] = useState('')
    const [terapeutic, isTerapeuctic] = useState(false)
    const [preventive, isPreventive] = useState(false)
    const [isRevision, setRevision] = useState(false)
    const [pawn, setPawn] = useState('');
    const [note, setNote] = useState('');
    const [sala, setSala] = useState('');
    const [modalEnfermedadesOpen, setModalEnfermedadesOpen] = useState(false);
    const [modalEditSick, setModalEditSick] = useState(false);
    const [enfermedades, setEnfermedades] = useState([]);

    const [cardSelected, setCardSelected] = useState(null);

    const [seleccionarAnimal, setSeleccionarAnimal] = useState('');

    const [defaultValue, setDefaultValue] = useState('');
    const [salaAdd, setSalaAdd] = useState('');

    // Paws 
    const [pawList, setPawList] = useState([false, false, false, false, false, false, false, false]);
    const [idPaw, setIdPaw] = useState('');
    const [numberPawnPart, setNumberPawnPart] = useState([], [], [], []);
    const [numberSidePawnPart, setNumberSidePawnPart] = useState([], [], [], []);
    const [numberUpPawnPart, setNumberUpPawnPart] = useState([], [], [], []);


    // Modal edit pwan
    const [idEditPawn, setIdEditPawn] = useState('');
    const [valueEditPawn, setValueEditPawn] = useState('');
    const [namePawn, setNamePawn] = useState('');

    //Sicks
    // Crear un nuevo string con las partes que si tengan texto
    const [sickList, setSickList] = useState(['', '', '', ''])
    const [firstPartSick, setFirstPartSick] = useState('')
    const [pawnSide, setPawnSide] = useState([])
    const [secondPartSick, setSecondPartSick] = useState([])
    const [tratamiento, setTratamiento] = useState('');
    const [severity, setSeverity] = useState('');

    const [ultimoTratamiento, setUltimoTratamiento] = useState('');

    //Save pawns
    const [numberPawnSave, setNumberPawnSave] = useState([[], [], [], []])
    const [numberSickSave, setNumberSickSave] = useState([[], [], [], []])
    const [numberTratSave, setNumberTratSave] = useState([[], [], [], []])
    const [numberSeverSave, setNumberSeverSave] = useState([[], [], [], []])
    const [numberSeveritySave, setNumberSeveritySave] = useState([[], [], [], []])

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
        setCowName('');
        isTerapeuctic(false);
        setRevision(false)
        isPreventive(false);
        setPawn('');
        setNote('');
        setSala('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick('');
        setPawnSide([]);
        setSecondPartSick([]);
        setNumberPawnSave([[], [], [], []])
        setNumberSickSave([[], [], [], []])
        setNumberTratSave([[], [], [], []]);
        setNumberSeverSave([[], [], [], []]);
        setUltimoTratamiento('');
        setSeverity('');
        setNumberSeveritySave([[], [], [], []]);

        actualizarVacas();
    };

    const clearPartialCowData = async () => {
        setModalCowAddOpen(false);
        setPawn('');
        setNote('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick('');
        setPawnSide([]);
        setSecondPartSick([]);
        setNumberPawnSave([[], [], [], []])
        setNumberSickSave([[], [], [], []])
        setNumberTratSave([[], [], [], []]);
        setNumberSeverSave([[], [], [], []]);
        setUltimoTratamiento('');
        setSeverity('');
        setCardSelected(null);
        setNumberSeveritySave([[], [], [], []]);
    }

    const clearCowData = async () => {
        setModalCowAddOpen(false);
        isTerapeuctic(false);
        setRevision(false);
        isPreventive(false);
        setPawn('');
        setNote('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick('');
        setPawnSide([]);
        setSecondPartSick([]);
        setNumberPawnSave([[], [], [], []]);
        setNumberSickSave([[], [], [], []]);
        setNumberTratSave([[], [], [], []]);
        setNumberSeverSave([[], [], [], []]);
        setUltimoTratamiento('');
        setSeverity('');
        setCardSelected(null);
        setNumberSeveritySave([[], [], [], []]);
    };

    const actualizarVacas = async () => {
        const resultado = await fetchVacasId(id);
        setCowList(resultado);
        setDefaultValue(resultado[0].value);
        setSalaAdd(resultado[0].sala);
    };

    const actualizarVacasAdd = async () => {
        const resultado = await fetchVacasId(id);
        setCowList(resultado);
        setDefaultValue(resultado[0].value);
        setSalaAdd(resultado[0].sala);
        handleChangeDropdown(resultado[0].value, resultado[0].label, resultado[0].sala);
    };

    const actualizarEnfermedades = async () => {
        const resultado = await fetchEnfermedades();
        setEnfermedades(resultado);
    };

    const historiaAnimal = async (nombre) => {
        const resultado = await ultimaHistoriaVaca(id, nombre);
        setUltimoTratamiento(resultado);
    }

    const addNote = (text) => {
        setNote(text)
    }

    const modificarPosicion = (index, value) => {
        let segundaParte = '';
        if (secondPartSick.includes('venda + oxi')) {
            segundaParte = 'venda + oxi'
        }

        const identificadorPata = `${firstPartSick} ${segundaParte}-${severity} ${value}`;
        // Clonar el array original
        const nuevoPaws = [...sickList];
        // Modificar la posición deseada
        nuevoPaws[index] = identificadorPata;
        // Actualizar el estado
        setSickList(nuevoPaws);
    };

    const handleChangeDropdown = (value, label, sala) => {
        setCowName(label)
        setIsCowSelected(true);
        setSala(sala);
        clearCowData();
        historiaAnimal(label);
    }

    const onSubmitCow = async () => {
        var fechaHoy = new Date();

        const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria);

        const notaCompleta = note ? note : 'N/A';

        if (terapeutic || isRevision || preventive) {

            const stringUnido = sickList.join(" ");

            const extremidad = `${pawn}-${pawnSide} ${numberPawnPart} ${numberSidePawnPart} ${numberUpPawnPart}`

            const enfermedades = stringUnido && tratamiento !== 'Libre' ? stringUnido : 'Libre de enfermedad';
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, notaCompleta, tratamiento === 'Libre' ? 'Preventivo' : tratamiento, extremidad);
            clearAllData();
            return Alert.alert('Guardado con éxito');
        }

    }

    const onSubmitPartialCow = async () => {
        var fechaHoy = new Date();

        const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria);

        const notaCompleta = note ? note : 'N/A';

        if (terapeutic || isRevision || preventive) {

            const stringUnido = sickList.join(" ");

            const extremidad = `${pawn}-${pawnSide} ${numberPawnPart} ${numberSidePawnPart} ${numberUpPawnPart}`

            const enfermedades = stringUnido && tratamiento !== 'Libre' ? stringUnido : 'Libre de enfermedad';
            const historial = await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, notaCompleta, tratamiento === 'Libre' ? 'Preventivo' : tratamiento, extremidad);
            clearPartialCowData();
            return Alert.alert('Guardado con éxito');
        }
    }

    const convertExtremidad = (value) => {

        // Si value es undefined o null, retornar el valor original
        if (!value) return value;

        // Dividir el string por comas y luego por espacios
        const secciones = value.split(',');

        const resultado = secciones.map(seccion => {
            const palabras = seccion.trim().split(' ');

            // Procesar cada palabra
            return palabras.map(palabra => {
                // Si la palabra contiene números
                if (/\d/.test(palabra)) {
                    // Extraer solo los números de esa palabra
                    return palabra.replace(/[^\d]/g, '');
                }
                // Si no contiene números, mantener la palabra original
                return palabra;
            }).join(' ');
        }).join(', '); // Unir las secciones con coma y espacio

        return resultado;
    }

    let touchStartTime = 0;

    const handleLongPress = ({number, value, label}) => {
        setIdEditPawn(number)
        setValueEditPawn(value)
        setNamePawn(label)
        setModalEditSick(true);
    };


    return <Formik validationSchema={loginValidationSchema} initialValues={initialValues} onSubmit={values => {
        onSubmitCow()
    }}>
        {({ handleChange, handleSubmit, values }) => {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={0} // Ajusta este valor según sea necesario
                >
                    <ScrollView
                        contentContainerStyle={styles.form}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.title}>
                            <Link to='/' style={styles.returnMenu}>
                                <StyledText style={styles.returnMenu}>⬅ Volver</StyledText>
                            </Link>
                            <StyledText style={styles.farmName}>🚜 Finca: {finca}</StyledText>
                        </View>
                        {sala && <StyledText style={styles.farmName}>🏡Sala: {sala}</StyledText>}
                        <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", paddingTop: 20 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPressOut={() => {
                                    if (!isEdit) setModalCowAddOpen(true);
                                }}
                                onLongPress={() => {
                                    setIsEdit(true);
                                }}
                            >
                                <StyledText style={styles.farmName}>Añadir animal +</StyledText>
                            </TouchableOpacity>
                        </View>
                        <Dropdown
                            onChange={handleChangeDropdown}
                            data={cowList}
                            placeholder="🐮 Lista de animales"
                            defaultValue={defaultValue}
                        />
                        <ModalPaw isOpen={modalCowAddOpen}>
                            <View style={styles.modalView}>
                                <Pressable onPress={() => {
                                    setModalCowAddOpen(false)
                                }}>
                                    <StyledText style={{ fontSize: 20 }}> X </StyledText>
                                </Pressable>
                                <CowValidation finca={finca} setSeleccionarAnimal={setSeleccionarAnimal} actualizarVacas={actualizarVacasAdd} id={id} setModalCowAddOpen={setModalCowAddOpen} />
                            </View>
                        </ModalPaw>
                        <ModalPaw isOpen={isEdit}>
                            <View style={styles.modalViewList}>
                                <Pressable onPress={() => {
                                    setIsEdit(false)
                                }}>
                                    <StyledText style={{ fontSize: 20 }}> X </StyledText>
                                </Pressable>
                                <ListaVacas setIsEdit={setIsEdit} actualizarVacas={actualizarVacas} />
                            </View>
                        </ModalPaw>
                        <ModalPaw isOpen={modalEnfermedadesOpen}>
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
                        <ModalPaw isOpen={modalEditSick}>
                            <View style={styles.modalView}>
                                <Pressable onPress={() => { setModalEditSick(false) }}>
                                    <StyledText style={{ fontSize: 20 }}> X </StyledText>
                                </Pressable>
                                <EditEnfermedad
                                    actualizarEnfermedades={actualizarEnfermedades}
                                    setModalEditSick={setModalEditSick}
                                    idEditPawn={idEditPawn}
                                    valueEditPawn={valueEditPawn}
                                    namePawn={namePawn}
                                />
                            </View>
                        </ModalPaw>
                        {iscowSelected &&
                            <>
                                {ultimoTratamiento && ultimoTratamiento.length > 0 && (
                                    <View style={{ paddingVertical: 20, backgroundColor: '#94ACD4', borderRadius: 15, paddingHorizontal: 10, marginBottom: 25 }}>
                                        <StyledText fontSize='subheading' style={{ fontSize: 22, textAlign: 'center', marginBottom: 10 }}>Última historia</StyledText>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <StyledText style={{ fontSize: 18 }}>Enfermedad: {ultimoTratamiento[0].enfermedades}</StyledText>
                                            <StyledText style={{ fontSize: 18 }}>Extremidad: {convertExtremidad(ultimoTratamiento[0].extremidad)}</StyledText>
                                            <StyledText style={{ fontSize: 18 }}>Tratamiento: {ultimoTratamiento[0].tratamiento}</StyledText>
                                            <StyledText style={{ fontSize: 18 }}>Fecha: {formatDate(ultimoTratamiento[0].fecha)}</StyledText>
                                            <StyledText style={{ fontSize: 18 }}>Nota: {ultimoTratamiento[0].nota}</StyledText>
                                        </View>
                                    </View>
                                )}
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                    <>

                                        {!isRevision && !preventive &&
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => {
                                                    setTratamiento('Terapéutico');
                                                    isTerapeuctic(true);
                                                }}
                                            >
                                                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Terapéutico</StyledText>
                                            </TouchableOpacity>
                                        }
                                        {!terapeutic && !preventive &&

                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => {
                                                    setTratamiento('Revisión');

                                                    setRevision(true);
                                                }}
                                            >
                                                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Revisión</StyledText>
                                            </TouchableOpacity>
                                        }

                                        {!terapeutic && !isRevision &&
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={() => {
                                                    setTratamiento('Preventivo');
                                                    isPreventive(true);
                                                }}
                                            >
                                                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Preventivo</StyledText>
                                            </TouchableOpacity>
                                        }
                                    </>
                                </View>
                                {(terapeutic || isRevision || preventive) &&
                                    <>
                                        { preventive &&
                                            <TouchableOpacity
                                                style={styles.buttonFree}
                                                onPress={() => {
                                                    setTratamiento('Libre');
                                                    handleSubmit();
                                                }}
                                            >
                                                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Libre de enfermedades</StyledText>
                                            </TouchableOpacity>
                                        }
                                        < ComponentButton title="Pata" cardSelected={cardSelected} setCardSelected={setCardSelected} options={optionsPawn} setPawn={setPawn} setIdPaw={setIdPaw} idPaw={idPaw} />
                                        {idPaw &&
                                            <>
                                                <Hoof numberPawnSave={numberPawnSave} pawnSide={pawnSide} setPawnSide={setPawnSide} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberPawnPart} numberPawnPart={numberPawnPart} modificarPosicion={modificarPosicion} />
                                                <View style={{ flexDirection: 'row', marginBottom: 35 }}>
                                                    <HoofSide numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberSidePawnPart} numberSidePawnPart={numberSidePawnPart} modificarPosicion={modificarPosicion} />
                                                    <HoofSideUp numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberUpPawnPart} numberPawnPart={numberUpPawnPart} modificarPosicion={modificarPosicion} />
                                                </View>
                                                <ComponentButton title="Enfermedades"  handleLongPress={handleLongPress} options={enfermedades} numberSickSave={numberSickSave} optionsSelectedSave={numberSickSave} idPaw={idPaw} setNumberSickSave={setNumberSickSave} setFirstPartSick={setFirstPartSick} modificarPosicion={modificarPosicion} setNumberSeverSave={setNumberSeverSave} numberSeverSave={numberSeverSave} />
                                                <Card onPress={() => setModalEnfermedadesOpen(true)}> + </Card>
                                                <ComponentButtonTreatment title="Tratamiento" options={optionsTratement} numberTratSave={numberTratSave} optionsSelectedSave={numberTratSave} idPaw={idPaw} setNumberTratSave={setNumberTratSave} setSecondPartSick={setSecondPartSick} modificarPosicion={modificarPosicion} setNumberSeverSave={setNumberSeverSave} numberSeverSave={numberSeverSave} />
                                                <ComponentButtonSeverity title="Severidad" severity={severity} options={optionsSeverity} numberSeverSave={numberSeverSave} numberSeveritySave={numberSeveritySave} optionsSelectedSave={numberSeveritySave} setNumberSeverSave={setNumberSeverSave} setNumberSeveritySave={setNumberSeveritySave} modificarPosicion={modificarPosicion} idPaw={idPaw} setSeverity={setSeverity} />
                                                <StyledTextInput
                                                    placeholder='Nota (opcional)'
                                                    placeholderTextColor="#c2c0c0"
                                                    onChangeText={(text) => addNote(text)}
                                                    style={styles.textInput}
                                                />
                                                <View>
                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={onSubmitPartialCow}
                                                    >
                                                        <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Guardado parcial</StyledText>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.button}
                                                        onPress={handleSubmit}
                                                    >
                                                        <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Guardar</StyledText>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        }
                                    </>
                                }
                            </>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>

            )
        }}
    </Formik>
}