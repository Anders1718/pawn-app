import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik, useField } from 'formik'
import * as Yup from 'yup'
import { precioValidation } from '../../../../validationSchemas/login'
import { initialValuePrice } from '../../../../utils/initialValuePrice'
import { Card, Input, Button, Text, Icon, SectionTitle, useResponsive } from '../../../../ui'
import theme from '../../../../theme'

const formatNumber = (number) => {
    if (number === 0 || number === '0' || !number) return '0'
    return Number(number).toLocaleString('es-CO')
}

const toNumber = (value) => {
    if (!value) return 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

const PriceField = ({ name, isNumeric = false, ...props }) => {
    const [field, meta, helpers] = useField(name)

    const handleChangeText = (text) => {
        if (isNumeric) {
            helpers.setValue(text.replace(/[^\d]/g, ''))
        } else {
            helpers.setValue(text)
        }
    }

    const displayValue = isNumeric && field.value ? formatNumber(field.value) : String(field.value || '')

    return (
        <Input
            value={displayValue}
            onChangeText={handleChangeText}
            error={meta.error}
            keyboardType={isNumeric ? 'number-pad' : 'default'}
            style={{ marginBottom: 0, flex: 1 }}
            {...props}
        />
    )
}

const TotalBox = ({ total, style }) => (
    <View style={style}>
        <Text variant="label" style={{ marginBottom: 6 }}>Total</Text>
        <View style={styles.totalValue}>
            <Text variant="bodyLg" weight="semibold">$ {formatNumber(total)}</Text>
        </View>
    </View>
)

// One invoice line: description, quantity, unit price and computed total.
const LineItem = ({ title, icon, quantityName, valueName, descriptionName, total, editableTitle }) => {
    const { isTablet } = useResponsive()
    return (
        <Card style={styles.line}>
            <View style={styles.lineHead}>
                <Icon name={icon || 'pricetag-outline'} size={18} color={theme.colors.primary} />
                {editableTitle ? (
                    <PriceField name={descriptionName} placeholder="Descripción" style={{ marginBottom: 0, flex: 1, marginLeft: 10 }} />
                ) : (
                    <Text variant="subheading" style={{ marginLeft: 8, flex: 1 }} numberOfLines={1}>{title}</Text>
                )}
            </View>
            <View style={styles.lineFields}>
                <PriceField name={quantityName} label="Cantidad" placeholder="0" isNumeric />
                <PriceField name={valueName} label="Valor unitario" placeholder="0" isNumeric />
                {isTablet && <TotalBox total={total} style={{ flex: 1 }} />}
            </View>
            {!isTablet && <TotalBox total={total} style={{ marginTop: 10 }} />}
        </Card>
    )
}

const Precio = ({ setTotalCuenta, setSumaTotal, sumaTotal, setButtonContinue, buttonContinue, prices, preventivosCount, terapeuticosCount, revisionCount, talonAdicionalCount }) => {

    const elementosMayoresACero = prices.filter(elemento => elemento > 0)
    const contadorFinal = elementosMayoresACero.length

    const [campo, setCampo] = useState([])
    const [cuenta, setCuenta] = useState([])
    const [indexCuentaGuardar, setIndexCuentaGuardar] = useState(0)
    const [first, setFirst] = useState(false)
    const [name] = useState(['Recorte Terapéutico', 'Recorte Preventivo', 'Revisión'])
    const [total, setTotal] = useState([])

    const contador = contadorFinal + 1
    const contadorDesplazamiento = contadorFinal

    const addCuenta = () => {
        const longitudCuenta = cuenta.length + 1
        setCampo((prevCuenta) => [...prevCuenta, longitudCuenta])
        setIndexCuentaGuardar(longitudCuenta)
        setButtonContinue(true)
    }

    const pushLine = (cantidadRaw, descripcion, valorRaw) => {
        const cantidad = toNumber(cantidadRaw)
        const valor = toNumber(valorRaw)
        const lineTotal = cantidad * valor
        setTotal((prevTotal) => [...prevTotal, lineTotal])
        setSumaTotal((prevTotal) => prevTotal + lineTotal)
        setTotalCuenta((prevCuenta) => [...prevCuenta, { cantidad: cantidadRaw, descripcion, valor: valorRaw, total: lineTotal }])
    }

    const saveCuenta = (values) => pushLine(values.cantidad, values.descripcion, values.valor)
    const saveDesplazamiento = (values) => pushLine(values.cantidadDesplazamiento, 'Desplazamiento', values.valorDesplazamiento)
    const saveTalonAdicional = (values) => pushLine(values.cantidadTalonAdicional, 'Tacón adicional', values.valorTalonAdicional)
    const saveRevision = (values) => { pushLine(values.cantidadRevision, values.descripcionRevision, values.valorRevision); setButtonContinue(false) }
    const saveTerapeuticos = (values) => { pushLine(values.cantidadTerapeuticos, values.descripcionTerapeuticos, values.valorTerapeuticos); setButtonContinue(false) }
    const savePreventivos = (values) => { pushLine(values.cantidadPreventivos, values.descripcionPreventivos, values.valorPreventivos); setButtonContinue(false) }

    const validationSchema = Yup.object().shape({
        cantidad: Yup.number().required('Requerido'),
        descripcion: Yup.string().required('Requerido'),
        valor: Yup.number().required('Requerido'),
    })

    return (
        <View>
            <SectionTitle title="Cuenta de cobro" icon="receipt-outline" subtitle={first ? 'Conceptos guardados. Puedes agregar campos adicionales.' : 'Revisa cantidades y define el valor de cada concepto'} />

            <Formik
                initialValues={initialValuePrice(preventivosCount, terapeuticosCount, revisionCount, talonAdicionalCount, name)}
                validationSchema={precioValidation}
                onSubmit={(values) => {
                    if (terapeuticosCount > 0) saveTerapeuticos(values)
                    if (preventivosCount > 0) savePreventivos(values)
                    if (revisionCount > 0) saveRevision(values)
                    saveDesplazamiento(values)
                    if (talonAdicionalCount > 0) saveTalonAdicional(values)
                    setFirst(true)
                    setButtonContinue(false)
                }}
            >
                {({ handleSubmit }) => (
                    <>
                        {terapeuticosCount > 0 && (
                            <LineItem title={name[0]} icon="mci:stethoscope" quantityName="cantidadTerapeuticos" valueName="valorTerapeuticos" total={total[0]} />
                        )}
                        {preventivosCount > 0 && (
                            <LineItem title={name[1]} icon="shield-checkmark-outline" quantityName="cantidadPreventivos" valueName="valorPreventivos" total={total[1] && terapeuticosCount > 0 ? total[1] : total[0] ? total[0] : 0} />
                        )}
                        {revisionCount > 0 && (
                            <LineItem title={name[2]} icon="eye-outline" quantityName="cantidadRevision" valueName="valorRevision" total={total.length > 0 ? total[contadorDesplazamiento - 1] : 0} />
                        )}
                        <LineItem title="Desplazamiento" icon="car-outline" quantityName="cantidadDesplazamiento" valueName="valorDesplazamiento" total={total[contadorDesplazamiento]} />
                        {talonAdicionalCount > 0 && (
                            <LineItem title="Tacón adicional" icon="mci:bandage" quantityName="cantidadTalonAdicional" valueName="valorTalonAdicional" total={total[contadorDesplazamiento + 1]} />
                        )}
                        {!first && (
                            <Button title="Guardar y continuar" iconRight="arrow-forward" size="lg" fullWidth onPress={handleSubmit} style={{ marginTop: 6 }} />
                        )}
                    </>
                )}
            </Formik>

            {first && (
                <>
                    {campo.map((item, index) => (
                        <Formik
                            key={index}
                            initialValues={{ cantidad: '', descripcion: '', valor: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                setButtonContinue(false)
                                saveCuenta(values)
                            }}
                        >
                            {({ handleSubmit }) => (
                                <>
                                    <LineItem editableTitle icon="add-circle-outline" descriptionName="descripcion" quantityName="cantidad" valueName="valor" total={total[index + contador]} />
                                    {buttonContinue && index === campo.length - 1 && (
                                        <Button title="Guardar campo" icon="checkmark" size="lg" fullWidth onPress={handleSubmit} style={{ marginTop: 6 }} />
                                    )}
                                </>
                            )}
                        </Formik>
                    ))}

                    <Card tone="primary" style={styles.totalCard}>
                        <Text variant="label" style={{ color: theme.colors.primary }}>Total a cobrar</Text>
                        <Text variant="display" style={{ color: theme.colors.primary }}>$ {formatNumber(sumaTotal)}</Text>
                    </Card>
                    {!buttonContinue && (
                        <Button title="Agregar campo" icon="add" variant="secondary" fullWidth onPress={addCuenta} style={{ marginTop: 12 }} />
                    )}
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    line: { marginBottom: 12 },
    lineHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    lineFields: { flexDirection: 'row', gap: 10 },
    totalValue: { height: 50, justifyContent: 'center', paddingHorizontal: 14, borderRadius: theme.radius.md, backgroundColor: theme.colors.primarySoft },
    totalCard: { marginTop: 16, alignItems: 'center' },
})

export default Precio
