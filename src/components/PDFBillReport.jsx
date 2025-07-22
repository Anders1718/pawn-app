import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert, Platform } from 'react-native';
import StyledText from './StyledText';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import DocsReport from './DocsReport';
import PDFLib, { PDFDocument, PDFPage, StandardFonts } from 'react-native-pdf-lib';

// Helper para word-wrapping (esencial para tablas)
const wrapText = (text, width, font, fontSize) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        // Esta es una estimación. Una librería real de PDF mediría el texto.
        // Asumimos un ancho de caracter promedio.
        const estimatedWidth = (currentLine + " " + word).length * fontSize * 0.5; 
        if (estimatedWidth < width) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

export default function App({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [logoPath, setLogoPath] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            try {
                const asset = Asset.fromModule(require('../img/logo-podologo.png'));
                await asset.downloadAsync();
                setLogoPath(asset.localUri);
            } catch (error) {
                console.error('Error al cargar la imagen del logo:', error);
            }
        })();
    }, []);

    const uniqueSalas = [...new Set(report.map(item => item.sala))];
    let ids = [];

    const verifyId = (id, n) => {
        if (ids.indexOf(id) === -1) {
            ids.push(id);
            return n.toString();
        }
        return '';
    };
    
    const count = (id) => ids.indexOf(id) === -1;

    const convertExtremidad = (value) => {
        if (!value) return '';
        return value.split(',').map(seccion => 
            seccion.trim().split(' ').map(palabra => 
                /\d/.test(palabra) ? palabra.replace(/[^\d]/g, '') : palabra
            ).join(' ')
        ).join(', ');
    };

    // La función definitiva para generar el PDF de forma nativa
    const generatePdfNatively = async () => {
        setIsGenerating(true);
        try {
            const docsDir = await PDFLib.getDocumentsDirectory();
            const pdfPath = `${docsDir}/factura-reporte-${Date.now()}.pdf`;

            // === DEFINICIONES Y CONSTANTES ===
            const pageWidth = 595.28; // A4 Ancho
            const pageHeight = 841.89; // A4 Alto
            const margin = 57; // 2cm
            const contentWidth = pageWidth - (margin * 2);
            let currentPage = 1;
            const pages = [];
            
            const font = StandardFonts.Helvetica;
            const fontBold = StandardFonts.HelveticaBold;
            const mainTextColor = '#000000';
            
            const createPage = () => PDFPage.create().setMediaBox(pageWidth, pageHeight);

            let page = createPage();
            let currentY = pageHeight - margin;

            const checkY = (spaceNeeded) => {
                if (currentY - spaceNeeded < margin) {
                    pages.push(page);
                    page = createPage();
                    currentY = pageHeight - margin;
                    currentPage++;
                    // Podríamos redibujar el header aquí si fuera necesario
                }
            };

            const drawHeader = () => {
                page.drawText(`${users.nombre} ${users.apellido}`, {
                    x: margin,
                    y: pageHeight - 35,
                    font: fontBold,
                    fontSize: 12,
                    color: mainTextColor,
                });
                if (logoPath) {
                    page.drawImage(logoPath, 'png', {
                        x: contentWidth - 80 + margin,
                        y: pageHeight - 50,
                        width: 100,
                        height: 40,
                    });
                }
            };
            
            const drawFooter = () => {
                 page.drawText(`Página ${currentPage}`, {
                    x: contentWidth / 2 + margin - 20,
                    y: 35,
                    font,
                    fontSize: 9,
                    color: '#888888'
                });
            }

            // === PÁGINA 1: CUENTA DE COBRO ===
            drawHeader();
            
            currentY -= 40;
            page.drawText('CUENTA DE COBRO', { x: margin, y: currentY, font: fontBold, fontSize: 18, color: mainTextColor });
            
            currentY -= 30;
            page.drawText(`Fecha: ${fechaHoyFormateada}`, { x: margin, y: currentY, font, fontSize: 11 });
            
            currentY -= 20;
            page.drawText(`Cliente: ${cliente}`, { x: margin, y: currentY, font, fontSize: 11 });
            page.drawText(`Nit: ${nit}`, { x: margin + contentWidth/2, y: currentY, font, fontSize: 11 });
            
            currentY -= 20;
            page.drawText(`Dirección: ${direccion}`, { x: margin, y: currentY, font, fontSize: 11 });
            page.drawText(`Tel: ${tel}`, { x: margin + contentWidth/2, y: currentY, font, fontSize: 11 });
            
            currentY -= 40;
            page.drawText('DEBE A', { x: pageWidth/2 - 30, y: currentY, font: fontBold, fontSize: 16 });

            currentY -= 25;
            page.drawText(`${users.nombre} ${users.apellido}`, { x: pageWidth/2 - 60, y: currentY, font, fontSize: 14 });
            
            // ... (Agregar más detalles del profesional si es necesario)
            
            currentY -= 40;
            page.drawText('POR CONCEPTO DE', { x: pageWidth/2 - 70, y: currentY, font: fontBold, fontSize: 16 });

            // Tabla de cobro
            currentY -= 30;
            const invoiceTableCols = [100, 250, 100, contentWidth - 450];
            // Headers
            let currentX = margin;
            page.drawRectangle({x: margin, y: currentY - 20, width: contentWidth, height: 20, color: '#EAEAEA'});
            page.drawText('Cantidad', {x: currentX + 5, y: currentY - 14, font: fontBold, fontSize: 10});
            currentX += invoiceTableCols[0];
            page.drawText('Descripción', {x: currentX + 5, y: currentY - 14, font: fontBold, fontSize: 10});
            currentX += invoiceTableCols[1];
            page.drawText('Valor/und', {x: currentX + 5, y: currentY - 14, font: fontBold, fontSize: 10});
            currentX += invoiceTableCols[2];
            page.drawText('Valor', {x: currentX + 5, y: currentY - 14, font: fontBold, fontSize: 10});
            
            currentY -= 20;

            totalCuenta.forEach(item => {
                checkY(20);
                currentX = margin;
                page.drawText(item.cantidad.toString(), {x: currentX + 5, y: currentY - 14, font, fontSize: 10});
                currentX += invoiceTableCols[0];
                page.drawText(item.descripcion, {x: currentX + 5, y: currentY - 14, font, fontSize: 10});
                currentX += invoiceTableCols[1];
                page.drawText(`$ ${item.valor}`, {x: currentX + 5, y: currentY - 14, font, fontSize: 10});
                currentX += invoiceTableCols[2];
                page.drawText(`$ ${item.total}`, {x: currentX + 5, y: currentY - 14, font, fontSize: 10});
                currentY -= 20;
            });
            
            currentY -= 10;
            page.drawText(`Total: $ ${sumaTotal}`, {x: pageWidth - margin - 150, y: currentY, font: fontBold, fontSize: 14});
            
            drawFooter();
            pages.push(page); // Finaliza página 1

            // === PÁGINAS DE REPORTE ===
            page = createPage();
            currentPage++;
            currentY = pageHeight - margin;
            ids = [];
            let counter = 1;

            drawHeader();

            currentY -= 40;
            page.drawText('INFORME DE PODOLOGÍA', { x: margin, y: currentY, font: fontBold, fontSize: 18, color: mainTextColor });
            
            // Info del reporte
            currentY -= 30;
            page.drawText(`Finca: ${finca}`, { x: margin, y: currentY, font, fontSize: 11 });
            page.drawText(`Ubicación: ${lugar}`, { x: margin + contentWidth/2, y: currentY, font, fontSize: 11 });

            const animalTableCols = [40, 80, 80, 120, 90, contentWidth - 410];
            const drawAnimalTableHeader = () => {
                let x = margin;
                page.drawRectangle({x: margin, y: currentY - 25, width: contentWidth, height: 25, color: '#EAEAEA'});
                page.drawText('#', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                x += animalTableCols[0];
                page.drawText('ID-Animal', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                x += animalTableCols[1];
                page.drawText('Extremidad', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                x += animalTableCols[2];
                page.drawText('Descripción', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                x += animalTableCols[3];
                page.drawText('Observación', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                x += animalTableCols[4];
                page.drawText('Tratamiento', {x: x + 5, y: currentY - 17, font: fontBold, fontSize: 9});
                currentY -= 25;
            };
            
            currentY -= 30;

            for (const sala of uniqueSalas) {
                checkY(50); // Espacio para título de sala y header de tabla
                page.drawText(sala, {x: margin, y: currentY, font: fontBold, fontSize: 14});
                currentY -= 25;
                
                drawAnimalTableHeader();

                const vacasEnSala = report.filter(vaca => vaca.sala === sala);
                for(const vaca of vacasEnSala) {
                    const numero = verifyId(vaca.nombre_vaca, counter);
                    if (numero !== '') counter++;

                    const lines = {
                        descripcion: wrapText(vaca.enfermedades || '', animalTableCols[3] - 10, font, 8),
                        observacion: wrapText(vaca.nota || '', animalTableCols[4] - 10, font, 8),
                        tratamiento: wrapText(vaca.tratamiento || '', animalTableCols[5] - 10, font, 8),
                    };

                    const rowHeight = Math.max(lines.descripcion.length, lines.observacion.length, lines.tratamiento.length) * 12 + 8;
                    
                    checkY(rowHeight);

                    let x = margin;
                    const yBaseline = currentY - 6;

                    page.drawText(numero, {x: x + 5, y: yBaseline - 5, font, fontSize: 8});
                    x += animalTableCols[0];
                    page.drawText(vaca.nombre_vaca, {x: x + 5, y: yBaseline - 5, font, fontSize: 8});
                    x += animalTableCols[1];
                    page.drawText(convertExtremidad(vaca.extremidad), {x: x + 5, y: yBaseline - 5, font, fontSize: 8});
                    x += animalTableCols[2];
                    
                    let lineY = yBaseline;
                    lines.descripcion.forEach(line => {
                         page.drawText(line, {x: x + 5, y: lineY, font, fontSize: 8});
                         lineY -= 12;
                    });
                    x += animalTableCols[3];
                    
                    lineY = yBaseline;
                    lines.observacion.forEach(line => {
                         page.drawText(line, {x: x + 5, y: lineY, font, fontSize: 8});
                         lineY -= 12;
                    });
                    x += animalTableCols[4];
                    
                    lineY = yBaseline;
                    lines.tratamiento.forEach(line => {
                         page.drawText(line, {x: x + 5, y: lineY, font, fontSize: 8});
                         lineY -= 12;
                    });
                    
                    currentY -= rowHeight;
                    page.drawLine({
                        start: { x: margin, y: currentY },
                        end: { x: margin + contentWidth, y: currentY },
                        thickness: 0.5,
                        color: '#EAEAEA'
                    });
                }
            }
            
            drawFooter();
            pages.push(page); // Finaliza última página

            // Crear el documento PDF
            const pdfDoc = await PDFDocument.create(pdfPath);
            pages.forEach(p => pdfDoc.addPage(p));
            await pdfDoc.write();
                
            await shareAsync(pdfPath, { UTI: '.pdf', mimeType: 'application/pdf' });

        } catch (error) {
            console.error('Error generando PDF nativo:', error);
            Alert.alert('Error', `No se pudo generar el PDF: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.button, isGenerating && styles.disabledButton]}
                onPress={generatePdfNatively}
                disabled={isGenerating}>
                <StyledText fontSize='subheading' style={{ color: '#fff' }}>
                    {isGenerating ? 'Generando PDF profesional...' : '🚀 Generar Factura y Reporte'}
                </StyledText>
            </TouchableOpacity>
            
            <DocsReport {...{ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    button: {
        backgroundColor: '#0d47a1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    disabledButton: {
        backgroundColor: '#9e9e9e',
    }
});