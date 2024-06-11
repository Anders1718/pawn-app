import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { "label": "Sin enfermedad", "value": "Free" },
  { "label": "abscess (white line)", "value": "A" },
  { "label": "bruise (white line hemorrhage)", "value": "B" },
  { "label": "corn (interdigital hyperplasia)", "value": "C" },
  { "label": "digital dermatitis (heel wart)", "value": "D" },
  { "label": "erosion (heel horn)", "value": "E" },
  { "label": "foot rot (phlegmon)", "value": "F" },
  { "label": "deep digital sepsis", "value": "G" },
  { "label": "hemorrhage (sole)", "value": "H" },
  { "label": "imbalance", "value": "I" },
  { "label": "rotated P3 (corkscrew)", "value": "R" },
  { "label": "sole fracture (heel ulcer)", "value": "S" },
  { "label": "toe ulcer", "value": "T" },
  { "label": "ulcer (sole)", "value": "U" },
  { "label": "vertical fissure (sand crack)", "value": "V" },
  { "label": "hairy attack", "value": "W" },
  { "label": "axial fissure", "value": "X" },
  { "label": "horizontal fissure", "value": "Y" },
  { "label": "thin soles", "value": "Z" },
  { "label": "block", "value": "K" },
  { "label": "wrapped lesion", "value": "O" }
];

const DropdownComponent = ({ onChange }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Lista enfermedades
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Seleccione la enfermedad' : 'Seleccione'}
        searchPlaceholder="Buscar..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
      // renderLeftIcon={() => (
      //   <AntDesign
      //     style={styles.icon}
      //     color={isFocus ? 'blue' : 'black'}
      //     name="Safety"
      //     size={20}
      //   />
      // )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'flex-end'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    // paddingHorizontal: 100,
    alignItems: 'flex-end'
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});