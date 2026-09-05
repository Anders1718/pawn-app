import React, { useEffect, useState } from "react";
import { Formik } from 'formik'
import { StyleSheet, View, Alert } from 'react-native';
import { useLocation } from 'react-router-native';
import queryString from 'query-string';
import { loginValidationSchema } from '../validationSchemas/login'
import ComponentButton from "../component-button";
import ComponentButtonTreatment from "../component-button-treatment";
import ComponentButtonSeverity from "../component-button-severity";
import { fetchVacasId, fetchEnfermedades, addHistorialVacas, ultimaHistoriaVaca } from "../hooks/useRepositories";
import CowForm from "../components/AddVaca";
import { initialValues, optionsPawn, optionsTratement, optionsSeverity } from '../utils/pawOptions'
import Hoof from '../pata-svg/Hoof';
import HoofSide from "../patas-lado-svg/Hoof";
import HoofSideUp from "../patas-lado-arriba-svg/Hoof";
import AddEnfermedad from "../components/AddEnfermedad";
import EditEnfermedad from "../components/EditEnfermedad";
import ListaVacas from "../components/ListaVacas";
import { formatDate } from "../utils/transformDate";
import { Screen, Header, Card, Select, Button, IconButton, Chip, Input, Text, Icon, Badge, treatmentTone, SectionTitle, Sheet, useResponsive } from '../ui'
import theme from '../theme'

