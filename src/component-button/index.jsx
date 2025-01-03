import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, FlatList } from "react-native";
import Card from "./card/Card";


const ComponentButton =
    ({
        title,
        options,
        idPaw,
        setIdPaw,
        modificarPosicion,
        setPawn,
        setFirstPartSick,
        setSecondPartSick,
        modificarPosicionSick,
        setNumberPawnPart,
        numberPawnPart,
        optionsSelectedSave,
        numberPawnSave,
        numberSickSave,
        numberTratSave,
        numberSeverSave,
        setNumberPawnSave,
        setNumberSickSave,
        setNumberTratSave,
        setNumberSeverSave,
        cardSelected,
        setCardSelected,
        handleLongPress,
    }) => {



        const updateArrayAtPosition = (index, newValue, setArray, actualArray) => {
            // Hacemos una copia del array actual
            const newArray = [...actualArray];

            const arrayPoscion = actualArray[index]

            const itemsArray = actualArray[index].indexOf(newValue);

            if (itemsArray === -1) {
                // Si el elemento no existe en el array, añadirlo
                arrayPoscion.push(newValue);
            } else {
                // Si el elemento existe en el array, eliminarlo
                arrayPoscion.splice(itemsArray, 1);
            }

            // Modificamos el valor en la posición especificada
            newArray[index] = arrayPoscion;
            // Actualizamos el estado con el array modificado
            setArray(newArray);
        };

        const toggleString = (str) => {
            setSecondPartSick((prevState) => {
              if (prevState.includes(str)) {
                return prevState.filter(item => item !== str);
              } else {
                return [...prevState, str];
              }
            });
          };

        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <View style={styles.board}>
                    <FlatList
                        contentContainerStyle={styles.flatList}
                        data={options}
                        scrollEnabled={false}
                        numColumns={5}
                        ItemSeparatorComponent={() => <Text> </Text>}
                        renderItem={({ item: repo, index }) => {
                            let isTurnedOver = false;
                            if (optionsSelectedSave) {
                                isTurnedOver = optionsSelectedSave[idPaw - 1].indexOf(repo.number) !== -1 ? true : false;
                            } else {
                                isTurnedOver = cardSelected === index;
                            }
                            return (<Card
                                key={index}
                                isTurnedOver={isTurnedOver}
                                handleLongPress={() => handleLongPress({...repo})}
                                onPress={() => {
                                    if (setNumberPawnPart) {
                                        updateArrayAtPosition(idPaw - 1, repo.number, setNumberPawnSave, numberPawnSave)
                                        setNumberPawnPart(repo.label)
                                    }
                                    if (setPawn) {
                                        setPawn(repo.label)
                                        setIdPaw(repo.value)
                                    }
                                    if (!optionsSelectedSave) {
                                    if (cardSelected === index) {
                                        setCardSelected(-1)
                                    } else {
                                        setCardSelected(index);
                                        }
                                    }
                                    if (setSecondPartSick) {
                                        toggleString(repo.value);
                                        updateArrayAtPosition(idPaw - 1, repo.number, setNumberTratSave, numberTratSave)
                                    } if (setFirstPartSick) {
                                        setFirstPartSick(repo.value);
                                        updateArrayAtPosition(idPaw - 1, repo.number, setNumberSickSave, numberSickSave)
                                    }
                                    if (modificarPosicion) {
                                        updateArrayAtPosition(idPaw - 1, repo.number, setNumberSeverSave, numberSeverSave)
                                        modificarPosicion(idPaw - 1, repo.value);
                                    } 
                                }}
                            >
                                {repo.label}
                            </Card>)
                        }}
                    />
                </View>
                <StatusBar style="light" />
            </SafeAreaView>
        );
    }

export default ComponentButton;

const styles = StyleSheet.create({
    container: {

    },
    title: {
        display: 'flex',
        // backgroundColor: 'red',
        alignItems: "center",
        fontSize: 32,
        fontWeight: "900",
        color: "snow",
        marginVertical: 15,
        textAlign: 'center',
    },
    flatList: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
