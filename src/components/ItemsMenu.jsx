import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useNavigate } from 'react-router-native'
import Constants from 'expo-constants'
import { fetchFincasNombres, exportDatabase, importDatabase } from '../hooks/useRepositories'
import { Screen, Card, Select, Button, Text, Icon, SectionTitle, PressableScale, useResponsive } from '../ui'
import theme from '../theme'

const Tile = ({ title, description, icon, tone, disabled, onPress, width }) => {
    const colors = {
        primary: [theme.colors.primarySoft, theme.colors.primary],
        accent: [theme.colors.accentSoft, theme.colors.accent],
        info: [theme.colors.infoSoft, '#93C5FD'],
        neutral: [theme.colors.surfaceAlt, theme.colors.textMuted],
    }[tone || 'primary']

    return (
        <PressableScale onPress={onPress} style={[styles.tile, { width }, disabled && styles.tileDisabled]} accessibilityRole="button" accessibilityLabel={title}>
            <View style={[styles.tileIcon, { backgroundColor: colors[0] }]}>
                <Icon name={icon} size={26} color={colors[1]} />
            </View>
            <Text variant="subheading" style={styles.tileTitle} numberOfLines={1}>{title}</Text>
            <Text variant="caption" numberOfLines={2}>{description}</Text>
            <Icon name="chevron-forward" size={18} color={theme.colors.textFaint} style={styles.tileChevron} />
        </PressableScale>
    )
}

const BrandHeader = () => {
    const { gutter, contentWidth } = useResponsive()
    return (
        <View style={[styles.brand, { paddingTop: Constants.statusBarHeight + 14, paddingHorizontal: gutter, maxWidth: contentWidth }]}>
            <View style={styles.brandMark}>
                <Icon name="mci:cow" size={26} color="#062B1E" />
            </View>
            <View style={{ flex: 1 }}>
                <Text variant="title">Podología Bovina</Text>
                <Text variant="caption">Registro de casos, historial e informes</Text>
            </View>
        </View>
    )
}

export default function ItemMenu() {
    const navigate = useNavigate()
    const { columns, innerWidth } = useResponsive()

    const [fincas, setFincas] = useState([])
    const [nombreFinca, setNombreFinca] = useState(null)
    const [idFinca, setIdFinca] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)

    const loadFincas = useCallback(async () => {
        const resultado = await fetchFincasNombres()
        setFincas(resultado)
    }, [])

    useEffect(() => { loadFincas() }, [loadFincas])

    const handleChange = (value, label) => {
        setNombreFinca(label)
        setIdFinca(value)
    }

    const handleExportDB = async () => {
        try {
            setIsExporting(true)
            await exportDatabase()
        } catch (error) {
            Alert.alert('Error', 'No se pudo exportar la base de datos')
        } finally {
            setIsExporting(false)
        }
    }

    const handleImportDB = () => {
        Alert.alert(
            'Importar base de datos',
            'Esta acción reemplazará todos los datos actuales. ¿Desea continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Importar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsImporting(true)
                            const result = await importDatabase()
                            if (result.success) {
                                Alert.alert('Éxito', result.message)
                                await loadFincas()
                                setNombreFinca(null)
                                setIdFinca(null)
                            }
                        } catch (error) {
                            Alert.alert('Error', error.message || 'No se pudo importar la base de datos')
                        } finally {
                            setIsImporting(false)
                        }
                    },
                },
            ]
        )
    }

    const goToAnimal = () => {
        if (!nombreFinca) {
            Alert.alert('Selecciona una finca', 'Elige la finca activa para registrar animales.')
            return
        }
        const params = new URLSearchParams({ finca: nombreFinca, id: String(idFinca) })
        navigate(`/pawpage?${params.toString()}`)
    }

    const gap = 12
    const tileWidth = Math.floor((innerWidth - gap * (columns - 1)) / columns)

    const tiles = [
        { key: 'fincas', title: 'Fincas', description: 'Clientes, predios e historial', icon: 'mci:barn', tone: 'primary', onPress: () => navigate('/home') },
        { key: 'animal', title: 'Animal', description: nombreFinca ? `Registrar caso en ${nombreFinca}` : 'Selecciona una finca primero', icon: 'mci:cow', tone: 'accent', disabled: !nombreFinca, onPress: goToAnimal },
        { key: 'factura', title: 'Factura', description: 'Cuenta de cobro por periodo', icon: 'receipt-outline', tone: 'info', onPress: () => navigate('/home?isBill=true') },
        { key: 'usuario', title: 'Perfil', description: 'Datos del profesional y logo', icon: 'person-outline', tone: 'neutral', onPress: () => navigate('/user') },
    ]

    return (
        <Screen header={<BrandHeader />}>
            <Card style={styles.selectorCard}>
                <Text variant="label" style={{ marginBottom: 8 }}>Finca activa</Text>
                <Select
                    data={fincas}
                    value={idFinca}
                    onChange={handleChange}
                    placeholder="Seleccione el predio"
                    icon="mci:barn"
                    style={{ marginBottom: 0 }}
                />
                <View style={styles.selectorHint}>
                    <Icon name={nombreFinca ? 'checkmark-circle' : 'information-circle-outline'} size={16} color={nombreFinca ? theme.colors.primary : theme.colors.textFaint} />
                    <Text variant="caption" style={{ marginLeft: 6, flex: 1 }}>
                        {nombreFinca ? `Los registros de animal se guardarán en ${nombreFinca}.` : 'Necesaria para registrar animales.'}
                    </Text>
                </View>
            </Card>

            <SectionTitle title="Accesos" icon="grid-outline" />
            <View style={[styles.grid, { gap }]}>
                {tiles.map(({ key, ...t }) => <Tile key={key} width={tileWidth} {...t} />)}
            </View>

            <SectionTitle title="Copia de seguridad" subtitle="Exporta o restaura todos los datos en un archivo" icon="cloud-outline" />
            <Card>
                <View style={styles.backupRow}>
                    <Button title="Exportar" icon="cloud-upload-outline" variant="secondary" loading={isExporting} onPress={handleExportDB} style={{ flex: 1 }} />
                    <Button title="Importar" icon="cloud-download-outline" variant="secondary" loading={isImporting} onPress={handleImportDB} style={{ flex: 1 }} />
                </View>
                <Text variant="caption" style={{ marginTop: 10 }}>Importar reemplaza fincas, animales, historial, enfermedades y perfil.</Text>
            </Card>
        </Screen>
    )
}

const styles = StyleSheet.create({
    brand: { flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'center', paddingBottom: 14 },
    brandMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    selectorCard: { marginTop: 4 },
    selectorHint: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    tile: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.lg,
        padding: 16,
        minHeight: 140,
        ...theme.shadow.card,
    },
    tileDisabled: { opacity: 0.55 },
    tileIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    tileTitle: { marginBottom: 2 },
    tileChevron: { position: 'absolute', top: 16, right: 14 },
    backupRow: { flexDirection: 'row', gap: 12 },
})
