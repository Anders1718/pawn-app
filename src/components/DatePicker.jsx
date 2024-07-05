import React, { useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StyledText from './StyledText';

const DateRangePicker = ({ startDate, endDate, setEndDate, setStartDate, setHabilitado }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === 'ios');
    setStartDate(currentDate);
    setHabilitado(true);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === 'ios');
    if (currentDate < startDate) {
      setHabilitado(false);
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
    } else {
      setEndDate(currentDate);
      setHabilitado(true);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
        <StyledText fontWeight='bold' fontSize='subheading' style={styles.title}>Seleccione la fecha de inicio</StyledText>
        
        <DateTimePicker
          testID="startDateTimePicker"
          value={startDate}
          mode="date"
          display="default"
          onChange={onChangeStart}
          themeVariant="dark"
        />
        <StyledText fontWeight='bold' fontSize='subheading' style={styles.title}>Seleccione la fecha de fin</StyledText>

        <DateTimePicker
          testID="endDateTimePicker"
          value={endDate}
          mode="date"
          display="default"
          onChange={onChangeEnd}
          themeVariant="dark"
        />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20
    }
});

export default DateRangePicker;
