import React from 'react'
import { Alert, View, StyleSheet, TouchableOpacity } from "react-native"
import StyledText from './StyledText'
import theme from '../theme'
import { Link } from 'react-router-native'
import { deleteVacasId } from '../hooks/useRepositories'

const RepositoryItemHeader = (props) => {


    return (
        <View style={{ flexDirection: 'row', paddingBottom: 2 }}>
            <View style={styles.card} >
                <StyledText fontWeight='bold' style={{ fontSize: 22 }}>Animal: {props.nombre_vaca}</StyledText>
            </View>
        </View>
    )
}

const RepositoryVacasEdit = (props) => {

    const deleteAnimal = async () => {
        await deleteVacasId(props.id);
        props.fetchFincas();
    }

    const pressAnimalDelete = () => {
        Alert.alert(
            "Eliminar Animal",
            "¿Estás seguro de que deseas continuar?",
            [
              {
                text: "Cancelar",
                onPress: () => props.setIsEdit(false),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                deleteAnimal();
              } }
            ],
            { cancelable: false }
          );
        

    }

    return( 
    <TouchableOpacity
        onPress={pressAnimalDelete}
    >
        <View key={props.id} style={styles.container}>
            <RepositoryItemHeader {...props} />
        </View>
    </TouchableOpacity>
)}

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
    }
})

export default RepositoryVacasEdit