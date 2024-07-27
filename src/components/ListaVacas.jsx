import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RepositoryVacasEdit from './RepositoryVacasEdit.jsx';
import queryString from 'query-string';
import { listadoVacasId } from '../hooks/useRepositories.js';
import StyledTextInput from './StyledTextInput.jsx';
import { useLocation } from 'react-router-native';

const ListaVacas = ({setIsEdit}) => {

    const location = useLocation();
    // Parsea la cadena de consulta para obtener los parámetros
    const queryParams = queryString.parse(location.search);
    const { finca, id, cliente, lugar, nit, tel } = queryParams;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setsearch] = useState('')
    const [filterData, setfilterData] = useState([])
    const [masterData, setmasterData] = useState([])
    const [modalVisible, setModalVisible] = useState(false);

    const fetchFincas = async () => {
        const resultado = await listadoVacasId(id);
        setfilterData(resultado.vacas);
        setmasterData(resultado.vacas);
    };

    // Llamar a la función dentro de useEffect
    useEffect(() => {
        fetchFincas();
    }, [id]);

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
            <StyledTextInput
                placeholder='Buscar animal...'
                placeholderTextColor="#c2c0c0"
                value={search}
                onChangeText={(text) => searchFilter(text)}
                style={styles.textInput}
            />
            <FlatList
                data={filterData}
                ItemSeparatorComponent={() => <Text> </Text>}
                renderItem={({ item: repo }) => (
                    <RepositoryVacasEdit setIsEdit={setIsEdit} fetchFincas={fetchFincas} {...repo} />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        height: 500,
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
    },
    button: {
        borderColor: "#334155",
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10,
        marginBottom:20,
        marginHorizontal: 20,
    },
});

export default ListaVacas;
