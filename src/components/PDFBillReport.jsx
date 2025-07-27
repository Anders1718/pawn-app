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

    // Función para formatear números con comas para miles
    const formatNumber = (number) => {
        if (number === null || number === undefined || number === '') return number;
        
        // Convertir a string y remover caracteres no numéricos excepto punto decimal
        const cleanNumber = number.toString().replace(/[^\d.-]/g, '');
        
        // Convertir a número y verificar si es válido
        const num = parseFloat(cleanNumber);
        if (isNaN(num)) return number;
        
        // Formatear con comas para miles
        return num.toLocaleString('es-CO');
    }


    let tablaVacas = '';
    uniqueSalas.forEach(sala => {
        tablaVacas += `
        <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
            ${sala}
        </h1>
        <table class="animal-table">
            <tr>
                <th></th>
                <th>ID-Animal</th>
                <th>Extremidad</th>
                <th>Descripción</th>
                <th>Observación</th>
                <th>Tratamiento</th>
            </tr>
        `;
        let index = 1; // Inicializar el contador para cada sala
        let elementCount = 0; // Contador para el control de página

        report.filter(vaca => vaca.sala === sala).forEach(vaca => {
            // Contar cuántas filas ocupa esta vaca según los caracteres en sus campos
            const fields = [
                vaca.nombre_vaca || "",
                convertExtremidad(vaca.extremidad) || "",
                vaca.enfermedades || "",
                vaca.nota || "",
                vaca.tratamiento || ""
            ];
            // Si alguno de los campos supera 26 caracteres, cuenta como 2 filas
            const filaExtra = fields.some(f => f.length > 26) ? 2 : 1;
        
            // Separa el control de paginación por "elementCount"
            // Aplica las mismas reglas de corte pero suma "filaExtra" en vez de solo 1
        
            // Control para la primera tabla
            if (elementCount > 0) {
                if (elementCount === 22) {
                    tablaVacas += `
                    </table>
                    <div style="page-break-after: always;"></div>
                    <table class="animal-table">
                        <tr>
                            <th></th>
                            <th>ID-Animal</th>
                            <th>Extremidad</th>
                            <th>Descripción</th>
                            <th>Observación</th>
                            <th>Tratamiento</th>
                        </tr>
                    `;
                }
                // Control para tablas siguientes
                else if (elementCount > 22 && (elementCount - 22) % 30 === 0) {
                    tablaVacas += `
                    </table>
                    <div style="page-break-after: always;"></div>
                    <table class="animal-table">
                        <tr>
                            <th></th>
                            <th>ID-Animal</th>
                            <th>Extremidad</th>
                            <th>Descripción</th>
                            <th>Observación</th>
                            <th>Tratamiento</th>
                        </tr>
                    `;
                }
            }
        
            const countIds = count(vaca.nombre_vaca);
            tablaVacas += `
            <tr>
                <td>${verifyId(vaca.nombre_vaca, index)}</td>
                <td>${vaca.nombre_vaca}</td>
                <td>${convertExtremidad(vaca.extremidad)}</td>
                <td>${vaca.enfermedades}</td>
                <td>${vaca.nota}</td>
                <td>${vaca.tratamiento}</td>
            </tr>
            `;
            if (countIds) index++;
            elementCount += filaExtra;
        });
        tablaVacas += `</table>`;
    });


    let tablaCuenta = '';
    totalCuenta.forEach((cuenta, index) => {
        tablaCuenta += `
        <tr>
            <td>${cuenta.cantidad}</td>
            <td>${cuenta.descripcion}</td>
            <td>$ ${formatNumber(cuenta.valor)}</td>
            <td>$ ${formatNumber(cuenta.total)}</td>
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
            width: 60%; /* Hacer la tabla más angosta */
            margin-left: auto; /* Centrar la tabla */
            margin-right: auto; /* Centrar la tabla */
            th, td {
                border: 1px solid black;
            };
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
            page-break-inside: avoid;
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
        <tr style="border-top: 2px solid black;">
            <td colspan="3" style="text-align: right; font-weight: bold; padding: 10px;">Total:</td>
            <td style="font-weight: bold; padding: 10px;">$ ${formatNumber(sumaTotal)}</td>
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
            <DocsReport {...{ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }}/>
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
