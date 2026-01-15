import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsBillReport from './DocsBillReport';

export default function App({ direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, users }) {
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
    const [htmlContent, setHtmlContent] = React.useState('');
    const [logoSize, setLogoSize] = React.useState(150);
    const [logoPosition, setLogoPosition] = React.useState({ top: 20, right: 20 });
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
    
    let tablaCuenta = '';
    totalCuenta.forEach((cuenta, index) => {
        tablaCuenta += `
        <tr>
            <td>${cuenta.cantidad}</td>
            <td>${cuenta.descripcion}</td>
            <td>${cuenta.valor}</td>
            <td>${cuenta.total}</td>
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
            margin: 40pt; /* Márgenes de la página */
        }
        .animal-table {
            margin-top: 50px;
            margin-bottom: 50px;
            th, td {
                border: 1px solid black;
            };
        }
        .paws-table {
            margin-bottom: 50px;
            th, td {
                border: 1px solid black;
            };
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-family: Helvetica Neue;
            page-break-inside: avoid;
        }
        th,td {
            text-align: center;
            page-break-inside: avoid;
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
            text-align: left;
            padding-left: 30%;
        }

        .info-table .bold {
            font-weight: bold;
        }
        
        /* Estilos para hacer que los campos del total estén más juntos */
        .total-table {
            width: auto;
            margin-left: auto; /* Alinea la tabla a la derecha */
        }
        
        .total-table td {
            padding: 5px 10px; /* Aumenta el padding para mejor espaciado */
            white-space: nowrap; /* Evita que el texto se divida en líneas */
        }
        
        /* Estilo específico para el valor del total */
        .total-value {
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap; /* Evita saltos de línea dentro del valor */
            display: inline-block; /* Mantiene el valor en una sola línea */
        }
        
        /* Estilo para separar las etiquetas de sus valores */
        .label-text {
            margin-right: 10px; /* Espacio entre la etiqueta y su valor */
            display: inline-block; /* Para asegurar que el margen se aplique correctamente */
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
        
        /* Estilos para el logo como membrete */
        .logo-container {
            position: absolute;
            top: ${logoPosition.top}px;
            right: ${logoPosition.right}px;
            text-align: right;
        }
        
        .logo-image {
            width: 200px;
            height: 70px;
            border-radius: 10px;
            object-fit: cover;
        }
        
        .header-container {
            position: relative;
            height: 80px; /* Para dar espacio al logo */
            margin-bottom: 20px;
        }
        
        .date-info {
            position: absolute;
            left: 0;
            bottom: 0;
        }
        
        /* Estilos para el documento */
        body {
            font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: black;
        }
        
        /* Estilo para la tabla principal */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        /* Estilo para mejorar la alineación en la columna derecha */
        .info-table .right-column .label-text {
            display: inline-block;
            min-width: 50px;
            margin-right: 5px;
            text-align: left;
        }
        
        h1 {
            text-align: ${textAlignment};
        }
    </style>
</head>

<body style=" margin: 40px;">
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
    <table class="info-table">
        <tr>
            <td class="left-column"><span class="bold label-text">Cliente:</span>${cliente}</td>
            <td class="right-column" ><span class="bold label-text">Nit:</span>${nit}</td>
        </tr>
        <tr>
            <td class="left-column"><span class="bold label-text">Dirección:</span>${direccion}</td>
            <td class="right-column" ><span class="bold label-text">Tel:</span>${tel}</td>
        </tr>
    </table>

    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 15px; margin-top: 25px;">
        DEBE A
    </h1>
    <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal; margin-top: 5px; margin-bottom: 5px;">
        ${users.nombre} ${users.apellido}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; margin-top: 5px; margin-bottom: 5px;">
        CC: ${users.documento} Tel ${users.telefono}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; margin-top: 5px; margin-bottom: 5px;">
        ${users.direccion}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; margin-bottom: 15px; margin-top: 25px;">
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
            <td class="right-column total-value">$${sumaTotal}</td>
        </tr>
    </table>
    <table class="info-table">
        <tr>
            <td class="left-column">
                ${users.nombre} ${users.apellido}
            </td>
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
                                maximumValue={100}
                                step={5}
                                value={logoPosition.top}
                                onValueChange={value => {
                                    setLogoPosition({...logoPosition, top: value});
                                    setHtmlContent(generateHTML());
                                }}
                            />
                            <Text>{logoPosition.top}px</Text>
                        </View>
                        
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Posición horizontal:</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={100}
                                step={5}
                                value={logoPosition.right}
                                onValueChange={value => {
                                    setLogoPosition({...logoPosition, right: value});
                                    setHtmlContent(generateHTML());
                                }}
                            />
                            <Text>{logoPosition.right}px</Text>
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
            <DocsBillReport {...{ direccion, cliente, lugar, totalCuenta, fechaHoyFormateada, nit, tel, sumaTotal, users }} />
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
        color: '#fff',
    },
});
