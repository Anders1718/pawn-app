import React from "react";
import { View, Text } from "react-native";
import RepositoryList from "./RepositoryList";
import { Routes, Route, Navigate } from "react-router-native";
import LogInPage from '../pages/LogIn.jsx'
import PawPage from "../pages/PawPage.jsx";
import HistorialFinca from "./HistorialFinca.jsx";
import ItemMenu from "./ItemsMenu.jsx";

const Main = () => {
    return (
        <View style={{ flex: 1, backgroundColor:'#1e293b' }}>
            <Routes>
                <Route path='/' element={<ItemMenu/>} />
                <Route path='/home' element={<RepositoryList/>} />
                <Route path='/signin' element={<LogInPage/>} />
                <Route path='/pawpage' element={<PawPage/>} />
                <Route path='/historial' element={<HistorialFinca/>} />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </View>
    )
}

export default Main