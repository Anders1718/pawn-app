import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';



export default function App({ direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, users }) {

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
    </style>
</head>

<body style=" margin: 40px;">
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
        ${users.nombre} ${users.apellido}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
        CC: ${users.documento} Tel ${users.telefono}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
        ${users.direccion}
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
            <td class="left-column">${users.nombre} ${users.apellido} </td>
            <td class="right-column">Favor consignar a la cuenta ${users.tipoCuenta} ${users.banco}</td>
        </tr>
        <tr>
            <td class="left-column">${users.profesion} </td>
            <td class="right-column">${users.numeroCuenta}</td>
        </tr>
        <tr>
            <td class="left-column">${users.universidad} </td>
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
                <StyledText fontSize='subheading' style={{ fontSize: 25 }}>Generar factura</StyledText>
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
