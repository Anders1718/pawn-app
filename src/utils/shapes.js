import React from 'react'
import { StyleSheet, View } from 'react-native';
import ButtonTimer from '../components/ButtonTimer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 80,
        paddingHorizontal: 3
    },
    right: {
        width: 60,
        height: 100,
        borderWidth: 2,
        backgroundColor: 'snow',
        marginHorizontal: 10,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 40,
        borderTopRightRadius: 160,
    },
    left: {
        width: 60,
        height: 100,
        borderWidth: 2,
        marginHorizontal: 5,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 60,
        borderTopLeftRadius: 160,
    },
    originalColor: {
        backgroundColor: 'snow'
    },
    colorLeft: {
        backgroundColor: 'pink'
    },
    colorRight: {
        backgroundColor: 'pink'
    }

});

export const SquareLeft = ({ color, onPress, onPressIn }) => {

    const textStyleLeft = [
        styles.left,
        color === 'primary' && styles.originalColor,
        color === 'secondary' && styles.colorLeft,
    ]

    return (
        <View style={styles.container}>
            <ButtonTimer onPress={onPress} onPressIn={onPressIn}>
                <View style={textStyleLeft} />
            </ButtonTimer>
        </View>

    );
};

export const SquareRight = ({ color, onPress, onPressIn }) => {

    const textStyleRight = [
        styles.right,
        color === 'primary' && styles.originalColor,
        color === 'secondary' && styles.colorRight,
    ]

    return (
        <View style={styles.container}>
            <ButtonTimer onPress={onPress} onPressIn={onPressIn}>
                <View style={textStyleRight} />
            </ButtonTimer>
        </View>

    );
};




