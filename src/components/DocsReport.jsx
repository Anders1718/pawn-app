import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import StyledText from './StyledText';

const DocsReport = ({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected);
      } catch (error) {
        // In case of error, assume connected and let the request fail
        setIsConnected(true);
      }
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    checkConnectivity();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleGenerateDocs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://contractual.papeleo.co/api/generate-pawn-bill-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          finca,
          direccion,
          cliente,
          lugar,
          totalCuenta,
          listaVacas,
          fechaHoyFormateada,
          nit,
          tel,
          sumaTotal,
          report,
          users,
          nombreDocumento: `Factura y Reporte - ${cliente} - ${fechaHoyFormateada}`
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert(
          'Éxito',
          `Documento creado exitosamente en Google Docs.\nID del Documento: ${result.documentId}`
        );
      } else {
        throw new Error(result.error || 'Ocurrió un error desconocido.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, (!isConnected || isLoading) && styles.disabledButton]}
        onPress={handleGenerateDocs}
        disabled={!isConnected || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <StyledText fontSize='subheading' style={{ fontSize: 25, color: isConnected ? '#fff' : '#a0a0a0' }}>
            Generar en Google Docs
          </StyledText>
        )}
      </TouchableOpacity>
      {!isConnected && (
        <Text style={styles.offlineText}>No hay conexión a internet. El botón está deshabilitado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 8,
  },
  button: {
    borderColor: '#334155',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderWidth: 10,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
    borderColor: '#a9a9a9',
  },
  offlineText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
});

export default DocsReport;
