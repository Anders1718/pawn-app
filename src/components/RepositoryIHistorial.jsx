import React from 'react'
import { View, StyleSheet, Image } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { Link } from 'react-router-native'

const RepositoryItemHeader = (props) => {

    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
            {/* <View style={{paddingRight: 10 }}>
            <Image style={styles.image} source={require(`../img/pata-inicio.jpeg`)}  />
        </View> */}
            <Link to='/historial'>
                <View style={styles.card} >
                    <StyledText fontWeight='bold'>Vaca: {props.nombre_vaca}</StyledText>
                    <StyledText >Enfermedades: {props.enfermedades}</StyledText>
                    <StyledText style={styles.language} >Fecha: {props.fecha}</StyledText>
                </View>
            </Link>
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