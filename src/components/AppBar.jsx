import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native'
import StyledText from './StyledText.jsx'
import Constants from 'expo-constants'
import theme from '../theme.js'
import { Link, useLocation } from 'react-router-native'

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.appBar.primary,
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight + 10,
    },
    text: {
        color: theme.appBar.textSecondary,
        paddingHorizontal: 10
    },
    scroll: {
        paddingBottom: 15,
    },
    active: {
        color: theme.appBar.textPrimary,
    }
})

const AppBArTab = ({ children, to }) => {
    const { pathname } = useLocation()

    const active = pathname === to
    const textStyles = [
        styles.text,
        active && styles.active
    ]
    return (
        <Link to={to} component={TouchableWithoutFeedback}>
            <StyledText fontWeight='bold' style={textStyles}>
                {children}
            </StyledText>
        </Link>
    )
}

const AppBar = () => {
    
    return (
        <View style={styles.container}>
            <ScrollView horizontal style={styles.scroll}>
                <AppBArTab active to='/'>Main Menu</AppBArTab>
                <AppBArTab to='/home'>Repositories</AppBArTab>
                <AppBArTab to='/signin'>Sign In</AppBArTab>
            </ScrollView>
        </View>
    )
}

export default AppBar