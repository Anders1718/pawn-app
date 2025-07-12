import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

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

    // Función para estimar la altura de una fila basada en el contenido
    const estimateRowHeight = (vaca) => {
        const baseHeight = 25; // Altura base de una fila en puntos (reducida)
        const charWidth = 6; // Ancho promedio de un carácter en puntos
        const cellWidth = 100; // Ancho promedio de una celda en puntos
        
        // Calcular líneas necesarias para cada celda
        const extremidadLines = Math.ceil((convertExtremidad(vaca.extremidad) || '').length * charWidth / cellWidth);
        const descripcionLines = Math.ceil((vaca.enfermedades || '').length * charWidth / cellWidth);
        const observacionLines = Math.ceil((vaca.nota || '').length * charWidth / cellWidth);
        const tratamientoLines = Math.ceil((vaca.tratamiento || '').length * charWidth / cellWidth);
        
        const maxLines = Math.max(1, extremidadLines, descripcionLines, observacionLines, tratamientoLines);
        
        return baseHeight * maxLines;
    };

    // Función para dividir las vacas en páginas
    const paginateVacas = (vacas, maxPageHeight = 650, isFirstPageOfReport = false) => {
        const pages = [];
        let currentPage = [];
        let currentHeight = 60; // Altura del header de la tabla (reducida)
        let isFirstPage = true;
        
        vacas.forEach(vaca => {
            const rowHeight = estimateRowHeight(vaca);
            
            // Solo aplicar altura reducida en la primera página del informe
            const currentMaxHeight = (isFirstPageOfReport && isFirstPage) ? 400 : maxPageHeight;
            
            if (currentHeight + rowHeight > currentMaxHeight && currentPage.length > 0) {
                // Iniciar nueva página
                pages.push(currentPage);
                currentPage = [vaca];
                currentHeight = 60 + rowHeight; // Header + primera fila
                isFirstPage = false; // Ya no es la primera página
            } else {
                currentPage.push(vaca);
                currentHeight += rowHeight;
            }
        });
        
        if (currentPage.length > 0) {
            pages.push(currentPage);
        }
        
        return pages;
    };

    let tablaVacas = '';
    uniqueSalas.forEach((sala, salaIndex) => {
        const vacasEnSala = report.filter(vaca => vaca.sala === sala);
        // Solo la primera sala puede tener su primera página en la página del informe
        const isFirstSala = salaIndex === 0;
        const paginasVacas = paginateVacas(vacasEnSala, 650, isFirstSala);
        
        paginasVacas.forEach((paginaVacas, paginaIndex) => {
            // Si no es la primera página de la primera sala, agregar salto de página
            if (salaIndex > 0 || paginaIndex > 0) {
                tablaVacas += `<div style="page-break-before: always;"></div>`;
            }
            
            // Solo mostrar el título de la sala en la primera página de cada sala
            if (paginaIndex === 0) {
                tablaVacas += `
                <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center; margin-top: 15px; margin-bottom: 15px;">
                    ${sala}
                </h1>`;
            }
            
            tablaVacas += `
            <table class="animal-table" style="margin-top: 10px; margin-bottom: 20px;">
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
                <tbody>
            `;
            
            let index = 1;
            // Resetear el array de IDs para cada página si es necesario
            if (paginaIndex === 0) {
                ids.length = 0; // Limpiar el array de IDs para esta sala
            }
            
            paginaVacas.forEach(vaca => {
                const countIds = count(vaca.nombre_vaca);
                tablaVacas += `
                <tr>
                    <td style="padding: 4px; vertical-align: top;">${verifyId(vaca.nombre_vaca, index)}</td>
                    <td style="padding: 4px; vertical-align: top;">${vaca.nombre_vaca}</td>
                    <td style="padding: 4px; vertical-align: top; word-wrap: break-word;">${convertExtremidad(vaca.extremidad)}</td>
                    <td style="padding: 4px; vertical-align: top; word-wrap: break-word;">${vaca.enfermedades}</td>
                    <td style="padding: 4px; vertical-align: top; word-wrap: break-word;">${vaca.nota}</td>
                    <td style="padding: 4px; vertical-align: top; word-wrap: break-word;">${vaca.tratamiento}</td>
                </tr>
                `;
                if (countIds) index++;
            });
            
            tablaVacas += `
                </tbody>
            </table>
            `;
        });
    });


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
<html>

