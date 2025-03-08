import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';



export default function GenerateReport({ finca, cliente, lugar, fechaHoyFormateada, report, setIsOpen, users }) {
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
            if (elementCount > 0) {
                // Primera página: 22 elementos
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
                // Páginas intermedias: 25 elementos por página
                else if (elementCount > 22 && (elementCount - 22) % 25 === 0) {
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
            elementCount++;
        });
        tablaVacas += `</table>`;
    });

    const html = `
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
            text-align: right;
        }

        .info-table .bold {
            font-weight: bold;
        }

        .logo-container {
            position: absolute;
            top: 20px;
            right: 20px;
            text-align: right;
        }

        .logo-image {
            width: 80px;
            height: 80px;
            border-radius: 5px;
            object-fit: cover;
        }
        
        .header-container {
            position: relative;
            height: 80px; /* Para dar espacio al logo */
            margin-bottom: 20px;
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
        
        /* Estilos específicos para campos especiales */
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
        
        /* Estilo para separar las etiquetas de sus valores */
        .label-text {
            margin-right: 10px; /* Espacio entre la etiqueta y su valor */
            display: inline-block; /* Para asegurar que el margen se aplique correctamente */
        }
    </style>
</head>

<body style=" margin: 40px;">
    <div class="header-container">
        ${users.logo ? `
        <div class="logo-container">
            <img src="${users.logo}" class="logo-image" alt="Logo">
        </div>
        ` : ''}
    </div>
    <h1 style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
        INFORME
    </h1>
    <table class="info-table client-info">
        <tr>
            <td class="left-column"><span class="bold label-text">Cliente:</span>${cliente}</td>
            <td class="right-column" style="text-align: right"><span class="bold label-text">Finca:</span>${finca}</td>
        </tr>
        <tr>
            <td class="left-column"><span class="bold label-text">Ubicación:</span>${lugar}</td>
            <td class="right-column" style="text-align: right"><span class="bold label-text">Fecha:</span>${fechaHoyFormateada}</td>
        </tr>
    </table>
        ${tablaVacas}

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
        ${users.logo ? `
        <tr>
            <td class="left-column">
                <img src="${users.logo}" style="width: 60px; height: 60px; border-radius: 5px; object-fit: cover; margin-top: 10px;" alt="Logo">
            </td>
        </tr>
        ` : ''}
    </table>
    
</body>

</html>
`;

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        printToFile();
    }, [report]);

    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
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
        borderRadius: "25%",
        borderRadius: "25%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 15,
        borderWidth: 10
    },
});
