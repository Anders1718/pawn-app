import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import StyledText from '../../../../components/StyledText'
import { useState } from 'react'

const Sala = ({ finca, cliente, lugar }) => {

    const [sala, setSala] = useState([]);

    const addSala = () => {
        const longitudSala = sala.length;
        const nombre = `Sala ${longitudSala + 1}`
        setSala((prevSala) => [...prevSala, nombre]);
    }

    return (
        <View style={styles.conatiner}>
            <View style={styles.menu} >
                {sala.map((nombreSala, index) => (
                    <View style={styles.sala}>
                        <StyledText style={{marginBottom:15}} fontSize='title' key={index} fontWeight='bold'>{nombreSala}</StyledText>
                        <View style={styles.item}>
                            <View style={styles.animalInfo}>
                                <StyledText fontSize='subheading' fontWeight='bold' >ID-Animal: </StyledText>
                                <StyledText fontSize='subheading' > 376</StyledText>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <StyledText fontSize='subheading' fontWeight='bold' >Descripción:</StyledText>
                                <StyledText > PI-DL Fisura axial. Moderado Recorte terapéutico sjdjsd sdjsdjjsd</StyledText>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.animalInfo}>
                                <StyledText fontSize='subheading' fontWeight='bold' >ID-Animal: </StyledText>
                                <StyledText fontSize='subheading' > 376</StyledText>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                                <StyledText fontSize='subheading' fontWeight='bold' >Descripción:</StyledText>
                                <StyledText > PI-DL Fisura axial. Moderado Recorte terapéutico sjdjsd sdjsdjjsd</StyledText>
                            </View>
                        </View>
                    </View>
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
    sala:{
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
        marginBottom:15,
    }
})

export default Sala;