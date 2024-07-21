import React from "react";
import { Modal as RNModal, StyleSheet, KeyboardAvoidingView, View, Platform } from 'react-native'

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
        marginTop: -5
    },
    form: {
        margin: 12,
    },
    paw: {
        flexDirection: 'row',
    },
    modal: {
        paddingLeft: 0.75,
        paddingRight: 0.75,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export const ModalPaw = ({ isOpen, withInput, children, ...rest }) => {

    const content = withInput ? (
        <KeyboardAvoidingView
            style={styles.modal}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <KeyboardAvoidingView
            style={styles.modal}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            {children}
        </KeyboardAvoidingView>
    )
    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
            {...rest}
        >
            {content}
        </RNModal>

    )
}