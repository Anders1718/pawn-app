import React from 'react'
import { View, StyleSheet, Image } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { Link } from 'react-router-native'

const RepositoryItemHeader = (props) => {

    const convertirFecha = (fecha) => {

        const fechaNueva = new Date(fecha);

        var dia = fechaNueva.getDate();
        var mes = fechaNueva.getMonth() + 1; // Los meses empiezan desde 0, por lo que necesitas sumar 1
        var año = fechaNueva.getFullYear();

        return dia + '/' + mes + '/' + año;
    }

    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
                <View style={styles.card} >
                    <StyledText fontWeight='bold'>ID Animal: {props.nombre_vaca}</StyledText>
                    <StyledText >Enfermedades: {props.enfermedades}</StyledText>
                    <StyledText style={styles.language} >Fecha: {convertirFecha(props.fecha)}</StyledText>
                    {props.nota && <StyledText >Nota: {props.nota}</StyledText>}
                    <StyledText style={styles.language} >Sala: {props.sala}</StyledText>
                    <StyledText style={styles.language} >Tratamiento: {props.tratamiento}</StyledText>
                </View>
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