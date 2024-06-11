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

        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <View style={styles.board}>
                    <FlatList
                        data={options}
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
                                        setSecondPartSick(repo.value)
                                    } else if (setFirstPartSick) {
                                        updateArrayAtPosition(idPaw, repo.number, setNumberSickSave, numberSickSave)
                                        setFirstPartSick(repo.value)
                                    }
                                }}
                            >
                                {repo.label}
                            </Card>)
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <StatusBar style="light" />
            </SafeAreaView>
        );
    }

export default ComponentButton;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "start",
        // backgroundColor: 'red',
        height: 200
    },
    board: {

    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "snow",
        marginVertical: 15,
    },
});
