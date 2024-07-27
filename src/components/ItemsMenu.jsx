import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, TouchableWithoutFeedback, Pressable, ScrollView, Alert } from "react-native"
import { Link } from 'react-router-native'
import StyledText from './StyledText'
import theme from '../theme'
import Dropdown from './Dropdown'
import { fetchFincasNombres } from '../hooks/useRepositories'

const RepositoryItemHeader = ({ nombreFinca, idFinca }) => {

    return (
        <View style={{ paddingBottom: 2, flexDirection: 'row', alignSelf: 'center', marginTop: 40 }}>
            <View style={{ paddingRight: 45 }}>

                <Link to='/home' >
                    <View>
                        <Image style={styles.image} source={require(`../img/finca.png`)} />
                        <StyledText fontWeight='bold' fontSize='subheading' style={{ alignSelf: 'center', paddingBottom: 45 }}>Finca</StyledText>
                    </View>
                </Link>
                {nombreFinca ? (
                    <Link to={`/pawpage?finca=${nombreFinca}&id=${idFinca}`} component={TouchableWithoutFeedback} >
                        <View>
                            <Image style={styles.image} source={require(`../img/pata-inicio.png`)} />
                            <StyledText fontWeight='bold' fontSize='subheading' style={{ alignSelf: 'center' }}>Animal</StyledText>
                        </View>
                    </Link>
                ) : (
                    <Pressable onPress={() => Alert.alert('Debe seleccionar un predio')} >
                        <View>
                            <Image style={styles.imageDisabled} source={require(`../img/pata-inicio.png`)} />
                            <StyledText fontWeight='bold' fontSize='subheading' style={{ alignSelf: 'center' }}>Animal</StyledText>
                        </View>
                    </Pressable>
                )
                }
            </View>
            <View >
                <Link to='/home?isBill=true' >
                    <View>
                        <Image style={styles.image} source={require(`../img/factura.png`)} />
                        <StyledText fontWeight='bold' fontSize='subheading' style={{ alignSelf: 'center', paddingBottom: 45 }}>Factura</StyledText>
                    </View>
                </Link>
                <Image style={styles.imageDisabled} source={require(`../img/usuario-2.png`)} />
                <StyledText fontWeight='bold' fontSize='subheading' style={{ alignSelf: 'center' }}>Usuario</StyledText>
            </View>
        </View>
    )
}

const ItemMenu = () => {

    const [fincas, setFincas] = useState([]);
    const [nombreFinca, setNombreFinca] = useState(null);
    const [idFinca, setIdFinca] = useState(null);

    const handleChange = (value, label) => {
        setNombreFinca(label);
        setIdFinca(value);
    }

    useEffect(() => {
        const fetchFincas = async () => {
            const resultado = await fetchFincasNombres();
            setFincas(resultado);
        };

        fetchFincas();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Dropdown
                data={fincas}
                onChange={handleChange}
                placeholder="🚜 Seleccione el predio"

            />
            <RepositoryItemHeader nombreFinca={nombreFinca} idFinca={idFinca} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 50,
        backgroundColor: '#1e293b',
        paddingBottom: 90,
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
        width: 270,
        height: 270,
        borderRadius: 4,
    },
    imageDisabled: {
        width: 270,
        height: 270,
        borderRadius: 4,
        opacity: 0.4
    },
    title: {
        paddingBottom: 100,
        alignSelf: 'center',
        color: 'snow'
    }
})

export default ItemMenu