export default function PawPage() {

    const [isEdit, setIsEdit] = useState(false);

    const [modalCowAddOpen, setModalCowAddOpen] = useState(false)
    const [cowList, setCowList] = useState([])
    const [iscowSelected, setIsCowSelected] = useState(false)
    const [cowName, setCowName] = useState('')
    const [terapeutic, isTerapeuctic] = useState(false)
    const [preventive, isPreventive] = useState(false)
    const [isRevision, setRevision] = useState(false)
    const [hasTalonAdicional, setHasTalonAdicional] = useState(false)
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

    // Multi-pata para preventivo
    const [selectedPatas, setSelectedPatas] = useState([]);

    // Modal edit pwan
    const [idEditPawn, setIdEditPawn] = useState('');
    const [valueEditPawn, setValueEditPawn] = useState('');
    const [namePawn, setNamePawn] = useState('');

    //Sicks
    const [sickList, setSickList] = useState(['', '', '', ''])
    const [firstPartSick, setFirstPartSick] = useState([])
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

    const [salaReport, setSalaReport] = useState('');

    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const { finca, id } = queryParams;

    const { innerWidth, isTablet } = useResponsive();
    const cardInner = innerWidth - 32;
    const hoofSize = Math.min(cardInner, isTablet ? 440 : 340);
    const sideWidth = Math.min((cardInner - 12) / 2, isTablet ? 320 : 220);

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
        setHasTalonAdicional(false);
        setPawn('');
        setNote('');
        setSala('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick([]);
        setPawnSide([]);
        setSecondPartSick([]);
        setNumberPawnSave([[], [], [], []])
        setNumberSickSave([[], [], [], []])
        setNumberTratSave([[], [], [], []]);
        setNumberSeverSave([[], [], [], []]);
        setUltimoTratamiento('');
        setSeverity('');
        setNumberSeveritySave([[], [], [], []]);
        setSelectedPatas([]);

        actualizarVacas();
    };

    const clearPartialCowData = async () => {
        setModalCowAddOpen(false);
        isTerapeuctic(false);
        setRevision(false);
        isPreventive(false);
        setHasTalonAdicional(false);
        setTratamiento('');
        setPawn('');
        setNote('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick([]);
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
        setSelectedPatas([]);
    }

    const clearCowData = async () => {
        setModalCowAddOpen(false);
        isTerapeuctic(false);
        setRevision(false);
        isPreventive(false);
        setHasTalonAdicional(false);
        setPawn('');
        setNote('');
        setPawList([false, false, false, false, false, false, false, false]);
        setIdPaw('');
        setNumberPawnPart([], [], [], []);
        setNumberSidePawnPart([], [], [], []);
        setNumberUpPawnPart([], [], [], []);
        setSickList(['', '', '', '']);
        setFirstPartSick([]);
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
        setSelectedPatas([]);
    };

    const actualizarVacas = async () => {
        const resultado = await fetchVacasId(id);
        setCowList(resultado);
        if (resultado.length > 0) {
            setDefaultValue(resultado[0].value);
            setSalaAdd(resultado[0].sala);
        }
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
        const primeraParteLista = Array.isArray(firstPartSick) ? firstPartSick : (firstPartSick ? [firstPartSick] : []);
        const segundaParteLista = Array.isArray(secondPartSick) ? secondPartSick : (secondPartSick ? [secondPartSick] : []);

        let segundaParte = '';
        if (segundaParteLista.includes('venda + oxi')) {
            segundaParte = 'venda + oxi'
        }
        if (segundaParteLista.includes('tacón adicional')) {
            segundaParte = segundaParte ? segundaParte + ', tacón adicional' : 'tacón adicional'
        }

        const identificadorPata = `${primeraParteLista.join(', ')} ${segundaParte}-${severity} ${value}`;
        const nuevoPaws = [...sickList];
        nuevoPaws[index] = identificadorPata;
        setSickList(nuevoPaws);
    };

    const handleChangeDropdown = (value, label, sala) => {
        setCowName(label)
        setDefaultValue(value)
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

            let tratamientoFinal = tratamiento === 'Libre' ? 'Preventivo' : tratamiento;
            if (hasTalonAdicional) {
                tratamientoFinal = tratamientoFinal + ', Tacón adicional';
            }

            await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, notaCompleta, tratamientoFinal, extremidad);
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

            let tratamientoFinal = tratamiento === 'Libre' ? 'Preventivo' : tratamiento;
            if (hasTalonAdicional) {
                tratamientoFinal = tratamientoFinal + ', Tacón adicional';
            }

            try {
                await addHistorialVacas(id, cowName, enfermedades, fechaLocal.toISOString(), sala, notaCompleta, tratamientoFinal, extremidad);
            } catch (error) {
                return Alert.alert('Error', 'No se pudo guardar el registro');
            }

            isTerapeuctic(false);
            setRevision(false);
            isPreventive(false);
            setHasTalonAdicional(false);
            setTratamiento('');
            setPawn('');
            setNote('');
            setPawList([false, false, false, false, false, false, false, false]);
            setIdPaw('');
            setNumberPawnPart([], [], [], []);
            setNumberSidePawnPart([], [], [], []);
            setNumberUpPawnPart([], [], [], []);
            setSickList(['', '', '', '']);
            setFirstPartSick([]);
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

            Alert.alert('Guardado con éxito');
        }
    }

    const convertExtremidad = (value) => {
        if (!value) return value;
        const secciones = value.split(',');
        const resultado = secciones.map(seccion => {
            const palabras = seccion.trim().split(' ');
            return palabras.map(palabra => {
                if (/\d/.test(palabra)) {
                    return palabra.replace(/[^\d]/g, '');
                }
                return palabra;
            }).join(' ');
        }).join(', ');
        return resultado;
    }

    const togglePata = (pataLabel) => {
        setSelectedPatas(prev =>
            prev.includes(pataLabel)
                ? prev.filter(p => p !== pataLabel)
                : [...prev, pataLabel]
        );
    };

    const onSubmitPreventivo = async () => {
        if (selectedPatas.length === 0) return;

        var fechaHoy = new Date();
        const diferenciaZonaHoraria = fechaHoy.getTimezoneOffset() * 60000;
        const fechaLocal = new Date(fechaHoy.getTime() - diferenciaZonaHoraria);
        const notaCompleta = note ? note : 'N/A';

        let tratamientoFinal = 'Preventivo';
        if (hasTalonAdicional) {
            tratamientoFinal = 'Preventivo, Tacón adicional';
        }

        const stringUnido = sickList.join(' ').trim();
        const enfermedadesFinal = stringUnido ? stringUnido : 'Libre de enfermedad';
        const detalleExtremidad = `${pawnSide} ${numberPawnPart} ${numberSidePawnPart} ${numberUpPawnPart}`.trim();

        try {
            const extremidadFinal = selectedPatas
                .map(pata => detalleExtremidad ? `${pata}-${detalleExtremidad}` : pata)
                .join(', ');
            await addHistorialVacas(id, cowName, enfermedadesFinal, fechaLocal.toISOString(), sala, notaCompleta, tratamientoFinal, extremidadFinal);
            clearAllData();
            Alert.alert('Guardado con éxito');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el registro');
        }
    };

    const handleLongPress = ({ number, value, label }) => {
        setIdEditPawn(number)
        setValueEditPawn(value)
        setNamePawn(label)
        setModalEditSick(true);
    };

    const anyType = terapeutic || isRevision || preventive;

    const renderHoofCard = () => (
        <Card style={styles.block}>
            <View style={styles.cardHead}>
                <Icon name="mci:foot-print" size={18} color={theme.colors.primary} />
                <Text variant="subheading" style={{ marginLeft: 8 }}>Zonas afectadas</Text>
            </View>
            <Hoof width={hoofSize} numberPawnSave={numberPawnSave} pawnSide={pawnSide} setPawnSide={setPawnSide} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberPawnPart} numberPawnPart={numberPawnPart} modificarPosicion={modificarPosicion} />
            <View style={styles.sideViews}>
                <HoofSide width={sideWidth} numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberSidePawnPart} numberSidePawnPart={numberSidePawnPart} modificarPosicion={modificarPosicion} />
                <HoofSideUp width={sideWidth} numberPawnSave={numberPawnSave} setNumberPawnSave={setNumberPawnSave} idPaw={idPaw} setNumberPawnPart={setNumberUpPawnPart} numberPawnPart={numberUpPawnPart} modificarPosicion={modificarPosicion} />
            </View>
        </Card>
    );

    const renderOptionGroups = () => (
        <>
            <ComponentButton title="Enfermedades" icon="medkit-outline" subtitle="Mantén presionado un código para editarlo" tone="danger" handleLongPress={handleLongPress} options={enfermedades} numberSickSave={numberSickSave} optionsSelectedSave={numberSickSave} idPaw={idPaw} setNumberSickSave={setNumberSickSave} setFirstPartSick={setFirstPartSick} modificarPosicion={modificarPosicion} setNumberSeverSave={setNumberSeverSave} numberSeverSave={numberSeverSave} onAdd={() => setModalEnfermedadesOpen(true)} />
            <ComponentButtonTreatment title="Tratamiento" icon="mci:bandage" tone="info" options={optionsTratement} numberTratSave={numberTratSave} optionsSelectedSave={numberTratSave} idPaw={idPaw} setNumberTratSave={setNumberTratSave} setSecondPartSick={setSecondPartSick} modificarPosicion={modificarPosicion} setNumberSeverSave={setNumberSeverSave} numberSeverSave={numberSeverSave} />
            <ComponentButtonSeverity title="Severidad" icon="pulse-outline" tone="accent" severity={severity} options={optionsSeverity} numberSeverSave={numberSeverSave} numberSeveritySave={numberSeveritySave} optionsSelectedSave={numberSeveritySave} setNumberSeverSave={setNumberSeverSave} setNumberSeveritySave={setNumberSeveritySave} modificarPosicion={modificarPosicion} idPaw={idPaw} setSeverity={setSeverity} />
            <Input
                label="Nota (opcional)"
                placeholder="Observaciones del caso"
                icon="chatbox-ellipses-outline"
                value={note}
                onChangeText={addNote}
                multiline
                style={{ marginTop: 20 }}
            />
        </>
    );

    return <Formik validationSchema={loginValidationSchema} initialValues={initialValues} onSubmit={values => {
        onSubmitCow()
    }}>
        {({ handleSubmit }) => {
            return (
                <Screen
                    header={
                        <Header
                            title={finca || 'Animal'}
                            subtitle={sala ? `Sala ${sala}` : 'Registro de caso'}
                            backTo="/"
                            right={<IconButton icon="list-outline" onPress={() => setIsEdit(true)} accessibilityLabel="Gestionar animales" />}
                        />
                    }
                >
                    <Card style={{ marginTop: 4 }}>
                        <View style={styles.cardHeadRow}>
                            <Text variant="label">Animal</Text>
                            <Button title="Añadir" icon="add" variant="soft" size="sm" onPress={() => setModalCowAddOpen(true)} />
                        </View>
                        <Select
                            onChange={handleChangeDropdown}
                            data={cowList}
                            placeholder="Selecciona el animal"
                            value={defaultValue}
                            icon="mci:cow"
                            style={{ marginBottom: 0 }}
                        />
                        {!iscowSelected && (
                            <Text variant="caption" style={{ marginTop: 10 }}>Elige un animal de la lista o añade uno nuevo para registrar el caso.</Text>
                        )}
                    </Card>

                    <Sheet visible={modalCowAddOpen} onClose={() => setModalCowAddOpen(false)} title="Nuevo animal" subtitle={finca}>
                        <CowForm salaReport={salaReport} setSalaReport={setSalaReport} finca={finca} setSeleccionarAnimal={setSeleccionarAnimal} actualizarVacas={actualizarVacasAdd} id={id} setModalCowAddOpen={setModalCowAddOpen} />
                    </Sheet>
                    <Sheet visible={isEdit} onClose={() => setIsEdit(false)} title="Animales" subtitle={finca} scroll={false}>
                        <ListaVacas setIsEdit={setIsEdit} actualizarVacas={actualizarVacas} />
                    </Sheet>
                    <Sheet visible={modalEnfermedadesOpen} onClose={() => setModalEnfermedadesOpen(false)} title="Nueva enfermedad">
                        <AddEnfermedad actualizarEnfermedades={actualizarEnfermedades} setModalEnfermedadesOpen={setModalEnfermedadesOpen} />
                    </Sheet>
                    <Sheet visible={modalEditSick} onClose={() => setModalEditSick(false)} title="Editar enfermedad" subtitle={namePawn}>
                        <EditEnfermedad actualizarEnfermedades={actualizarEnfermedades} setModalEditSick={setModalEditSick} idEditPawn={idEditPawn} valueEditPawn={valueEditPawn} namePawn={namePawn} />
                    </Sheet>

                    {iscowSelected &&
                        <>
                            {ultimoTratamiento && ultimoTratamiento.length > 0 && (
                                <Card tone="alt" style={styles.block}>
                                    <View style={styles.cardHeadRow}>
                                        <View style={styles.cardHead}>
                                            <Icon name="time-outline" size={18} color={theme.colors.textMuted} />
                                            <Text variant="subheading" style={{ marginLeft: 8 }}>Última historia</Text>
                                        </View>
                                        <Badge label={formatDate(ultimoTratamiento[0].fecha)} icon="calendar-outline" />
                                    </View>
                                    {ultimoTratamiento.map((registro, index) => (
                                        <View key={registro.id ?? index} style={[styles.histRow, index > 0 && styles.histRowBorder]}>
                                            <View style={styles.cardHeadRow}>
                                                <Text variant="bodyLg" weight="semibold" style={{ flex: 1 }} numberOfLines={1}>{convertExtremidad(registro.extremidad) || 'Sin extremidad'}</Text>
                                                <Badge label={registro.tratamiento} tone={treatmentTone(registro.tratamiento)} />
                                            </View>
                                            <Text variant="body" style={{ marginTop: 4 }}>{registro.enfermedades}</Text>
                                            {registro.nota && registro.nota !== 'N/A' ? <Text variant="caption" style={{ marginTop: 2 }}>Nota: {registro.nota}</Text> : null}
                                        </View>
                                    ))}
                                </Card>
                            )}

                            <SectionTitle
                                title="Tipo de atención"
                                icon="medkit-outline"
                                right={anyType ? <Button title="Cambiar" icon="refresh" variant="ghost" size="sm" onPress={clearPartialCowData} /> : null}
                            />
                            <View style={styles.segment}>
                                <Chip label="Terapéutico" tone="accent" size="md" style={styles.segItem} selected={terapeutic} disabled={anyType && !terapeutic}
                                    onPress={() => { setTratamiento('Terapéutico'); isTerapeuctic(true); }} />
                                <Chip label="Revisión" tone="info" size="md" style={styles.segItem} selected={isRevision} disabled={anyType && !isRevision}
                                    onPress={() => { setTratamiento('Revisión'); setRevision(true); }} />
                                <Chip label="Preventivo" tone="primary" size="md" style={styles.segItem} selected={preventive} disabled={anyType && !preventive}
                                    onPress={() => { setTratamiento('Preventivo'); isPreventive(true); setIdPaw(1); }} />
                            </View>
                            <Chip
                                label="Tacón adicional (TA)"
                                icon="mci:bandage"
                                tone="accent"
                                size="md"
                                selected={hasTalonAdicional}
                                onPress={() => setHasTalonAdicional(!hasTalonAdicional)}
                                style={{ alignSelf: 'flex-start', marginTop: 10 }}
                            />

                            {preventive &&
                                <>
                                    <Button
                                        title="Libre de enfermedades"
                                        icon="checkmark-circle"
                                        variant="soft"
                                        size="lg"
                                        fullWidth
                                        style={{ marginTop: 20 }}
                                        onPress={() => { setTratamiento('Libre'); handleSubmit(); }}
                                    />
                                    <SectionTitle title="Patas" icon="mci:cow" subtitle="Selecciona una o varias" />
                                    <View style={styles.pataRow}>
                                        {optionsPawn.map(pata => (
                                            <Chip key={pata.value} label={pata.label} size="xl" tone="primary" style={styles.pataItem} selected={selectedPatas.includes(pata.label)} onPress={() => togglePata(pata.label)} />
                                        ))}
                                    </View>
                                    {selectedPatas.length > 0 &&
                                        <>
                                            {renderHoofCard()}
                                            {renderOptionGroups()}
                                            <Button title="Guardar registro" icon="save-outline" size="lg" fullWidth style={styles.block} onPress={onSubmitPreventivo} />
                                        </>
                                    }
                                </>
                            }

                            {(terapeutic || isRevision) &&
                                <>
                                    <ComponentButton title="Pata" icon="mci:cow" subtitle="Selecciona la pata a tratar" size="xl" tone="primary" stretch cardSelected={cardSelected} setCardSelected={setCardSelected} options={optionsPawn} setPawn={setPawn} setIdPaw={setIdPaw} idPaw={idPaw} />
                                    {idPaw &&
                                        <>
                                            {renderHoofCard()}
                                            {renderOptionGroups()}
                                            <View style={styles.actions}>
                                                <Button title="Guardado parcial" icon="albums-outline" variant="secondary" size="lg" style={{ flex: 1 }} onPress={onSubmitPartialCow} />
                                                <Button title="Guardar" icon="save-outline" size="lg" style={{ flex: 1 }} onPress={handleSubmit} />
                                            </View>
                                            <Text variant="caption" align="center" style={{ marginTop: 10 }}>Guardado parcial conserva el animal seleccionado para registrar otra pata.</Text>
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </Screen>
            )
        }}
    </Formik>
}

const styles = StyleSheet.create({
    block: { marginTop: 16 },
    cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    cardHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 10 },
    histRow: { paddingTop: 4 },
    histRowBorder: { borderTopWidth: 1, borderTopColor: theme.colors.border, marginTop: 12, paddingTop: 12 },
    segment: { flexDirection: 'row', gap: 8 },
    segItem: { flex: 1, height: 48, paddingHorizontal: 6, minWidth: 0 },
    pataRow: { flexDirection: 'row', gap: 8 },
    pataItem: { flex: 1, minWidth: 0, paddingHorizontal: 4 },
    sideViews: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, gap: 12 },
    actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
})
