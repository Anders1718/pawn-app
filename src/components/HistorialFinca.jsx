import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RepositoryHistorial from './RepositoryIHistorial.jsx';
import queryString from 'query-string';
import { historialVacas } from '../hooks/useRepositories.js';
import { Link } from 'react-router-native';
import StyledText from './StyledText.jsx'
import StyledTextInput from './StyledTextInput.jsx';
import { useLocation } from 'react-router-native';

const HistorialFinca = () => {

    const location = useLocation();
    // Parsea la cadena de consulta para obtener los parámetros
    const queryParams = queryString.parse(location.search);
    const { finca, id } = queryParams;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setsearch] = useState('')
    const [filterData, setfilterData] = useState([])
    const [masterData, setmasterData] = useState([])

    useEffect(() => {
        const fetchFincas = async () => {
            const resultado = await historialVacas(id);
            setfilterData(resultado.vacas);
            setmasterData(resultado.vacas);
        };

        fetchFincas();
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemData = item.nombre_vaca ?
                    item.nombre_vaca.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setfilterData(newData);
            setsearch(text);
        } else {
            setfilterData(masterData)
            setsearch(text)
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Link to='/home'>
                    <StyledText fontWeight='bold' color='secondary' fontSize='subheading' >⬅ Volver</StyledText>
                </Link>
            </View>
            <StyledText fontWeight='bold' fontSize='subheading' style={styles.title}>{`🚜Finca: ${finca}`}</StyledText>
            <StyledTextInput
                placeholder='Buscar vaca...'
                placeholderTextColor="#c2c0c0"
                value={search}
                onChangeText={(text) => searchFilter(text)}
                style={styles.textInput}
            />
            <FlatList
                data={filterData}
                ItemSeparatorComponent={() => <Text> </Text>}
                renderItem={({ item: repo }) => (
                    <RepositoryHistorial {...repo} />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        height: 790
    },
    list: {
        marginTop: 10
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginLeft: 20
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
    textInput: {
        marginHorizontal: 20
    }
});

export default HistorialFinca;
