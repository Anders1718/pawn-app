import React, { useState } from 'react'
import { View, StyleSheet, Image, Pressable, TouchableWithoutFeedback } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { ModalPaw } from './ModalPaw'
import LogInPage from './EditHistorialVaca'



const RepositoryItemHeader = (props) => {

    const convertirFecha = (fecha) => {

        const fechaNueva = new Date(fecha);

        var dia = fechaNueva.getDate();
        var mes = fechaNueva.getMonth() + 1; // Los meses empiezan desde 0, por lo que necesitas sumar 1
        var año = fechaNueva.getFullYear();

        return dia + '/' + mes + '/' + año;
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



    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
            <View style={styles.card} >
                <StyledText fontWeight='bold' style={{ fontSize: 22 }}>ID Animal: {props.nombre_vaca}</StyledText>
                <StyledText style={{ fontSize: 22 }}>Enfermedades: {props.enfermedades}</StyledText>
                <StyledText style={{ fontSize: 22 }}>Extremidad: {convertExtremidad(props.extremidad) || 'N/A'}</StyledText>
                <StyledText style={styles.language}  >Fecha: {convertirFecha(props.fecha)}</StyledText>
                {props.nota && <StyledText style={{ fontSize: 22 }}>Nota: {props.nota}</StyledText>}
                <StyledText style={styles.language} >Sala: {props.sala}</StyledText>
                <StyledText style={styles.language} >Tratamiento: {props.tratamiento}</StyledText>
            </View>
        </View>
    )
}

const CardEditHistorial = (props) => {

    return (
        <ModalPaw
            isOpen={props.isLong}
        >
            <View style={styles.modalView}>
                <Pressable onPress={() => props.setIsLong(false)}>
                    <StyledText fontWeight='bold' fontSize='subheading' style={styles.returnButton}>x</StyledText>
                </Pressable>
                <LogInPage fetchFincas={props.fetchFincas} isEdit setIsOpen={props.setIsLong} {...props} />
            </View>
        </ModalPaw>
    )
}

const MenuHistorialEdit = (props) => {

    const longPress = () => {
        props.setIsLong(true);
    };

    return (
        <TouchableWithoutFeedback
            onLongPress={longPress}
        >
            <View>
                <RepositoryItemHeader {...props} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const RepositoryHistorial = (props) => {
    const [isLong, setIsLong] = useState(false)
    return (
        <View key={props.id} style={styles.container}>
            <MenuHistorialEdit setIsLong={setIsLong} isLong={isLong} {...props} />
            <CardEditHistorial fetchFincas={props.fetchFincas} isLong={isLong} setIsLong={setIsLong} {...props} />
        </View>
    )
}

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
        overflow: 'hidden',
        fontSize: 18,
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

export default RepositoryHistorial