import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { StyleSheet, View, Alert, Image, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { userValidation } from '../validationSchemas/user'
import { addUser, fetchUsers, editUser } from '../hooks/useRepositories'
import { Screen, Header, Card, FormField, FormRow, Button, Text, Icon, SectionTitle, PressableScale } from '../ui'
import theme from '../theme'

const addUsers = async (values, users) => {
    if (users.length === 0) {
        try {
            await addUser(values)
            Alert.alert('Perfil creado', 'Usuario registrado correctamente')
        } catch (error) {
            Alert.alert('Error', 'Error al registrar usuario')
        }
    } else {
        try {
            await editUser(values)
            Alert.alert('Perfil actualizado', 'Usuario editado correctamente')
        } catch (error) {
            Alert.alert('Error', 'Error al editar usuario')
        }
    }
}

export default function RegisterUserPage() {
    const [initialValues, setInitialValues] = useState({
        nombre: '', apellido: '', profesion: '', universidad: '', banco: '', tipoCuenta: '', numeroCuenta: '', telefono: '', documento: '', direccion: '', logo: '',
    })
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserInfo = async () => {
            const resultado = await fetchUsers()
            setUsers(resultado)
            if (resultado.length > 0) {
                const user = resultado[0]
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
                    logo: user.logo,
                })
            }
            setIsLoading(false)
        }
        fetchUserInfo()
    }, [])

    const pickImage = async (setFieldValue) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Se necesitan permisos para acceder a la galería')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        })
        if (!result.canceled) {
            setFieldValue('logo', `data:image/jpeg;base64,${result.assets[0].base64}`)
        }
    }

    const header = <Header title="Perfil profesional" subtitle="Aparece en informes y facturas" backTo="/" />

    if (isLoading) {
        return (
            <Screen header={header} scroll={false}>
                <View style={styles.loading}>
                    <ActivityIndicator color={theme.colors.primary} size="large" />
                    <Text variant="caption" style={{ marginTop: 12 }}>Cargando perfil...</Text>
                </View>
            </Screen>
        )
    }

    return (
        <Formik
            validationSchema={userValidation}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={async values => { await addUsers(values, users) }}
        >
            {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                <Screen
                    header={header}
                    footer={<Button title={users.length === 0 ? 'Registrar perfil' : 'Guardar cambios'} icon="save-outline" size="lg" fullWidth loading={isSubmitting} onPress={handleSubmit} />}
                >
                    <Card style={{ marginTop: 4 }}>
                        <View style={styles.logoRow}>
                            <PressableScale onPress={() => pickImage(setFieldValue)} style={styles.logoBox} accessibilityRole="button" accessibilityLabel="Seleccionar logo">
                                {values.logo ? (
                                    <Image source={{ uri: values.logo }} style={styles.logoImage} resizeMode="contain" />
                                ) : (
                                    <Icon name="image-outline" size={30} color={theme.colors.textFaint} />
                                )}
                            </PressableScale>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text variant="subheading" numberOfLines={1}>{[values.nombre, values.apellido].filter(Boolean).join(' ') || 'Tu nombre'}</Text>
                                <Text variant="caption" numberOfLines={1}>{values.profesion || 'Profesión'}</Text>
                                <Button title={values.logo ? 'Cambiar logo' : 'Seleccionar logo'} icon="image-outline" variant="soft" size="sm" onPress={() => pickImage(setFieldValue)} style={{ alignSelf: 'flex-start', marginTop: 10 }} />
                            </View>
                        </View>
                    </Card>

                    <SectionTitle title="Datos personales" icon="person-outline" />
                    <Card>
                        <FormRow>
                            <FormField name="nombre" label="Nombre" placeholder="Nombre" icon="person-outline" />
                            <FormField name="apellido" label="Apellido" placeholder="Apellido" icon="person-outline" />
                        </FormRow>
                        <FormRow>
                            <FormField name="profesion" label="Profesión" placeholder="Ej. Médico veterinario" icon="briefcase-outline" />
                            <FormField name="universidad" label="Universidad" placeholder="Institución" icon="school-outline" />
                        </FormRow>
                        <FormRow>
                            <FormField name="documento" label="Documento" placeholder="Número de documento" icon="id-card-outline" keyboardType="number-pad" />
                            <FormField name="telefono" label="Teléfono" placeholder="Número de contacto" icon="call-outline" keyboardType="phone-pad" />
                        </FormRow>
                    </Card>

                    <SectionTitle title="Facturación" icon="card-outline" subtitle="Datos bancarios para la cuenta de cobro" />
                    <Card>
                        <FormField name="direccion" label="Dirección de facturación" placeholder="Dirección" icon="home-outline" />
                        <FormField name="banco" label="Banco" placeholder="Nombre del banco" icon="business-outline" />
                        <FormRow>
                            <FormField name="tipoCuenta" label="Tipo de cuenta" placeholder="Ahorros / Corriente" icon="wallet-outline" />
                            <FormField name="numeroCuenta" label="Número de cuenta" placeholder="Número" icon="card-outline" keyboardType="number-pad" style={{ marginBottom: 0 }} />
                        </FormRow>
                    </Card>
                </Screen>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoBox: { width: 96, height: 96, borderRadius: 20, backgroundColor: theme.colors.surfaceAlt, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    logoImage: { width: '100%', height: '100%' },
})
