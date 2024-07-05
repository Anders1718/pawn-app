import React from 'react'
import { View, StyleSheet, Image } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { Link } from 'react-router-native'

const CardFarm = (props) => (
    <View style={styles.card} >
        <StyledText fontWeight='bold' style={{ fontSize: 20 }}>Finca: {props.nombre_finca}</StyledText>
        <StyledText style={{ fontSize: 17 }}>Cliente: {props.nombre_propietario}</StyledText>
        <StyledText style={styles.language} >Ubicación: {props.ubicacion}</StyledText>
        <StyledText style={{ fontSize: 17 }} >Nit: {props.nit}</StyledText>
        <StyledText style={{ fontSize: 17 }} >Tel: {props.telefono}</StyledText>
    </View>
)

const RepositoryItemHeader = (props) => {
    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
            {props?.isBill ? (
                <Link to={`/bill?finca=${props.nombre_finca}&cliente=${props.nombre_propietario}&lugar=${props.ubicacion}&nit=${props.nit}&tel=${props.telefono}&id=${props.id}`}>
                    <CardFarm {...props} />
                </Link>
            ) : (
                <Link to={`/historial?finca=${props.nombre_finca}&id=${props.id}&cliente=${props.nombre_propietario}&lugar=${props.ubicacion}`}>
                    <CardFarm {...props} />
                </Link>
            )}
        </View>
    )
}

const RepositoryItem = (props) => (
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
        // padding: 4,
        color: theme.colors.white,
        // backgroundColor: theme.colors.primary,
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
        borderRadius: 4,
        width: 370
    }
})

export default RepositoryItem