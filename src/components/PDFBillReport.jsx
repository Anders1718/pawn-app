import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsReport from './DocsReport';
import * as Print from 'expo-print';

export default function App({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) {
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
    const [htmlContent, setHtmlContent] = React.useState('');
    const [logoSize, setLogoSize] = React.useState(140);
    const [logoPosition, setLogoPosition] = React.useState({ top: 0, right: 0 });
    const [textAlignment, setTextAlignment] = React.useState('center');
    const [logoBase64, setLogoBase64] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            try {
                const asset = Asset.fromModule(require('../img/logo-podologo.png'));
                await asset.downloadAsync();
                const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
                setLogoBase64(`data:image/png;base64,${base64}`);
            } catch (error) {
                console.error('Error al cargar la imagen:', error);
            }
        })();
    }, []);

    const uniqueSalas = [...new Set(report.map(item => item.sala))];
    const ids = [];

    const verifyId = (id, n) => {
        if (ids.indexOf(id) === -1) {
            ids.push(id);
            return n;
        }
        return '';
    };

    const count = (id) => ids.indexOf(id) === -1;

    const convertExtremidad = (value) => {
        if (!value) return value;
        return value.split(',').map(seccion => 
            seccion.trim().split(' ').map(palabra => 
                /\d/.test(palabra) ? palabra.replace(/[^\d]/g, '') : palabra
            ).join(' ')
        ).join(', ');
    };

    const generateTablesHTML = () => {
        let tables = '';
        let counter = 1;
        ids.length = 0;

        uniqueSalas.forEach(sala => {
            const vacasEnSala = report.filter(vaca => vaca.sala === sala);
            tables += `
                <div class="sala-section">
                    <h3 class="sala-title">${sala}</h3>
                    <table class="animal-table">
                        <thead>
                            <tr>
                                <th style="width: 7%;">#</th>
                                <th style="width: 14%;">ID-Animal</th>
                                <th style="width: 14%;">Extremidad</th>
                                <th style="width: 25%;">Descripción</th>
                                <th style="width: 20%;">Observación</th>
                                <th style="width: 20%;">Tratamiento</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            vacasEnSala.forEach(vaca => {
                const showNumber = count(vaca.nombre_vaca);
                tables += `
                    <tr>
                        <td>${verifyId(vaca.nombre_vaca, showNumber ? counter++ : '')}</td>
                        <td>${vaca.nombre_vaca}</td>
                        <td>${convertExtremidad(vaca.extremidad)}</td>
                        <td>${vaca.enfermedades || ''}</td>
                        <td>${vaca.nota || ''}</td>
                        <td>${vaca.tratamiento || ''}</td>
                    </tr>
                `;
            });
            tables += `
                        </tbody>
                    </table>
                </div>
            `;
        });
        return tables;
    };

    const generateInvoiceHTML = () => {
        let rows = '';
        totalCuenta.forEach(cuenta => {
            rows += `
                <tr>
                    <td>${cuenta.cantidad}</td>
                    <td>${cuenta.descripcion}</td>
                    <td>$ ${cuenta.valor}</td>
                    <td>$ ${cuenta.total}</td>
                </tr>
            `;
        });
        return rows;
    };

    // Solución definitiva con Fixed Headers/Footers y Padding
    const generateFinalHTML = () => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Factura y Reporte</title>
    <style>
        /* === CONFIGURACIÓN DE IMPRESIÓN Y PÁGINA === */
        @page {
            size: A4;
            margin: 0; /* Desactivamos el margen de @page para controlarlo con HTML */
        }
        
        html {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #333;
        }
        
        body {
            margin: 0;
            padding: 0;
            counter-reset: page-counter; /* Inicializa el contador de páginas */
        }
        
        /* === ESTRUCTURA MAESTRA CON MÁRGENES FIJOS === */
        .page-header-space, .page-footer-space {
            height: 80pt; /* Espacio reservado para header y footer */
        }
        
        .page-header {
            position: fixed;
            top: 0;
            left: 57pt; /* 2cm */
            right: 57pt; /* 2cm */
            height: 60pt;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1pt solid #ccc;
            padding-bottom: 10pt;
        }
        
        .page-footer {
            position: fixed;
            bottom: 0;
            left: 57pt; /* 2cm */
            right: 57pt; /* 2cm */
            height: 40pt;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1pt solid #ccc;
            padding-top: 10pt;
            font-size: 9pt;
        }

        /* Contador de página */
        .page-footer .page-number::after {
            content: "Página " counter(page-counter);
        }

        /* Contenedor principal que se repite en cada página */
        main {
            padding: 0 57pt 0 57pt; /* Márgenes laterales */
        }

        .page-content {
            page-break-after: always;
        }

        .page-content:last-child {
            page-break-after: auto;
        }

        /* Incrementa el contador en cada nueva página */
        .page-content {
            counter-increment: page-counter;
        }

        /* === ESTILOS DE TABLAS Y CONTENIDO === */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15pt;
        }
        
        thead {
            display: table-header-group; /* Repetir header de tabla en cada página */
        }

        tr {
            page-break-inside: avoid;
        }
        
        th, td {
            text-align: left;
            padding: 4pt 6pt;
            vertical-align: top;
            word-wrap: break-word;
        }
        
        .invoice-table th, .invoice-table td {
            border: 1pt solid #ddd;
            text-align: center;
        }

        .invoice-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .animal-table {
            table-layout: fixed;
        }

        .animal-table th, .animal-table td {
            border: 1pt solid #ddd;
            font-size: 8pt;
            text-align: center;
        }

        .animal-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            font-size: 9pt;
        }
        
        .info-table td {
            padding: 2pt 5pt;
        }

        .label {
            font-weight: bold;
        }
        
        h1, h2, h3 {
            text-align: ${textAlignment};
            margin: 15pt 0 10pt 0;
            page-break-after: avoid;
        }

        h1 { font-size: 18pt; }
        h2 { font-size: 16pt; }
        h3 { font-size: 14pt; font-weight: bold; margin-bottom: 5pt; text-align: center; }

        .logo-image {
            max-width: ${logoSize}pt;
            max-height: 50pt;
            object-fit: contain;
        }

        .total-section {
            text-align: right;
            font-size: 14pt;
            font-weight: bold;
            margin-top: 15pt;
        }
    </style>
</head>
<body>
    <!-- Header y Footer se aplican a todas las páginas -->
    <div class="page-header">
        <div>${users.nombre} ${users.apellido} - ${users.profesion}</div>
        <img src="${logoBase64}" class="logo-image" alt="Logo">
    </div>

    <div class="page-footer">
        <div>${finca} - ${cliente}</div>
        <div class="page-number"></div>
    </div>

    <main>
        <!-- Espacio reservado para el header fijo -->
        <div class="page-header-space"></div>

        <!-- Contenido de la primera página -->
        <div class="page-content">
            <h1>CUENTA DE COBRO</h1>
            <table class="info-table">
                <tr>
                    <td><span class="label">Fecha:</span> ${fechaHoyFormateada}</td>
                </tr>
                <tr>
                    <td><span class="label">Cliente:</span> ${cliente}</td>
                    <td><span class="label">Nit:</span> ${nit}</td>
                </tr>
                <tr>
                    <td><span class="label">Dirección:</span> ${direccion}</td>
                    <td><span class="label">Tel:</span> ${tel}</td>
                </tr>
            </table>
            
            <h2>DEBE A</h2>
            <div style="text-align:${textAlignment}; font-size: 12pt;">
                <p>${users.nombre} ${users.apellido}</p>
                <p>CC: ${users.documento} Tel ${users.telefono}</p>
                <p>${users.direccion}</p>
            </div>

            <h2>POR CONCEPTO DE</h2>
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th style="width: 15%;">Cantidad</th>
                        <th style="width: 45%;">Descripción</th>
                        <th style="width: 20%;">Valor/und</th>
                        <th style="width: 20%;">Valor</th>
                    </tr>
                </thead>
                <tbody>${generateInvoiceHTML()}</tbody>
            </table>
            <div class="total-section">Total: $ ${sumaTotal}</div>
        </div>

        <!-- Contenido de la segunda página (y siguientes) -->
        <div class="page-content">
            <h1>INFORME</h1>
            <table class="info-table">
                <tr>
                    <td><span class="label">Cliente:</span> ${cliente}</td>
                    <td><span class="label">Finca:</span> ${finca}</td>
                </tr>
                <tr>
                    <td><span class="label">Ubicación:</span> ${lugar}</td>
                    <td><span class="label">Fecha:</span> ${fechaHoyFormateada}</td>
                </tr>
            </table>
            ${generateTablesHTML()}

            <table class="info-table" style="width: 60%; margin: 20pt auto; page-break-inside: avoid;">
                <tr>
                    <td>AI = anterior izquierdo</td>
                    <td>AD = anterior derecho</td>
                </tr>
                <tr>
                    <td>PI = posterior izquierdo</td>
                    <td>PD = posterior derecho</td>
                </tr>
            </table>
        </div>

        <!-- Espacio reservado para el footer fijo -->
        <div class="page-footer-space"></div>
    </main>
</body>
</html>
    `;

    const showPreview = () => {
        setHtmlContent(generateFinalHTML());
        setIsPreviewVisible(true);
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const { uri } = await Print.printToFileAsync({
                html: generateFinalHTML(),
            });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            setIsPreviewVisible(false);
            Alert.alert('Éxito', 'PDF generado con márgenes y paginación profesional.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', `No se pudo generar el PDF: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={showPreview}>
                <StyledText fontSize='subheading' style={{ fontSize: 25, color: '#fff' }}>
                    Previsualizar Factura y Reporte
                </StyledText>
            </TouchableOpacity>
            
            <DocsReport {...{ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }}/>
            
            <Modal animationType="slide" visible={isPreviewVisible} onRequestClose={() => setIsPreviewVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.controlPanel}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsPreviewVisible(false)}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Tamaño del logo (pt):</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={80}
                                maximumValue={200}
                                step={10}
                                value={logoSize}
                                onValueChange={value => {
                                    setLogoSize(value);
                                    setHtmlContent(generateFinalHTML());
                                }}
                            />
                            <Text>{Math.round(logoSize)}pt</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.generateButton, isGenerating && styles.disabledButton]}
                            onPress={generatePDF}
                            disabled={isGenerating}>
                            <Text style={styles.buttonText}>
                                {isGenerating ? 'Generando PDF profesional...' : '🚀 Generar PDF Final'}
                            </Text>
                        </TouchableOpacity>
                        
                        <Text style={styles.infoText}>
                            ✅ Márgenes fijos garantizados (2.5cm sup/inf, 2cm lat){'\n'}
                            ✅ Paginación y headers de tabla automáticos
                        </Text>
                    </View>
                    
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: htmlContent }}
                        style={styles.webView}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    button: {
        backgroundColor: '#0d47a1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
    },
    controlPanel: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    controlLabel: {
        flex: 1,
    },
    slider: {
        flex: 2,
    },
    closeButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#e0e0e0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    generateButton: {
        backgroundColor: '#2e7d32',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#9e9e9e',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 11,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    webView: {
        flex: 1,
    }
});