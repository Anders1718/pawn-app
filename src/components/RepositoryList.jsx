import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, SafeAreaView, StyleSheet, Pressable, TextInput } from 'react-native';
import RepositoryItem from './RepositoryItem.jsx';
import { useRepositories } from '../hooks/useRepositories.js';
import { Link } from 'react-router-native';
import { ModalPaw } from "../components/ModalPaw";
import StyledText from './StyledText'
import StyledTextInput from './StyledTextInput.jsx';
import LogInPage from './AddFinca.jsx';

const RepositoryList = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [search, setsearch] = useState('')
    const [filterData, setfilterData] = useState([])
    const [masterData, setmasterData] = useState([])

    useEffect(() => {
        const fetchFincas = async () => {
            const resultado = await useRepositories();
            setfilterData(resultado.fincas);
            setmasterData(resultado.fincas);
        };

        fetchFincas();
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemData = item.nombre_finca ?
                    item.nombre_finca.toUpperCase()
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

    const actualizarFincas = async () => {
        const resultado = await useRepositories();
        setfilterData(resultado.fincas);
        setmasterData(resultado.fincas);
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Link to='/'>
                    <StyledText fontWeight='bold' color='secondary' fontSize='subheading' style={styles.returnButton}>⬅ Volver</StyledText>
                </Link>
                <Pressable onPress={() => { setIsOpen(true) }}>
                    <StyledText fontWeight='bold' fontSize='subheading' style={styles.returnButton}>+ Agregar Finca</StyledText>
                </Pressable>
                <ModalPaw
                    isOpen={isOpen}
                >
                    <View style={styles.modalView}>
                        <Pressable onPress={() => setIsOpen(false)}>
                            <StyledText fontWeight='bold' fontSize='subheading' style={styles.returnButton}>x</StyledText>
                        </Pressable>
                        <LogInPage actualizarFincas={actualizarFincas} setIsOpen={setIsOpen} />
                    </View>
                </ModalPaw>
            </View>
            <StyledTextInput
                placeholder='Buscar finca...'
                placeholderTextColor="#c2c0c0"
                value={search}
                onChangeText={(text) => searchFilter(text)}
                style={styles.textInput}
            />
            <FlatList
                data={filterData}
                ItemSeparatorComponent={() => <Text> </Text>}
                renderItem={({ item: repo }) => (
                    <RepositoryItem {...repo} />
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
    returnButton: {
        paddingHorizontal: 20
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
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
    textInput:{
        marginHorizontal: 20
    }
});

export default RepositoryList;
