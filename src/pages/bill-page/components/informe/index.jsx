import React from 'react'
import { StyleSheet, View } from 'react-native'
import StyledText from '../../../../components/StyledText'

const Informe = ({ finca, cliente, lugar, fechaHoyFormateada }) => {
    return (
        <View style={styles.conatiner}>
            <StyledText fontSize='title'>INFORME</StyledText>
            <View style={styles.menu} >
                <View style={styles.info}>
                    <StyledText fontSize='subheading'>Cliente: {cliente}</StyledText>
                    <StyledText fontSize='subheading'>Ubicación: {lugar}</StyledText>
                </View>
                <View style={styles.info}>
                    <StyledText fontSize='subheading'>Finca: {finca}</StyledText>
                    <StyledText fontSize='subheading'>Fecha: {fechaHoyFormateada}</StyledText>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: 'center',
    },
    menu:{
        marginTop: 20,
        marginBottom:20
    },
    info:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        width: 410,
        padding:5
    },
})

export default Informe;