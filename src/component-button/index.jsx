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
        setContadorBotones,
        modificarPosicionSick,
        contadorBotones,
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
        setNumberSeverSave
    }) => {

        const [cardSelected, setCardSelected] = React.useState(null);

        const updateArrayAtPosition = (index, newValue, setArray, actualArray) => {
            // Hacemos una copia del array actual
            const newArray = [...actualArray];
            // Modificamos el valor en la posición especificada
            newArray[index] = newValue;
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
                                isTurnedOver = index === optionsSelectedSave[idPaw] - 1;
                            } else {
                                isTurnedOver = cardSelected === index;
                            }
                            return (<Card
                                key={index}
                                isTurnedOver={isTurnedOver}
                                onPress={() => {
                                    if (setNumberPawnPart) {
                                        updateArrayAtPosition(idPaw, repo.number, setNumberPawnSave, numberPawnSave)
                                        setNumberPawnPart(repo.label)
                                    }
                                    if (setPawn) {
                                        setPawn(repo.label)
                                        setIdPaw(repo.value)
                                    }
                                    if (cardSelected === index) {
                                        if (setContadorBotones) {
                                            const valor = contadorBotones - 1;
                                            setContadorBotones(valor);
                                        }
                                        setCardSelected(-1)
                                    } else {
                                        if (setContadorBotones) {
                                            const valor = contadorBotones + 1;
                                            setContadorBotones(valor);
                                        }
                                        setCardSelected(index)
                                    }
                                    if (modificarPosicionSick) {
                                        updateArrayAtPosition(idPaw, repo.number, setNumberSeverSave, numberSeverSave)
                                        modificarPosicionSick(idPaw, true);
                                        modificarPosicion(idPaw, repo.value)
                                    } else if (setSecondPartSick) {
                                        updateArrayAtPosition(idPaw, repo.number, setNumberTratSave, numberTratSave)
                                        toggleString(repo.value);
                                    } else if (setFirstPartSick) {
                                        updateArrayAtPosition(idPaw, repo.number, setNumberSickSave, numberSickSave)
                                        setFirstPartSick(repo.value)
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
