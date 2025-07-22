import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsReport from './DocsReport';

export default function App({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) {
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
    const [htmlContent, setHtmlContent] = React.useState('');
    const [logoSize, setLogoSize] = React.useState(150);
    const [logoPosition, setLogoPosition] = React.useState({ top: 0.7, right: -0.5 });
    const [textAlignment, setTextAlignment] = React.useState('center');
    const [logoBase64, setLogoBase64] = React.useState('');
    
    // Cargar la imagen como Base64 al iniciar el componente
    React.useEffect(() => {
        (async () => {
            try {
                // Intentar cargar la imagen desde los assets
                const asset = Asset.fromModule(require('../img/logo-podologo.png'));
                await asset.downloadAsync();
                const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
                setLogoBase64(`data:image/png;base64,${base64}`);
            } catch (error) {
                console.error('Error al cargar la imagen:', error);
                // Si falla, puedes proporcionar una imagen predeterminada o mostrar un mensaje
            }
        })();
    }, []);
    
    const uniqueSalas = [...new Set(report.map(item => item.sala))];
    const ids = [];

    const verifyId = (id, n) => {
        const itemsArray = ids.indexOf(id);

        if (itemsArray === -1) {
            // Si el elemento no existe en el array, añadirlo
            ids.push(id);
            return n
        }
        // Si el elemento existe en el array, eliminarlo
        return '';
    }

    const count = (id) => {
        const itemsArray = ids.indexOf(id);

        if (itemsArray === -1) {
            return true
        }
        return false;
    }

    const convertExtremidad = (value) => {
        // Si value es undefined o null, retornar el valor original
        if (!value) return value;

        // Dividir el string por comas y luego por espacios
        const secciones = value.split(',');

        const resultado = secciones.map(seccion => {
            const palabras = seccion.trim().split(' ');

            // Procesar cada palabra
            return palabras.map(palabra => {
                // Si la palabra contiene números
                if (/\d/.test(palabra)) {
                    // Extraer solo los números de esa palabra
                    return palabra.replace(/[^\d]/g, '');
                }
                // Si no contiene números, mantener la palabra original
                return palabra;
            }).join(' ');
        }).join(', '); // Unir las secciones con coma y espacio

        return resultado;
    }

    // Generar HTML para las tablas de vacas con paginación adecuada
    const generateVacasHTML = () => {
        let tablaVacas = '';
        let contadorGeneral = 1;
        
        // Reset IDs para cada generación
        ids.length = 0;
        
        uniqueSalas.forEach((sala, salaIndex) => {
            const vacasEnSala = report.filter(vaca => vaca.sala === sala);
            
            // Título de la sala
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
            
            // Filas de vacas
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

    const generateHTML = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
        /* Configuración de página con márgenes fijos */
        @page {
            size: A4;
            margin: 2.5cm 2cm 2.5cm 2cm; /* Superior, Derecho, Inferior, Izquierdo */
        }
        
        /* Reset y configuración básica */
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: black;
            font-size: 12pt;
            line-height: 1.3;
        }
        
        /* Configuración para respetar márgenes en toda página */
        .page-content {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        /* Headers que se repiten en cada página */
        .page-header {
            position: running(pageHeader);
            width: 100%;
            height: 50px;
            margin-bottom: 20px;
        }
        
        .page-footer {
            position: running(pageFooter);
            width: 100%;
            height: 30px;
            margin-top: 20px;
            text-align: center;
            font-size: 10pt;
        }
        
        /* Configuración de tablas para paginación correcta */
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
            padding: 8px 4px;
            text-align: center;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-size: 11pt;
        }
        
        .animal-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        /* Filas de animales con control de salto de página */
        .animal-row {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        
        /* Secciones de sala */
        .sala-section {
            page-break-inside: auto;
            margin-bottom: 30px;
        }
        
        .sala-title {
            font-size: 17pt;
            font-weight: bold;
            text-align: center;
            margin: 20px 0 15px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        /* Tablas de información */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .info-table td {
            padding: 5px 10px;
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
        
        .info-table .bold {
            font-weight: bold;
        }
        
        /* Tabla de cuenta */
        .cuenta-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .cuenta-table th,
        .cuenta-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        
        .cuenta-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        /* Tabla de patas (abreviaciones) */
        .paws-table {
            width: 60%;
            margin: 30px auto;
            border-collapse: collapse;
            page-break-inside: avoid;
        }
        
        .paws-table th, 
        .paws-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        
        /* Headers y títulos */
        h1 {
            font-size: 17pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 20px 0 15px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        h2 {
            font-size: 15pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 15px 0 10px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        /* Logo container */
        .logo-container {
            position: absolute;
            top: -10px;
            right: ${logoPosition.right}cm;
            text-align: right;
            z-index: 10;
        }
        
        .logo-image {
            width: 200px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
        }
        
        /* Header container */
        .header-container {
            position: relative;
            height: 80px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .date-info {
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 17pt;
            font-weight: bold;
        }
        
        /* Información de cliente */
        .client-info td {
            padding: 5px 3px;
        }
        
        .client-info .label-text {
            font-weight: bold;
            margin-right: 10px;
            display: inline-block;
        }
        
        /* Total */
        .total-section {
            text-align: right;
            font-weight: bold;
            font-size: 18pt;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        /* Salto de página forzado */
        .page-break {
            page-break-before: always;
            padding-top: 0;
        }
        
        /* Títulos de sección principales */
        .main-title {
            font-size: 20pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 30px 0 20px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        .section-title {
            font-size: 17pt;
            font-weight: bold;
            text-align: ${textAlignment};
            margin: 25px 0 15px 0;
            page-break-inside: avoid;
            page-break-after: avoid;
        }
        
        /* Información del profesional */
        .professional-info {
            font-size: 17pt;
            text-align: ${textAlignment};
            margin: 5px 0;
            page-break-inside: avoid;
        }
        
        .professional-name {
            font-size: 25pt;
            font-weight: normal;
        }
        
        /* Evitar huérfanas y viudas */
        p, div, td, th {
            orphans: 2;
            widows: 2;
        }
        
        /* Asegurar que las tablas respeten los márgenes */
        table {
            margin-left: 0;
            margin-right: 0;
        }
    </style>
</head>

<body>
    <!-- PRIMERA PÁGINA: CUENTA DE COBRO -->
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

    <!-- SEGUNDA PÁGINA Y SIGUIENTES: INFORME -->
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
        
        <!-- TABLAS DE VACAS CON PAGINACIÓN AUTOMÁTICA -->
        ${generateVacasHTML()}
        
        <!-- TABLA DE ABREVIACIONES -->
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

        <!-- INFORMACIÓN DEL PROFESIONAL AL FINAL -->
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
        setHtmlContent(generateHTML());
        setIsPreviewVisible(true);
    };

    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ 
            html: htmlContent || generateHTML(),
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
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        setIsPreviewVisible(false);
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
                                    setHtmlContent(generateHTML());
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
                                    setHtmlContent(generateHTML());
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
                                    setHtmlContent(generateHTML());
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
                                        setHtmlContent(generateHTML());
                                    }}
                                >
                                    <Text>Izquierda</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'center' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('center');
                                        setHtmlContent(generateHTML());
                                    }}
                                >
                                    <Text>Centro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.alignButton, textAlignment === 'right' && styles.activeButton]}
                                    onPress={() => {
                                        setTextAlignment('right');
                                        setHtmlContent(generateHTML());
                                    }}
                                >
                                    <Text>Derecha</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.generateButton}
                            onPress={printToFile}
                        >
                            <Text style={styles.buttonText}>Generar PDF</Text>
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
        // flex: 1,
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