<head>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
        @page {
            margin: 0; /* Reset browser default margins */
            size: A4;
        }
        .page-content {
            padding: 40pt; /* Our desired margin */
            min-height: calc(100vh - 80pt); /* Ensure content doesn't overflow */
        }
        .animal-table {
            width: 100%;
            border-collapse: collapse;
            font-family: Helvetica Neue;
            margin-top: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .animal-table th,
        .animal-table td {
            border: 1px solid black;
            text-align: center;
            padding: 4px;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .animal-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .paws-table {
            margin-bottom: 50px;
            width: 60%; /* Hacer la tabla más angosta */
            margin-left: auto; /* Centrar la tabla */
            margin-right: auto; /* Centrar la tabla */
        }
        .paws-table th, 
        .paws-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-family: Helvetica Neue;
        }
        th,td {
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }

        .info-table {
            margin-bottom: 30px;
        }

        .info-table .left-column {
            text-align: left;
        }

        .info-table .right-column {
            text-align: right;
        }

        .info-table .bold {
            font-weight: bold;
        }
        thead {
            display: table-header-group;
        }
        tr {
            page-break-inside: avoid !important;
        }
        .total-table {
            width: auto;
            margin-left: auto; /* Alinea la tabla a la derecha */
        }

        .total-table td {
            padding: 0 5px; /* Reduce el padding entre celdas */
        }
        
        /* Estilos para hacer que los campos de información del cliente estén más juntos */
        .client-info td {
            padding: 0 3px; /* Reduce aún más el padding entre celdas */
        }
        
        .client-info .label {
            width: 1%; /* Hace que la celda de la etiqueta sea lo más estrecha posible */
            white-space: nowrap; /* Evita que el texto se rompa */
            padding-right: 0; /* Elimina el padding derecho */
        }
        
        .client-info .value {
            padding-right: 15px; /* Reduce el espacio a la derecha para separar los pares de campos */
        }
        
        /* Estilos específicos para NIT y teléfono */
        .client-info .tight-pair {
            width: 1%; /* Hace que la celda sea lo más estrecha posible */
            white-space: nowrap; /* Evita que el texto se rompa */
        }
        
        .client-info .tight-label {
            padding-right: 0; /* Elimina el padding derecho */
            margin-right: 0; /* Elimina el margen derecho */
        }
        
        .client-info .tight-value {
            padding-left: 0; /* Elimina el padding izquierdo */
            margin-left: 0; /* Elimina el margen izquierdo */
        }
        
        /* Estilos para los títulos principales */
        .title {
            margin-bottom: 15px; /* Espacio debajo del título */
            margin-top: 25px; /* Espacio encima del título */
        }
        
        /* Estilos para los subtítulos */
        .subtitle {
            margin-top: 5px; /* Espacio mínimo encima del subtítulo */
            margin-bottom: 5px; /* Espacio mínimo debajo del subtítulo */
        }
        
        /* Estilo para separar las etiquetas de sus valores */
        .label-text {
            margin-right: 10px; /* Espacio entre la etiqueta y su valor */
            display: inline-block; /* Para asegurar que el margen se aplique correctamente */
        }
        
        .logo-container {
            position: absolute;
            top: -20px;
            right: ${logoPosition.right}cm;
            text-align: right;
        }
        
        .logo-image {
            width: 200px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
        }

        .logo-image-2 {
            width: 200px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
        }
        
        .header-container {
            position: relative;
            height: 30px; /* Para dar espacio al logo */
            margin-bottom: 20px;
        }
        
        .date-info {
            position: absolute;
            left: 0;
            bottom: 0;
        }

        /* Estilo para mejorar la alineación en la columna derecha */
        .info-table .right-column {
            text-align: left;
            padding-left: 30%;
        }
        
        /* Asegura que las etiquetas y valores en la columna derecha estén alineados */
        .info-table .right-column .label-text {
            display: inline-block;
            min-width: 50px;
            margin-right: 5px;
            text-align: left;
        }
        
        h1, h2 {
            text-align: ${textAlignment};
            page-break-after: avoid !important;
        }

        .informe-heder{
            margin-top: 40px; /* Aumentar el margen superior */
        }
        .informe-menu{
            margin-top: 70px; /* Aumentar el margen superior */
        }
        
        /* Estilos para el documento */
        body {
            font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: black;
        }
        
        /* Asegurar que cada página tenga el margen correcto */
        div[style*="page-break-before: always"] {
            padding-top: 40pt;
        }
    </style>
</head>

<body>
   <div class="page-content">
       <div class="header-container">
           <h2 class="date-info" style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold;">
               Fecha: ${fechaHoyFormateada}
           </h2>
           
           <div class="logo-container">
               <img src="${logoBase64}" class="logo-image" alt="Logo">
           </div>
       </div>
       
        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 15px; margin-top: 20px;">
            CUENTA DE COBRO
        </h1>
        <table class="info-table client-info">
            <tr>
                <td class="left-column"><span class="bold label-text">Cliente:</span>${cliente}</td>
                <td class="right-column" ><span class="bold label-text">Nit:</span>${nit}</td>
            </tr>
            <tr>
                <td class="left-column"><span class="bold label-text">Dirección:</span>${direccion}</td>
                <td class="right-column" ><span class="bold label-text">Tel:</span>${tel}</td>
            </tr>
        </table>

        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: ${textAlignment}; margin-bottom: 15px; margin-top: 25px;">
            DEBE A
        </h1>
        <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal; text-align: ${textAlignment}; margin-top: 5px; margin-bottom: 5px;">
            ${users.nombre} ${users.apellido}
        </h1>
        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: ${textAlignment}; margin-top: 5px; margin-bottom: 5px;">
            CC: ${users.documento} Tel ${users.telefono}
        </h1>
        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: ${textAlignment}; margin-top: 5px; margin-bottom: 5px;">
            ${users.direccion}
        </h1>
        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: ${textAlignment}; margin-bottom: 15px; margin-top: 25px;">
            POR CONCEPTO DE
        </h1>
        <table class="animal-table">
            <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>Valor/und</th>
                <th>Valor</th>
            </tr>
            ${tablaCuenta}
        </table>
        <table class="info-table total-table">
            <tr>
                <td class="right-column bold">Total:</td>
                <td class="right-column">$ ${sumaTotal}</td>
            </tr>
        </table>
        <table class="info-table">
            <tr>
                <td class="left-column">${users.nombre} ${users.apellido} </td>
                <td class="right-column">Favor consignar a la cuenta</td>
            </tr>
            <tr>
                <td class="left-column">${users.profesion} </td>
                <td class="right-column">${users.tipoCuenta} ${users.banco}</td>
            </tr>
            <tr>
                <td class="left-column">${users.universidad} </td>
                <td class="right-column">${users.numeroCuenta}</td>
            </tr>
        </table>

        <div style="page-break-before: always; padding-top: 30px;">
            <div class="informe-heder">
                <div class="header-container">
                    <h2 class="date-info" style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold;">
                        Fecha: ${fechaHoyFormateada}
                    </h2>
                    
                    <div class="logo-container">
                        <img src="${logoBase64}" class="logo-image-2" alt="Logo">
                    </div>
                </div>
            </div>
            <div class="informe-menu">
            <h1 style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; text-align: ${textAlignment};">
                INFORME
            </h1>
            <table class="info-table">
            <tr>
                <td class="left-column"><span class="bold label-text">Cliente:</span>${cliente}</td>
                <td class="right-column"><span class="bold label-text">Finca:</span>${finca}</td>
            </tr>
            <tr>
                <td class="left-column"><span class="bold label-text">Ubicación:</span>${lugar}</td>
                <td class="right-column"><span class="bold label-text">Fecha:</span>${fechaHoyFormateada}</td>
            </tr>
             </table>
             </div>
        </div>

            <tbody>
            ${tablaVacas}
            </tbody>

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
                <td class="left-column">${users.nombre} ${users.apellido} </td>
            </tr>
            <tr>
                <td class="left-column">${users.profesion} </td>
            </tr>
            <tr>
                <td class="left-column">${users.universidad} </td>
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
        const { uri } = await Print.printToFileAsync({ html: htmlContent || generateHTML() });
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
    activeButton: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
});
