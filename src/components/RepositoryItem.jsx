import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Pressable } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { useNavigate } from 'react-router-native';
import { ModalPaw } from './ModalPaw';
import LogInPage from './EditFinca';

const CardFarm = (props) => (
    <View style={styles.card} >
        <StyledText fontWeight='bold' style={{ fontSize: 20 }}>Finca: {props.nombre_finca}</StyledText>
        <StyledText style={{ fontSize: 17 }}>Cliente: {props.nombre_propietario}</StyledText>
        <StyledText style={styles.language} >Ubicación: {props.ubicacion}</StyledText>
        <StyledText style={{ fontSize: 17 }} >Nit: {props.nit}</StyledText>
        <StyledText style={{ fontSize: 17 }} >Tel: {props.telefono}</StyledText>
        <StyledText style={{ fontSize: 17 }} >Dirección: {props.direccion}</StyledText>
    </View>
)

const CardFarmEdit = (props) => {

    return (
        <ModalPaw
            isOpen={props.isLong}
        >
            <View style={styles.modalView}>
                <Pressable onPress={() => props.setIsLong(false)}>
                    <StyledText fontWeight='bold' fontSize='subheading' style={styles.returnButton}>x</StyledText>
                </Pressable>
                <LogInPage isEdit actualizarFincas={props.actualizarFincas} setIsOpen={props.setIsLong} {...props} />
            </View>
        </ModalPaw>
    )
}


const RepositoryItemHeader = (props) => {

    const navigate = useNavigate();

    const handlePress = () => {
        if (!props.isLong) {
            if (props?.isBill) {
                navigate(`/bill?finca=${props.nombre_finca}&cliente=${props.nombre_propietario}&lugar=${props.ubicacion}&direccion=${props.direccion}&nit=${props.nit}&tel=${props.telefono}&id=${props.id}`);
            } else {
                navigate(`/historial?finca=${props.nombre_finca}&id=${props.id}&cliente=${props.nombre_propietario}&lugar=${props.ubicacion}`);
            }
        }
    };

    const longPress = () => {
        props.setIsLong(true);
    };

    return (
        <TouchableWithoutFeedback
            onPressOut={handlePress}
            onLongPress={longPress}
        >
            <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
                <CardFarm {...props} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const RepositoryItem = (props) => {
    const [isLong, setIsLong] = useState(false);
    return (
        <View key={props.id} style={styles.container}>
            <RepositoryItemHeader setIsLong={setIsLong} isLong={isLong} {...props} />
            <CardFarmEdit isLong={isLong} setIsLong={setIsLong} {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingVertical: 5,
    },
    language: {
        color: theme.colors.white,
        alignSelf: 'flex-start',
        marginVertical: 4,
        borderRadius: 4,
        overflow: 'hidden'
    },
    card: {
        flex: 1,
        backgroundColor: '#94ACD4',
        padding: 10,
        borderRadius: 4,
        width: 370
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
})

export default RepositoryItem
