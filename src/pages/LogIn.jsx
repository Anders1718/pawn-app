import React from 'react'
import { Formik } from 'formik'
import { View } from 'react-native'
import { loginValidationSchema } from '../validationSchemas/login'
import { Screen, Header, Card, FormField, Button } from '../ui'

// Route kept for compatibility; not reachable from the main flow.
export default function LogInPage() {
    return (
        <Formik validationSchema={loginValidationSchema} initialValues={{ email: '', password: '' }} onSubmit={values => console.log(values)}>
            {({ handleSubmit }) => (
                <Screen header={<Header title="Iniciar sesión" backTo="/" />}>
                    <Card style={{ marginTop: 4 }}>
                        <FormField name="email" label="E-mail" placeholder="correo@ejemplo.com" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
                        <FormField name="password" label="Contraseña" placeholder="••••••••" icon="lock-closed-outline" secureTextEntry />
                        <View style={{ marginTop: 6 }}>
                            <Button title="Entrar" size="lg" fullWidth onPress={handleSubmit} />
                        </View>
                    </Card>
                </Screen>
            )}
        </Formik>
    )
}
