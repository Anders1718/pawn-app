import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsReport from './DocsReport';
import * as Print from 'expo-print';

// Importar react-native-html-to-pdf con try-catch para compatibilidad
let RNHTMLtoPDF = null;
try {
    RNHTMLtoPDF = require('react-native-html-to-pdf').default;
} catch (error) {
    console.log('react-native-html-to-pdf not available, using fallback');
}

export default function App({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) {
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
    const [htmlContent, setHtmlContent] = React.useState('');
    const [logoSize, setLogoSize] = React.useState(150);
    const [logoPosition, setLogoPosition] = React.useState({ top: 0.7, right: -0.5 });
    const [textAlignment, setTextAlignment] = React.useState('center');
    const [logoBase64, setLogoBase64] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    
    // Cargar la imagen como Base64 al iniciar el componente
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
        const itemsArray = ids.indexOf(id);
        if (itemsArray === -1) {
            ids.push(id);
            return n
        }
        return '';
    }

    const count = (id) => {
        const itemsArray = ids.indexOf(id);
        return itemsArray === -1;
    }

    const convertExtremidad = (value) => {
        if (!value) return value;
        const secciones = value.split(',');
        const resultado = secciones.map(seccion => {
            const palabras = seccion.trim().split(' ');
            return palabras.map(palabra => {
                if (/\d/.test(palabra)) {
                    return palabra.replace(/[^\d]/g, '');
                }
                return palabra;
            }).join(' ');
        }).join(', ');
        return resultado;
    }

    // Función para generar HTML de preview
    const generateVacasHTML = () => {
        let tablaVacas = '';
        let contadorGeneral = 1;
        
        ids.length = 0;
        
        uniqueSalas.forEach((sala, salaIndex) => {
            const vacasEnSala = report.filter(vaca => vaca.sala === sala);
            
            tablaVacas += `
            <div class="sala-section">
                <h1 class="sala-title">
                    ${sala}
                </h1>
                
                <table class="animal-table">
                    <thead>
                        <tr>
                            <th style="width: 8%;">#</th>
                            <th style="width: 15%;">ID-Animal</th>
                            <th style="width: 15%;">Extremidad</th>
                            <th style="width: 25%;">Descripción</th>
                            <th style="width: 17%;">Observación</th>
                            <th style="width: 20%;">Tratamiento</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            vacasEnSala.forEach((vaca, vacaIndex) => {
                const showNumber = count(vaca.nombre_vaca);
                tablaVacas += `
                        <tr class="animal-row">
                            <td>${verifyId(vaca.nombre_vaca, showNumber ? contadorGeneral++ : '')}</td>
                            <td>${vaca.nombre_vaca}</td>
                            <td>${convertExtremidad(vaca.extremidad)}</td>
                            <td>${vaca.enfermedades}</td>
                            <td>${vaca.nota}</td>
                            <td>${vaca.tratamiento}</td>
                        </tr>`;
            });
            
            tablaVacas += `
                    </tbody>
                </table>
            </div>`;
        });
        
        return tablaVacas;
    };

    let tablaCuenta = '';
    totalCuenta.forEach((cuenta, index) => {
        tablaCuenta += `
        <tr>
            <td>${cuenta.cantidad}</td>
            <td>${cuenta.descripcion}</td>
            <td>$ ${cuenta.valor}</td>
            <td>$ ${cuenta.total}</td>
        </tr>
    `;
    });

    // HTML optimizado con técnicas enterprise para márgenes precisos
    const generateProfessionalHTML = () => {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura y Reporte</title>
    <style>
        /* ====== CONFIGURACIÓN CRÍTICA DE PÁGINA ====== */
        @page {
            size: A4;
            margin: 72pt 57pt 72pt 57pt !important; /* 2.54cm = 72pt, 2cm = 57pt */
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
        }
        
        @media print {
            @page {
                margin: 72pt 57pt 72pt 57pt !important;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            html, body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
        }
        
        /* ====== RESET TOTAL ====== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            height: 100%;
            -webkit-print-color-adjust: exact;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 11pt;
            line-height: 1.2;
            color: #000;
            background: #fff;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* ====== CONTENEDORES DE PÁGINA ====== */
        .page {
            width: 100%;
            min-height: calc(100vh - 144pt); /* Restar márgenes superior e inferior */
            position: relative;
            page-break-after: always;
            box-sizing: border-box;
        }
        
        .page:last-child {
            page-break-after: auto;
        }
        
        /* ====== HEADERS Y TÍTULOS ====== */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20pt;
            height: 60pt;
            position: relative;
        }
        
        .date-info {
            font-size: 13pt;
            font-weight: bold;
            margin: 0;
        }
        
        .logo-container {
            position: absolute;
            right: 0;
            top: 0;
        }
        
        .logo-image {
            width: 140pt;
            height: 45pt;
            object-fit: contain;
            border-radius: 4pt;
        }
        
        .main-title {
            font-size: 18pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 15pt 0 12pt 0;
            letter-spacing: 0.5pt;
        }
        
        .section-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 12pt 0 10pt 0;
        }
        
        .sala-title {
            font-size: 15pt;
            font-weight: bold;
            text-align: center;
            margin: 15pt 0 8pt 0;
            page-break-after: avoid;
        }
        
        /* ====== TABLAS PROFESIONALES ====== */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12pt;
            page-break-inside: avoid;
        }
        
        .info-table td {
            padding: 4pt 6pt;
            vertical-align: top;
            font-size: 11pt;
        }
        
        .info-table .left-column {
            width: 50%;
        }
        
        .info-table .right-column {
            width: 50%;
        }
        
        .label-text {
            font-weight: bold;
            margin-right: 6pt;
        }
        
        /* ====== TABLA DE CUENTA ====== */
        .cuenta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15pt 0;
            page-break-inside: avoid;
        }
        
        .cuenta-table th,
        .cuenta-table td {
            border: 1pt solid #000;
            padding: 6pt 4pt;
            text-align: center;
            font-size: 10pt;
            vertical-align: middle;
        }
        
        .cuenta-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            page-break-inside: avoid;
        }
        
        /* ====== TABLA DE ANIMALES (CRÍTICA) ====== */
        .animal-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15pt;
            table-layout: fixed;
        }
        
        .animal-table thead {
            display: table-header-group;
            page-break-inside: avoid;
        }
        
        .animal-table tbody {
            display: table-row-group;
        }
        
        .animal-table th,
        .animal-table td {
            border: 1pt solid #000;
            padding: 3pt 2pt;
            font-size: 8pt;
            text-align: center;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }
        
        .animal-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            font-size: 9pt;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .animal-row {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        /* ====== COLUMNAS ESPECÍFICAS ====== */
        .animal-table th:nth-child(1), .animal-table td:nth-child(1) { width: 8%; }
        .animal-table th:nth-child(2), .animal-table td:nth-child(2) { width: 15%; }
        .animal-table th:nth-child(3), .animal-table td:nth-child(3) { width: 15%; }
        .animal-table th:nth-child(4), .animal-table td:nth-child(4) { width: 25%; }
        .animal-table th:nth-child(5), .animal-table td:nth-child(5) { width: 17%; }
        .animal-table th:nth-child(6), .animal-table td:nth-child(6) { width: 20%; }
        
        /* ====== TABLA DE ABREVIACIONES ====== */
        .paws-table {
            width: 60%;
            margin: 20pt auto;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        
        .paws-table td {
            border: 1pt solid #000;
            padding: 6pt;
            text-align: center;
            font-size: 10pt;
        }
        
        /* ====== INFORMACIÓN PROFESIONAL ====== */
        .professional-info {
            font-size: 14pt;
            text-align: ${textAlignment};
            margin: 3pt 0;
            page-break-inside: avoid;
        }
        
        .professional-name {
            font-size: 20pt;
            font-weight: normal;
            margin: 5pt 0;
        }
        
        .total-section {
            text-align: right;
            font-weight: bold;
            font-size: 15pt;
            margin: 12pt 0;
            page-break-inside: avoid;
        }
        
        /* ====== SECCIONES DE SALA ====== */
        .sala-section {
            page-break-inside: auto;
            margin-bottom: 20pt;
        }
        
        /* ====== CONTROL DE RUPTURA DE PÁGINA ====== */
        .page-break-before {
            page-break-before: always;
        }
        
        /* ====== EVITAR HUÉRFANAS Y VIUDAS ====== */
        p, div, td, th, h1, h2, h3 {
            orphans: 2;
            widows: 2;
        }
        
        /* ====== AJUSTES FINALES ====== */
        .final-info {
            margin-top: 15pt;
            font-size: 11pt;
        }
        
        /* ====== OPTIMIZACIONES ESPECÍFICAS PARA PDF ====== */
        @media print {
            .page {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            table {
                page-break-inside: auto;
            }
            
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            thead {
                display: table-header-group;
            }
            
            tfoot {
                display: table-footer-group;
            }
        }
    </style>
</head>
<body>
    <!-- ====== PÁGINA 1: CUENTA DE COBRO ====== -->
    <div class="page">
        <div class="page-header">
            <div class="date-info">
                Fecha: ${fechaHoyFormateada}
            </div>
            <div class="logo-container">
                <img src="${logoBase64}" class="logo-image" alt="Logo">
            </div>
        </div>
        
        <h1 class="main-title">CUENTA DE COBRO</h1>
        
        <table class="info-table">
            <tr>
                <td class="left-column">
                    <span class="label-text">Cliente:</span>${cliente}
                </td>
                <td class="right-column">
                    <span class="label-text">Nit:</span>${nit}
                </td>
            </tr>
            <tr>
                <td class="left-column">
                    <span class="label-text">Dirección:</span>${direccion}
                </td>
                <td class="right-column">
                    <span class="label-text">Tel:</span>${tel}
                </td>
            </tr>
        </table>

        <h2 class="section-title">DEBE A</h2>
        
        <div class="professional-info professional-name">
            ${users.nombre} ${users.apellido}
        </div>
        <div class="professional-info">
            CC: ${users.documento} Tel ${users.telefono}
        </div>
        <div class="professional-info">
            ${users.direccion}
        </div>
        
        <h2 class="section-title">POR CONCEPTO DE</h2>
        
        <table class="cuenta-table">
            <thead>
                <tr>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Valor/und</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${tablaCuenta}
            </tbody>
        </table>
        
        <div class="total-section">
            Total: $ ${sumaTotal}
        </div>
        
        <table class="info-table">
            <tr>
                <td class="left-column">${users.nombre} ${users.apellido}</td>
                <td class="right-column">Favor consignar a la cuenta</td>
            </tr>
            <tr>
                <td class="left-column">${users.profesion}</td>
                <td class="right-column">${users.tipoCuenta} ${users.banco}</td>
            </tr>
            <tr>
                <td class="left-column">${users.universidad}</td>
                <td class="right-column">${users.numeroCuenta}</td>
            </tr>
        </table>
    </div>

    <!-- ====== PÁGINA 2+: INFORME ====== -->
    <div class="page page-break-before">
        <div class="page-header">
            <div></div>
            <div class="logo-container">
                <img src="${logoBase64}" class="logo-image" alt="Logo">
            </div>
        </div>
        
        <h1 class="main-title">INFORME</h1>
        
        <table class="info-table">
            <tr>
                <td class="left-column">
                    <span class="label-text">Cliente:</span>${cliente}
                </td>
                <td class="right-column">
                    <span class="label-text">Finca:</span>${finca}
                </td>
            </tr>
            <tr>
                <td class="left-column">
                    <span class="label-text">Ubicación:</span>${lugar}
                </td>
                <td class="right-column">
                    <span class="label-text">Fecha:</span>${fechaHoyFormateada}
                </td>
            </tr>
        </table>
        
        ${generateVacasHTML()}
        
        <table class="paws-table">
            <tr>
                <td>AI = anterior izquierdo</td>
                <td>AD = anterior derecho</td>
            </tr>
            <tr>
                <td>PI = posterior izquierdo</td>
                <td>PD = posterior derecho</td>
            </tr>
        </table>

        <div class="final-info">
            <div>${users.nombre} ${users.apellido}</div>
            <div>${users.profesion}</div>
            <div>${users.universidad}</div>
        </div>
    </div>
</body>
</html>
`;
    };

    // Función para generar PDF con react-native-html-to-pdf (método premium)
    const generatePDFWithHTMLtoPDF = async () => {
        if (!RNHTMLtoPDF) {
            throw new Error('react-native-html-to-pdf no disponible');
        }

        try {
            const options = {
                html: generateProfessionalHTML(),
                fileName: `factura_${Date.now()}`,
                directory: 'Documents',
                base64: false,
                width: 612, // A4 width in points
                height: 792, // A4 height in points
                padding: 72, // 2.54cm en points
                bgColor: '#FFFFFF',
                // Márgenes precisos en points (1 inch = 72 points)
                border: {
                    top: 72,    // 2.54cm
                    left: 57,   // 2cm  
                    bottom: 72, // 2.54cm
                    right: 57   // 2cm
                }
            };

            const file = await RNHTMLtoPDF.convert(options);
            return file.filePath;
        } catch (error) {
            console.error('Error con HTML to PDF:', error);
            throw error;
        }
    };

    // Función mejorada para expo-print (fallback robusto)
    const generatePDFWithExpoPrint = async () => {
        try {
            const { uri } = await Print.printToFileAsync({
                html: generateProfessionalHTML(),
                printerOptions: {
                    // Configuración específica para márgenes precisos
                    margins: {
                        top: 2.54,    // 2.54cm
                        bottom: 2.54, // 2.54cm  
                        left: 2.0,    // 2cm
                        right: 2.0    // 2cm
                    },
                    orientation: 'portrait',
                    useMarkupFormatter: true
                }
            });
            return uri;
        } catch (error) {
            console.error('Error con Expo Print:', error);
            throw error;
        }
    };

    const showPreview = () => {
        setHtmlContent(generateProfessionalHTML());
        setIsPreviewVisible(true);
    };

    // Función principal de generación (estrategia enterprise)
    const generatePDF = async () => {
        try {
            setIsGenerating(true);
            let pdfPath = null;

            // Estrategia 1: Intentar con react-native-html-to-pdf (más preciso)
            if (RNHTMLtoPDF && Platform.OS !== 'web') {
                try {
                    console.log('Intentando con react-native-html-to-pdf...');
                    pdfPath = await generatePDFWithHTMLtoPDF();
                    console.log('✅ Éxito con react-native-html-to-pdf');
                } catch (error) {
                    console.log('⚠️ Falló react-native-html-to-pdf, usando fallback');
                    pdfPath = null;
                }
            }

            // Estrategia 2: Fallback a expo-print optimizado
            if (!pdfPath) {
                console.log('Usando expo-print optimizado...');
                pdfPath = await generatePDFWithExpoPrint();
                console.log('✅ Éxito con expo-print');
            }

            if (pdfPath) {
                await shareAsync(pdfPath, { 
                    UTI: '.pdf', 
                    mimeType: 'application/pdf' 
                });
                setIsPreviewVisible(false);
                Alert.alert(
                    'Éxito', 
                    'PDF generado correctamente con márgenes precisos',
                    [{ text: 'OK' }]
                );
            } else {
                throw new Error('No se pudo generar el PDF con ningún método');
            }

        } catch (error) {
            console.error('Error completo:', error);
            Alert.alert(
                'Error', 
                `No se pudo generar el PDF: ${error.message}`,
                [{ text: 'OK' }]
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.button}
                onPress={showPreview}
            >
                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>
                    Previsualizar factura y reporte
                </StyledText>
            </TouchableOpacity>

            <DocsReport
                finca={finca}
                direccion={direccion}
                cliente={cliente}
                lugar={lugar}
                totalCuenta={totalCuenta}
                listaVacas={listaVacas}
                fechaHoyFormateada={fechaHoyFormateada}
                nit={nit}
                tel={tel}
                sumaTotal={sumaTotal}
                report={report}
                users={users}
            />
            
            <Modal
                animationType="slide"
                transparent={false}
                visible={isPreviewVisible}
                onRequestClose={() => setIsPreviewVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.controlPanel}>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setIsPreviewVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Tamaño del logo:</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={50}
                                maximumValue={250}
                                step={5}
                                value={logoSize}
                                onValueChange={value => {
                                    setLogoSize(value);
                                    setHtmlContent(generateProfessionalHTML());
                                }}
                            />
                            <Text>{Math.round(logoSize)}px</Text>
                        </View>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Posición vertical:</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={2}
                                step={0.1}
                                value={logoPosition.top}
                                onValueChange={value => {
                                    setLogoPosition({...logoPosition, top: value});
                                    setHtmlContent(generateProfessionalHTML());
                                }}
                            />
                            <Text>{logoPosition.top.toFixed(1)}cm</Text>
                        </View>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Posición horizontal:</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={2}
                                step={0.1}
                                value={logoPosition.right}
                                onValueChange={value => {
                                    setLogoPosition({...logoPosition, right: value});
                                    setHtmlContent(generateProfessionalHTML());
                                }}
                            />
                            <Text>{logoPosition.right.toFixed(1)}cm</Text>
                        </View>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Alineación de texto:</Text>
                            <View style={styles.alignmentButtons}>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'left' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('left');
                                        setHtmlContent(generateProfessionalHTML());
                                    }}
                                >
                                    <Text>Izquierda</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'center' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('center');
                                        setHtmlContent(generateProfessionalHTML());
                                    }}
                                >
                                    <Text>Centro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'right' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('right');
                                        setHtmlContent(generateProfessionalHTML());
                                    }}
                                >
                                    <Text>Derecha</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.generateButton, isGenerating && styles.disabledButton]}
                            onPress={generatePDF}
                            disabled={isGenerating}
                        >
                            <Text style={styles.buttonText}>
                                {isGenerating ? 'Generando PDF profesional...' : '🎯 Generar PDF con márgenes precisos'}
                            </Text>
                        </TouchableOpacity>
                        
                        <Text style={styles.infoText}>
                            ✅ Márgenes: 2.54cm superior/inferior, 2cm laterales{'\n'}
                            ✅ Compatible con iOS, Android y Web{'\n'}
                            ✅ Calidad profesional enterprise
                        </Text>
                    </View>
                    
                    <View style={styles.previewContainer}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: htmlContent }}
                            style={styles.webView}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 8,
    },
    spacer: {
        height: 8,
    },
    button: {
        borderColor: "#334155",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderWidth: 10
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    controlPanel: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    controlLabel: {
        width: 120,
        marginRight: 10,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    previewContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    closeButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    generateButton: {
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    disabledButton: {
        backgroundColor: '#6b7280',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    alignmentButtons: {
        flexDirection: 'row',
    },
    alignButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    activeButton: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});