import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import StyledText from '../../../../components/StyledText'
import { useState } from 'react'
import ModalCowList from './components/modal-cow-list/index'

const Sala = ({ listaVacas, setListaVacas }) => {

    const [sala, setSala] = useState([]);
    const [indexSalaGuardar, setIndexSalaGuardar] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const addSala = () => {
        const longitudSala = sala.length;
        const nombre = `Sala ${longitudSala + 1}`
        setSala((prevSala) => [...prevSala, nombre]);
        setIndexSalaGuardar(longitudSala);
    }

    return (
        <View style={styles.conatiner}>
            <View style={styles.menu} >
                {sala.map((nombreSala, indexSala) => (
                    <>
                        <View style={styles.sala}>
                            <StyledText style={{ marginBottom: 15 }} fontSize='title' key={indexSala} fontWeight='bold'>{nombreSala}</StyledText>

                        </View>
                        {listaVacas.map((vaca, indexVaca) => (
                            vaca.sala === indexSala && (
                                <View style={styles.item} key={indexVaca}>
                                    <View style={styles.animalInfo}>
                                        <StyledText fontSize='subheading' fontWeight='bold'>ID-Animal: </StyledText>
                                        <StyledText fontSize='subheading'>{vaca.id}</StyledText>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <StyledText fontSize='subheading' fontWeight='bold'>Descripción:</StyledText>
                                        <StyledText>{vaca.enfermedades}</StyledText>
                                    </View>
                                </View>
                            )
                        ))}
                        <ModalCowList
                            modalVisible={modalVisible}
                            setListaVacas={setListaVacas}
                            setModalVisible={setModalVisible}
                            listaVacas={listaVacas}
                            indexSala={indexSalaGuardar}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setModalVisible(true)}
                        >
                            <StyledText fontSize='subheading' >+ Agregar animal</StyledText>
                        </TouchableOpacity>

                    </>
                ))}
                <TouchableOpacity
                    style={styles.button}
                    onPress={addSala}
                >
                    <StyledText fontSize='subheading' >+ Agregar Sala</StyledText>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {

        alignItems: 'center',
        //width: 200,
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
    }
})

export default Sala;