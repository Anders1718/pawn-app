import React, { useEffect, useState } from 'react'
import { Formik, useField } from 'formik'
import { Button, StyleSheet, TextInput, View, Alert } from 'react-native'
import StyledTextInput from '../components/StyledTextInput'
import StyledText from '../components/StyledText'
import { userValidation } from '../validationSchemas/user'
import { addUser, fetchUsers, editUser } from '../hooks/useRepositories'
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
        marginTop: -5
    },
    form: {
        margin: 12,
        color: 'snow'
    },
    returnMenu: {
        fontSize: 34,
        marginBottom: 15,
        fontWeight: 300,
        width: 140,
        color: 'gray',
    },
    container: {
        margin: 12,
        marginTop: 70,
    }
})

const addUsers = async (values, users) => {
    if (users.length === 0) {
        try {
            await addUser(values);
            Alert.alert('Usuario registrado correctamente');
        } catch (error) {
            Alert.alert('Error al registrar usuario');
        }
    } else {
        try {
            await editUser(values);
            Alert.alert('Usuario editado correctamente');
        } catch (error) {
            Alert.alert('Error al editar usuario');
        }
    }
};

const FormikInputValue = ({ name, onSubmitEditing, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <StyledTextInput
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                onSubmitEditing={onSubmitEditing}
                {...props}
            />
        </>
    )
}

export default function RegisterUserPage() {
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        apellido: '',
        profesion: '',
        universidad: '',
        banco: '',
        tipoCuenta: '',
        numeroCuenta: '',
        telefono: '',
        documento: '',
        direccion: '',
    });
    
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const resultado = await fetchUsers();
            setUsers(resultado);
            if (resultado.length > 0) {
                const user = resultado[0];
                console.log("user", user);
                setInitialValues({
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    profesion: user.profesion,
                    universidad: user.universidad,
                    banco: user.banco,
                    tipoCuenta: user.tipoCuenta,
                    numeroCuenta: user.numeroCuenta,
                    telefono: user.telefono,
                    documento: user.documento,
                    direccion: user.direccion,
                });
            }
            setIsLoading(false);
        };
        fetchUserInfo();
    }, []);

    if (isLoading) {
        return <View><StyledText>Cargando...</StyledText></View>;
    }

    return <Formik 
        validationSchema={userValidation} 
        initialValues={initialValues} 
        enableReinitialize={true}
        onSubmit={values => {
            addUsers(values, users)
        }}
    >
        {({ handleChange, handleSubmit, values, isValid }) => {
            return (
                <View style={styles.container}>
                    <Link to='/' style={styles.returnMenu}>
                        <StyledText style={styles.returnMenu} fontWeight='bold' color='secondary' fontSize='subheading' >⬅ Volver</StyledText>
                    </Link>
                    <View style={styles.form}>
                        <FormikInputValue
                            name='nombre'
                            placeholder='Nombre'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='apellido'
                            placeholder='Apellido'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='profesion'
                            placeholder='Profesión'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='universidad'
                            placeholder='Universidad'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='banco'
                            placeholder='Nombre del Banco'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='telefono'
                            placeholder='Teléfono'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='documento'
                            placeholder='Número de documento'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='direccion'
                            placeholder='Dirección facturación'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='tipoCuenta'
                            placeholder='Tipo de Cuenta'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        <FormikInputValue
                            name='numeroCuenta'
                            placeholder='Número de Cuenta'
                            placeholderTextColor="#c2c0c0"
                            onSubmitEditing={() => {
                                if (isValid) handleSubmit();
                            }}
                        />
                        {users.length === 0 && (
                            <Button onPress={handleSubmit} title='Registrar Usuario' />
                        )}
                        {users.length > 0 && (
                            <Button onPress={handleSubmit} title='Editar Usuario' />
                        )}
                    </View>
                </View>
            )
        }}
    </Formik>
}