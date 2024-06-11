import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Card({ onPress, isTurnedOver, children }) {
    return (
        <TouchableOpacity
            style={!isTurnedOver ? styles.cardDown : styles.cardUp}
            onPress={onPress}
        >
            <Text style={styles.text}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardUp: {
        width: 100,
        height: 100,
        marginHorizontal: 5,
        marginVertical: 10,
        borderColor: "#334155",
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b598a",
    },
    cardDown: {
        width: 100,
        height: 100,
        marginHorizontal: 5,
        marginVertical: 10,
        borderWidth: 10,
        borderColor: "#334155",
        borderRadius: "25%",
        backgroundColor: "#1e293b",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 46,
        color: "snow",
    },
});
