import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
// import paths from './hoofpaths'; // Importa las rutas de los `Path`
import paths from './hoofpaths2'; // Importa las rutas de los `Path`
const HoofSideUp = ({numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart}) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill("#D2B48C"));

  const handlePress = (index, pathData) => {
    if (index >= 3) return; // Evita la selección para los dos últimos paths
    const newColors = Array(paths.length).fill("#D2B48C");
    // Select the new element
    newColors[index] = "#FF6347";
    setColors(newColors);
    setSelectedZone(index);
    if (setNumberPawnPart) {
      updateArrayAtPosition(idPaw, pathData.name, setNumberPawnSave, numberPawnSave)
      setNumberPawnPart(pathData.name)
    }
  };

  const updateArrayAtPosition = (index, newValue, setArray, actualArray) => {

    // Hacemos una copia del array actual
    const newArray = [...actualArray];
    // Modificamos el valor en la posición especificada
    newArray[index] = newValue;
    // Actualizamos el estado con el array modificado
    setArray(newArray);
  };

  return (
    <View style={styles.container}>
      <Svg height="400" width="350" viewBox="0 0 1024 480">
        <G>
          {paths.map((pathData, index) => (
            <TouchableWithoutFeedback 
              key={index} 
              onPress={() => handlePress(index, pathData)}
              disabled={index >= 3} // Deshabilita la selección para los dos últimos paths
            >
              <G>
                <Path d={pathData.d} fill={colors[index]} />
                {index < 3 && (
                  <>
                    <Path d={pathData.d} fill="transparent" stroke="transparent" strokeWidth="20" />
                    <Circle cx={pathData.cx} cy={pathData.cy} r="35" fill="transparent" />
                  </>
                )}
              </G>
            </TouchableWithoutFeedback>
          ))}
        </G>
      </Svg>
      {selectedZone !== null && (
        <Text style={styles.selectedText}>
          {`Seleccionado: ${paths[selectedZone].name}`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    marginTop: 0,
    fontSize: 18,
    color: 'white',
  },
});

export default HoofSideUp;
