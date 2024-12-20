import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';



export default function App({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report }) {
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
        <thead>
            <tr>
                <th></th>
                <th>ID-Animal</th>
                <th>Extremidad</th>
                <th>Descripción</th>
                <th>Observación</th>
                <th>Tratamiento</th>
            </tr>
        </thead>
        `;
        let index = 1; // Inicializar el contador para cada sala
        report.filter(vaca => vaca.sala === sala).forEach(vaca => {
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

        });
        tablaVacas += `</table>`;
    });


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

    const html = `
<html>

<head>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            padding: 2cm;
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
    </style>
</head>

<body>
   <h2 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; ">
   Fecha: ${fechaHoyFormateada}
   </h2>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
        CUENTA DE COBRO
    </h1>
    <table class="info-table">
        <tr>
            <td class="left-column bold">Cliente:</td>
            <td class="left-column">${cliente}</td>
            <td class="right-column bold">Nit:</td>
            <td class="right-column">${nit}</td>
        </tr>
        <tr>
            <td class="left-column bold">Dirección:</td>
            <td class="left-column">${direccion}</td>
            <td class="right-column bold">Tel:</td>
            <td class="right-column">${tel}</td>
        </tr>
    </table>

    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
        DEBE A
    </h1>
    <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
        Alejandro Cardona Tobón
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
        CC: 1041326066 Tel 3016546869
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
        Medellín Antioquia
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
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
    <table class="info-table">
        <tr>
            <td class="right-column bold">Total:</td>
            <td class="right-column">${sumaTotal}</td>
        </tr>
    </table>
    <table class="info-table">
        <tr>
            <td class="right-column">Favor consignar a la cuenta de ahorros Bancolombia</td>
        </tr>
        <tr>
            <td class="right-column">xxxxxxxxx</td>
        </tr>
    </table>

    <div style="page-break-before: always;">
        <div style="height: 50px;"></div>
        <h1 style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold; text-align: center;">
            INFORME
        </h1>
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
            <td class="left-column">Alejandro Cardona Tobón </td>
        </tr>
        <tr>
            <td class="left-column">Médico Veterinario Zootecnista </td>
        </tr>
        <tr>
            <td class="left-column">Universidad CES </td>
        </tr>
    </table>
</body>

</html>
`;

    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.button}
                onPress={printToFile}
            >
                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Generar factura y reporte</StyledText>
            </TouchableOpacity>
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
