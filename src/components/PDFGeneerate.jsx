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
        
        /* Estilos para hacer que los campos del total estén más juntos */
        .total-table {
            width: auto;
            margin-left: auto; /* Alinea la tabla a la derecha */
        }
        
        .total-table td {
            padding: 0 5px; /* Reduce el padding entre celdas */
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
    </style>
</head>

<body style=" margin: 40px;">
   <div class="header-container">
       <h2 class="date-info" style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold;">
       Fecha: ${fechaHoyFormateada}
       </h2>
       
       ${users.logo ? `
       <div class="logo-container">
           <img src="${users.logo}" class="logo-image" alt="Logo">
       </div>
       ` : ''}
   </div>
   
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center; margin-bottom: 15px; margin-top: 20px;">
        CUENTA DE COBRO
    </h1>
    <table class="info-table">
        <tr>
            <td class="left-column"><span class="bold label-text">Cliente:</span>${cliente}</td>
            <td class="right-column" style="text-align: right"><span class="bold label-text">Nit:</span>${nit}</td>
        </tr>
        <tr>
            <td class="left-column"><span class="bold label-text">Dirección:</span>${direccion}</td>
            <td class="right-column" style="text-align: right"><span class="bold label-text">Tel:</span>${tel}</td>
        </tr>
    </table>

    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center; margin-bottom: 15px; margin-top: 25px;">
        DEBE A
    </h1>
    <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal; text-align: center; margin-top: 5px; margin-bottom: 5px;">
        ${users.nombre} ${users.apellido}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center; margin-top: 5px; margin-bottom: 5px;">
        CC: ${users.documento} Tel ${users.telefono}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: normal; text-align: center; margin-top: 5px; margin-bottom: 5px;">
        ${users.direccion}
    </h1>
    <h1 style="font-size: 17px; font-family: Helvetica Neue; font-weight: bold; text-align: center; margin-bottom: 15px; margin-top: 25px;">
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
            <td class="right-column"><span class="bold label-text">Total:</span>${sumaTotal}</td>
        </tr>
    </table>
    <table class="info-table">
        <tr>
            <td class="left-column">
                ${users.nombre} ${users.apellido}
                ${users.logo ? `
                <div style="margin-top: 10px;">
                    <img src="${users.logo}" style="width: 60px; height: 60px; border-radius: 5px; object-fit: cover;">
                </div>
                ` : ''}
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
