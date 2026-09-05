import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Button, Text, Icon } from '../ui';
import theme from '../theme';

const DocsReport = ({ finca, direccion, cliente, lugar, totalCuenta, listaVacas, fechaHoyFormateada, nit, tel, sumaTotal, report, users }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected);
      } catch (error) {
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
      <Button
        title="Generar factura + informe en Google Docs"
        icon="logo-google"
        size="lg"
        variant="secondary"
        fullWidth
        loading={isLoading}
        disabled={!isConnected || isLoading}
        onPress={handleGenerateDocs}
      />
      {!isConnected && (
        <View style={styles.offline}>
          <Icon name="cloud-offline-outline" size={16} color={theme.colors.accent} />
          <Text variant="caption" style={{ marginLeft: 8, flex: 1, color: theme.colors.accent }}>Sin conexión a internet. Este documento requiere conexión.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  offline: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.accentSoft, borderRadius: theme.radius.md, padding: 12, marginTop: 10 },
});

export default DocsReport;
