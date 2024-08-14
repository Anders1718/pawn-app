import React, { useState } from 'react';
import { View, Platform, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StyledText from './StyledText';

const DateRangePicker = ({ startDate, endDate, setEndDate, setStartDate, setHabilitado }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChangeStart = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate);
      setHabilitado(true);
    }
    setShowStartPicker(false);
  };

  const onChangeEnd = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || endDate;
      if (currentDate < startDate) {
        setHabilitado(false);
        alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      } else {
        setEndDate(currentDate);
        setHabilitado(true);
      }
    }
    setShowEndPicker(false);
  };

  return (
    <View style={{ alignItems: 'center' }}>
        <Button onPress={() => setShowStartPicker(true)} title="Seleccionar Fecha de Inicio" />
        {showStartPicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStart}
            themeVariant="dark"
          />
        )}
        <StyledText fontWeight='bold' fontSize='subheading' style={styles.label}>
          Fecha de inicio seleccionada: {startDate.toLocaleDateString()}
        </StyledText>
        
        <Button onPress={() => setShowEndPicker(true)} title="Seleccionar Fecha de Fin" />
        {showEndPicker && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEnd}
            themeVariant="dark"
          />
        )}
        <StyledText fontWeight='bold' fontSize='subheading' style={styles.label}>
          Fecha de fin seleccionada: {endDate.toLocaleDateString()}
        </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    label: {
        marginTop: 10,
    }
});

export default DateRangePicker;
