import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import RepositoryHistorial from './RepositoryIHistorial.jsx';
import queryString from 'query-string';
import { historialVacas } from '../../../../../../hooks/useRepositories.js';
import { Link } from 'react-router-native';
import StyledText from '../../../../../../components/StyledText.jsx';
import StyledTextInput from '../../../../../../components/StyledTextInput.jsx';
import { useLocation } from 'react-router-native';

const HistorialFinca = ({ modalVisible, setListaVacas, setModalVisible, listaVacas, indexSala }) => {

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
        <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.modalView}>
                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                >
                    <StyledText fontSize='subheading' fontWeight='bold'>X</StyledText>
                </TouchableOpacity>
                <StyledText fontSize='subheading' fontWeight='bold'>Selecciona el animal</StyledText>
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
                        <RepositoryHistorial {...repo} setListaVacas={setListaVacas} setModalVisible={setModalVisible} listaVacas={listaVacas} indexSala={indexSala} />
                    )}
                />
            </View>
        </Modal>

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
        marginTop: 180,
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
