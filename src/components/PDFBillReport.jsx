import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsReport from './DocsReport';
import * as Print from 'expo-print';

// Importar React PDF
import { 
    Document, 
    Page, 
    Text as PDFText, 
    View as PDFView, 
    StyleSheet as PDFStyleSheet,
    Image as PDFImage,
    pdf,
    Font
} from '@react-pdf/renderer';

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

    // Estilos para React PDF con márgenes precisos
    const pdfStyles = PDFStyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            padding: '2.5cm 2cm 2.5cm 2cm', // Top, Right, Bottom, Left margins
            fontFamily: 'Helvetica',
            fontSize: 12,
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        title: {
            fontSize: 18,
            marginBottom: 20,
            textAlign: textAlignment,
            fontWeight: 'bold'
        },
        subtitle: {
            fontSize: 16,
            marginBottom: 15,
            textAlign: textAlignment,
            fontWeight: 'bold'
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            alignItems: 'flex-start'
        },
        dateInfo: {
            fontSize: 14,
            fontWeight: 'bold'
        },
        logo: {
            width: 150,
            height: 50,
            borderRadius: 5
        },
        infoTable: {
            flexDirection: 'row',
            marginBottom: 15,
        },
        infoColumn: {
            flex: 1,
            paddingRight: 20
        },
        infoRow: {
            flexDirection: 'row',
            marginBottom: 5
        },
        infoLabel: {
            fontWeight: 'bold',
            marginRight: 5
        },
        professionalInfo: {
            textAlign: textAlignment,
            marginVertical: 3,
            fontSize: 14
        },
        professionalName: {
            fontSize: 20,
            fontWeight: 'normal'
        },
        table: {
            display: 'table',
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            marginVertical: 10
        },
        tableRow: {
            margin: 'auto',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            minHeight: 25
        },
        tableHeader: {
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold'
        },
        tableCol: {
            borderStyle: 'solid',
            borderRightWidth: 1,
            borderColor: '#000',
            padding: 5,
            justifyContent: 'center',
            fontSize: 10
        },
        tableCell: {
            textAlign: 'center',
            fontSize: 9,
            paddingHorizontal: 3
        },
        totalSection: {
            textAlign: 'right',
            fontSize: 16,
            fontWeight: 'bold',
            marginVertical: 15
        },
        salaTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 15,
            paddingTop: 10
        },
        pawsTable: {
            width: '60%',
            alignSelf: 'center',
            marginVertical: 20
        },
        finalInfo: {
            marginTop: 20,
            fontSize: 12
        }
    });

    // Componente PDF usando React PDF
    const PDFDocument = () => {
        // Reset IDs for each generation
        ids.length = 0;
        let contadorGeneral = 1;

        return (
            <Document>
                {/* PÁGINA 1: CUENTA DE COBRO */}
                <Page size="A4" style={pdfStyles.page}>
                    <PDFView style={pdfStyles.header}>
                        <PDFText style={pdfStyles.dateInfo}>
                            Fecha: {fechaHoyFormateada}
                        </PDFText>
                        {logoBase64 && (
                            <PDFImage 
                                style={pdfStyles.logo} 
                                src={logoBase64}
                            />
                        )}
                    </PDFView>
                    
                    <PDFText style={pdfStyles.title}>
                        CUENTA DE COBRO
                    </PDFText>
                    
                    <PDFView style={pdfStyles.infoTable}>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Cliente:</PDFText>
                                <PDFText>{cliente}</PDFText>
                            </PDFView>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Dirección:</PDFText>
                                <PDFText>{direccion}</PDFText>
                            </PDFView>
                        </PDFView>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Nit:</PDFText>
                                <PDFText>{nit}</PDFText>
                            </PDFView>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Tel:</PDFText>
                                <PDFText>{tel}</PDFText>
                            </PDFView>
                        </PDFView>
                    </PDFView>

                    <PDFText style={pdfStyles.subtitle}>
                        DEBE A
                    </PDFText>
                    
                    <PDFText style={[pdfStyles.professionalInfo, pdfStyles.professionalName]}>
                        {users.nombre} {users.apellido}
                    </PDFText>
                    <PDFText style={pdfStyles.professionalInfo}>
                        CC: {users.documento} Tel {users.telefono}
                    </PDFText>
                    <PDFText style={pdfStyles.professionalInfo}>
                        {users.direccion}
                    </PDFText>
                    
                    <PDFText style={pdfStyles.subtitle}>
                        POR CONCEPTO DE
                    </PDFText>
                    
                    {/* Tabla de cuenta */}
                    <PDFView style={pdfStyles.table}>
                        <PDFView style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                            <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                <PDFText style={pdfStyles.tableCell}>Cantidad</PDFText>
                            </PDFView>
                            <PDFView style={[pdfStyles.tableCol, { width: '40%' }]}>
                                <PDFText style={pdfStyles.tableCell}>Descripción</PDFText>
                            </PDFView>
                            <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                <PDFText style={pdfStyles.tableCell}>Valor/und</PDFText>
                            </PDFView>
                            <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                <PDFText style={pdfStyles.tableCell}>Valor</PDFText>
                            </PDFView>
                        </PDFView>
                        
                        {totalCuenta.map((cuenta, index) => (
                            <PDFView style={pdfStyles.tableRow} key={index}>
                                <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                    <PDFText style={pdfStyles.tableCell}>{cuenta.cantidad}</PDFText>
                                </PDFView>
                                <PDFView style={[pdfStyles.tableCol, { width: '40%' }]}>
                                    <PDFText style={pdfStyles.tableCell}>{cuenta.descripcion}</PDFText>
                                </PDFView>
                                <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                    <PDFText style={pdfStyles.tableCell}>$ {cuenta.valor}</PDFText>
                                </PDFView>
                                <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                    <PDFText style={pdfStyles.tableCell}>$ {cuenta.total}</PDFText>
                                </PDFView>
                            </PDFView>
                        ))}
                    </PDFView>
                    
                    <PDFText style={pdfStyles.totalSection}>
                        Total: $ {sumaTotal}
                    </PDFText>
                    
                    <PDFView style={pdfStyles.infoTable}>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFText>{users.nombre} {users.apellido}</PDFText>
                            <PDFText>{users.profesion}</PDFText>
                            <PDFText>{users.universidad}</PDFText>
                        </PDFView>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFText>Favor consignar a la cuenta</PDFText>
                            <PDFText>{users.tipoCuenta} {users.banco}</PDFText>
                            <PDFText>{users.numeroCuenta}</PDFText>
                        </PDFView>
                    </PDFView>
                </Page>

                {/* PÁGINA 2+: INFORME */}
                <Page size="A4" style={pdfStyles.page} wrap>
                    {logoBase64 && (
                        <PDFView style={pdfStyles.header}>
                            <PDFView></PDFView>
                            <PDFImage 
                                style={pdfStyles.logo} 
                                src={logoBase64}
                            />
                        </PDFView>
                    )}
                    
                    <PDFText style={pdfStyles.title}>
                        INFORME
                    </PDFText>
                    
                    <PDFView style={pdfStyles.infoTable}>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Cliente:</PDFText>
                                <PDFText>{cliente}</PDFText>
                            </PDFView>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Ubicación:</PDFText>
                                <PDFText>{lugar}</PDFText>
                            </PDFView>
                        </PDFView>
                        <PDFView style={pdfStyles.infoColumn}>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Finca:</PDFText>
                                <PDFText>{finca}</PDFText>
                            </PDFView>
                            <PDFView style={pdfStyles.infoRow}>
                                <PDFText style={pdfStyles.infoLabel}>Fecha:</PDFText>
                                <PDFText>{fechaHoyFormateada}</PDFText>
                            </PDFView>
                        </PDFView>
                    </PDFView>

                    {/* Tablas de vacas por sala */}
                    {uniqueSalas.map((sala, salaIndex) => {
                        const vacasEnSala = report.filter(vaca => vaca.sala === sala);
                        
                        return (
                            <PDFView key={salaIndex} wrap={false}>
                                <PDFText style={pdfStyles.salaTitle}>
                                    {sala}
                                </PDFText>
                                
                                <PDFView style={pdfStyles.table}>
                                    <PDFView style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                                        <PDFView style={[pdfStyles.tableCol, { width: '8%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>#</PDFText>
                                        </PDFView>
                                        <PDFView style={[pdfStyles.tableCol, { width: '15%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>ID-Animal</PDFText>
                                        </PDFView>
                                        <PDFView style={[pdfStyles.tableCol, { width: '15%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>Extremidad</PDFText>
                                        </PDFView>
                                        <PDFView style={[pdfStyles.tableCol, { width: '25%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>Descripción</PDFText>
                                        </PDFView>
                                        <PDFView style={[pdfStyles.tableCol, { width: '17%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>Observación</PDFText>
                                        </PDFView>
                                        <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                            <PDFText style={pdfStyles.tableCell}>Tratamiento</PDFText>
                                        </PDFView>
                                    </PDFView>
                                    
                                    {vacasEnSala.map((vaca, vacaIndex) => {
                                        const showNumber = count(vaca.nombre_vaca);
                                        const numero = verifyId(vaca.nombre_vaca, showNumber ? contadorGeneral++ : '');
                                        
                                        return (
                                            <PDFView style={pdfStyles.tableRow} key={vacaIndex} wrap={false}>
                                                <PDFView style={[pdfStyles.tableCol, { width: '8%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{numero}</PDFText>
                                                </PDFView>
                                                <PDFView style={[pdfStyles.tableCol, { width: '15%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{vaca.nombre_vaca}</PDFText>
                                                </PDFView>
                                                <PDFView style={[pdfStyles.tableCol, { width: '15%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{convertExtremidad(vaca.extremidad)}</PDFText>
                                                </PDFView>
                                                <PDFView style={[pdfStyles.tableCol, { width: '25%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{vaca.enfermedades}</PDFText>
                                                </PDFView>
                                                <PDFView style={[pdfStyles.tableCol, { width: '17%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{vaca.nota}</PDFText>
                                                </PDFView>
                                                <PDFView style={[pdfStyles.tableCol, { width: '20%' }]}>
                                                    <PDFText style={pdfStyles.tableCell}>{vaca.tratamiento}</PDFText>
                                                </PDFView>
                                            </PDFView>
                                        );
                                    })}
                                </PDFView>
                            </PDFView>
                        );
                    })}
                    
                    {/* Tabla de abreviaciones */}
                    <PDFView style={[pdfStyles.table, pdfStyles.pawsTable]}>
                        <PDFView style={pdfStyles.tableRow}>
                            <PDFView style={[pdfStyles.tableCol, { width: '50%' }]}>
                                <PDFText style={pdfStyles.tableCell}>AI = anterior izquierdo</PDFText>
                            </PDFView>
                            <PDFView style={[pdfStyles.tableCol, { width: '50%' }]}>
                                <PDFText style={pdfStyles.tableCell}>AD = anterior derecho</PDFText>
                            </PDFView>
                        </PDFView>
                        <PDFView style={pdfStyles.tableRow}>
                            <PDFView style={[pdfStyles.tableCol, { width: '50%' }]}>
                                <PDFText style={pdfStyles.tableCell}>PI = posterior izquierdo</PDFText>
                            </PDFView>
                            <PDFView style={[pdfStyles.tableCol, { width: '50%' }]}>
                                <PDFText style={pdfStyles.tableCell}>PD = posterior derecho</PDFText>
                            </PDFView>
                        </PDFView>
                    </PDFView>

                    {/* Información del profesional */}
                    <PDFView style={pdfStyles.finalInfo}>
                        <PDFText>{users.nombre} {users.apellido}</PDFText>
                        <PDFText>{users.profesion}</PDFText>
                        <PDFText>{users.universidad}</PDFText>
                    </PDFView>
                </Page>
            </Document>
        );
    };

    // Función para generar PDF usando React PDF
    const generatePDFWithReactPDF = async () => {
        try {
            setIsGenerating(true);
            
            // Generar el PDF
            const pdfDoc = <PDFDocument />;
            const asPdf = pdf(pdfDoc);
            const blob = await asPdf.toBlob();
            
            // Convertir blob a base64 para React Native
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            
            return new Promise((resolve, reject) => {
                reader.onloadend = async () => {
                    try {
                        const base64data = reader.result;
                        const filename = `factura-${Date.now()}.pdf`;
                        const fileUri = `${FileSystem.documentDirectory}${filename}`;
                        
                        // Guardar el archivo
                        await FileSystem.writeAsStringAsync(fileUri, base64data.split(',')[1], {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        
                        setIsGenerating(false);
                        resolve(fileUri);
                    } catch (error) {
                        setIsGenerating(false);
                        reject(error);
                    }
                };
                reader.onerror = reject;
            });
            
        } catch (error) {
            setIsGenerating(false);
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'No se pudo generar el PDF: ' + error.message);
            return null;
        }
    };

    // Función para generar HTML de preview (manteniendo la funcionalidad existente)
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

    // Función mejorada para expo-print con márgenes precisos
    const generateHTMLWithPreciseMargins = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
        @page {
            size: A4;
            margin: 70.87pt 56.69pt 70.87pt 56.69pt !important; /* 2.5cm top/bottom, 2cm left/right in points */
        }
        
        @media print {
            @page {
                margin: 70.87pt 56.69pt 70.87pt 56.69pt !important;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: black;
            font-size: 12pt;
            line-height: 1.3;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .page-content {
            width: 100%;
            min-height: calc(100vh - 141.74pt); /* Subtract top and bottom margins */
            position: relative;
            page-break-after: auto;
        }
        
        .animal-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: auto;
        }
        
        .animal-table thead {
            display: table-header-group;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .animal-table tbody {
            display: table-row-group;
        }
        
        .animal-table th,
        .animal-table td {
            border: 1px solid black;
            padding: 6px 4px;
            text-align: center;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-size: 10pt;
        }
        
        .animal-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .animal-row {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        .sala-section {
            page-break-inside: auto;
            margin-bottom: 25px;
        }
        
        .sala-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 10px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .info-table td {
            padding: 4px 8px;
            vertical-align: top;
        }
        
        .info-table .left-column {
            text-align: left;
            width: 50%;
        }
        
        .info-table .right-column {
            text-align: left;
            width: 50%;
        }
        
        .cuenta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .cuenta-table th,
        .cuenta-table td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
            font-size: 11pt;
        }
        
        .cuenta-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        .paws-table {
            width: 60%;
            margin: 25px auto;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        
        .paws-table th, 
        .paws-table td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
            font-size: 11pt;
        }
        
        h1 {
            font-size: 17pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 15px 0 10px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        h2 {
            font-size: 15pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 12px 0 8px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .logo-container {
            position: absolute;
            top: -5px;
            right: ${logoPosition.right}cm;
            text-align: right;
            z-index: 10;
        }
        
        .logo-image {
            width: 180px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .header-container {
            position: relative;
            height: 70px;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .date-info {
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 14pt;
            font-weight: bold;
        }
        
        .client-info td {
            padding: 4px 2px;
        }
        
        .client-info .label-text {
            font-weight: bold;
            margin-right: 8px;
            display: inline-block;
        }
        
        .total-section {
            text-align: right;
            font-weight: bold;
            font-size: 16pt;
            margin: 12px 0;
            page-break-inside: avoid;
        }
        
        .page-break {
            page-break-before: always;
            padding-top: 0;
        }
        
        .main-title {
            font-size: 20pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 25px 0 15px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .section-title {
            font-size: 17pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 20px 0 12px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .professional-info {
            font-size: 15pt;
            text-align: ${textAlignment};
            margin: 4px 0;
            page-break-inside: avoid;
        }
        
        .professional-name {
            font-size: 22pt;
            font-weight: normal;
        }
        
        p, div, td, th {
            orphans: 2;
            widows: 2;
        }
        
        table {
            margin-left: 0;
            margin-right: 0;
        }
        
        /* Forzar márgenes en todas las páginas */
        .margin-enforcer {
            margin: 0 !important;
            padding: 0 !important;
        }
    </style>
</head>

<body class="margin-enforcer">
    <div class="page-content">
        <div class="header-container">
            <h2 class="date-info">
                Fecha: ${fechaHoyFormateada}
            </h2>
            
            <div class="logo-container">
                <img src="${logoBase64}" class="logo-image" alt="Logo">
            </div>
        </div>
        
        <h1 class="section-title">
            CUENTA DE COBRO
        </h1>
        
        <table class="info-table client-info">
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

        <h1 class="section-title">
            DEBE A
        </h1>
        
        <div class="professional-info professional-name">
            ${users.nombre} ${users.apellido}
        </div>
        <div class="professional-info">
            CC: ${users.documento} Tel ${users.telefono}
        </div>
        <div class="professional-info">
            ${users.direccion}
        </div>
        
        <h1 class="section-title">
            POR CONCEPTO DE
        </h1>
        
        <table class="cuenta-table">
            <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>Valor/und</th>
                <th>Valor</th>
            </tr>
            ${tablaCuenta}
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

    <div class="page-break">
        <div class="header-container">
            <div class="logo-container">
                <img src="${logoBase64}" class="logo-image" alt="Logo">
            </div>
        </div>
        
        <h1 class="main-title">
            INFORME
        </h1>
        
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

        <table class="info-table">
            <tr>
                <td class="left-column">${users.nombre} ${users.apellido}</td>
            </tr>
            <tr>
                <td class="left-column">${users.profesion}</td>
            </tr>
            <tr>
                <td class="left-column">${users.universidad}</td>
            </tr>
        </table>
    </div>
</body>
</html>
`;
    };

    const showPreview = () => {
        setHtmlContent(generateHTMLWithPreciseMargins());
        setIsPreviewVisible(true);
    };

    const generatePDFWithExpo = async () => {
        try {
            setIsGenerating(true);
            
            const { uri } = await Print.printToFileAsync({ 
                html: generateHTMLWithPreciseMargins(),
                printerOptions: {
                    // Asegurar que se respeten los márgenes en el PDF
                    margins: {
                        top: 2.5,
                        bottom: 2.5,
                        left: 2,
                        right: 2
                    }
                }
            });
            
            setIsGenerating(false);
            return uri;
        } catch (error) {
            setIsGenerating(false);
            throw error;
        }
    };

    const generatePDF = async () => {
        try {
            // Usar React PDF para márgenes más precisos
            const pdfPath = await generatePDFWithReactPDF();
            if (pdfPath) {
                await shareAsync(pdfPath, { UTI: '.pdf', mimeType: 'application/pdf' });
                setIsPreviewVisible(false);
            }
        } catch (error) {
            console.error('Error with React PDF, falling back to Expo Print:', error);
            
            // Fallback a expo-print mejorado
            try {
                const pdfPath = await generatePDFWithExpo();
                if (pdfPath) {
                    await shareAsync(pdfPath, { UTI: '.pdf', mimeType: 'application/pdf' });
                    setIsPreviewVisible(false);
                }
            } catch (fallbackError) {
                Alert.alert('Error', 'No se pudo generar el PDF: ' + fallbackError.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.button}
                onPress={showPreview}
            >
                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Previsualizar factura y reporte</StyledText>
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
                                    setHtmlContent(generateHTMLWithPreciseMargins());
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
                                    setHtmlContent(generateHTMLWithPreciseMargins());
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
                                    setHtmlContent(generateHTMLWithPreciseMargins());
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
                                        setHtmlContent(generateHTMLWithPreciseMargins());
                                    }}
                                >
                                    <Text>Izquierda</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'center' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('center');
                                        setHtmlContent(generateHTMLWithPreciseMargins());
                                    }}
                                >
                                    <Text>Centro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'right' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('right');
                                        setHtmlContent(generateHTMLWithPreciseMargins());
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
                                {isGenerating ? 'Generando PDF...' : 'Generar PDF con márgenes precisos'}
                            </Text>
                        </TouchableOpacity>
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
    printer: {
        textAlign: 'center',
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
});