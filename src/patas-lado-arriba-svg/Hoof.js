import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
// import paths from './hoofpaths'; // Importa las rutas de los `Path`
import paths from './hoofpaths2'; // Importa las rutas de los `Path`
const HoofSideUp = ({ numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill("#D2B48C"));

  const toggleString = (str, setVal) => {
    setVal((prevState) => {
      if (prevState.includes(str)) {
        return prevState.filter(item => item !== str);
      } else {
        return [...prevState, str];
      }
    });
  };

  const handlePress = (index, pathData) => {
    if (index >= 3) return; // Evita la selección para los dos últimos paths
    const newColors = [...colors];
    // Select the new element
    newColors[index] = newColors[index] === "#D2B48C" ? "#FF6347" : "#D2B48C";
    setColors(newColors);
    setSelectedZone(index);
    if (setNumberPawnPart) {
      updateArrayAtPosition(idPaw, pathData.name, setNumberPawnSave, numberPawnSave)
      toggleString(pathData.name, setNumberPawnPart)
    }
  };

  const updateArrayAtPosition = (index, newValue, setArray, actualArray) => {
    const newArray = [...actualArray];

    const arrayPoscion = actualArray[index]

    const itemsArray = actualArray[index].indexOf(newValue);

    if (itemsArray === -1) {
      // Si el elemento no existe en el array, añadirlo
      arrayPoscion.push(newValue);
    } else {
      // Si el elemento existe en el array, eliminarlo
      arrayPoscion.splice(itemsArray, 1);
    }

    // Modificamos el valor en la posición especificada
    newArray[index] = arrayPoscion;
    // Actualizamos el estado con el array modificado
    setArray(newArray);
  };

  return (
    <View style={styles.container}>
      <Svg height="250" width="250" viewBox="0 0 1024 800">
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
