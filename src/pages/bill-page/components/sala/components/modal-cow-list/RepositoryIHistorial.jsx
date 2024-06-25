import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from "react-native"
import StyledText from '../../../../../../components/StyledText'
import theme from '../../../../../../theme'

const RepositoryItemHeader = (props) => {

    const addVaca = (id, enfermedades) => {
        const newVaca = {
            id: id,
            enfermedades: enfermedades,
            sala: props.indexSala
        }   
        // Add element to Usestate array 
        const updatedItems = [...props.listaVacas];
        updatedItems.push(newVaca);
        props.setListaVacas(updatedItems);
        props.setModalVisible(false)
    };


    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
            <TouchableOpacity
                onPress={() => {
                    addVaca(props.nombre_vaca, props.enfermedades)
                }}
            >
                <View style={styles.card} >
                    <StyledText fontWeight='bold'>ID Animal: {props.nombre_vaca}</StyledText>
                    <StyledText >Enfermedades: {props.enfermedades}</StyledText>
                    <StyledText style={styles.language} >Fecha: {props.fecha}</StyledText>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const RepositoryHistorial = (props) => (
    <View key={props.id} style={styles.container}>
        <RepositoryItemHeader {...props} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingVertical: 5,
    },
    language: {
        padding: 4,
        color: theme.colors.white,
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        marginVertical: 4,
        borderRadius: 4,
        overflow: 'hidden'
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 4,
        borderColor: 'red'
    },
    card: {
        flex: 1,
        backgroundColor: '#94ACD4',
        padding: 10,
        borderRadius: 4
    }
})

export default RepositoryHistorial