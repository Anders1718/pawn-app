import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import paths from './hoofpaths'; // Importa las rutas de los `Path`

const Hoof = ({ numberPawnSave, optionsSelectedSave, setNumberPawnSave, idPaw, setNumberPawnPart, numberPawnPart, setContadorBotones, contadorBotones }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill("#D2B48C"));

  const handlePress = (index, pathData) => {
    if (index >= paths.length - 2) return; // Evita la selección para los dos últimos paths
    const newColors = [...colors];
    newColors[index] = newColors[index] === "#D2B48C" ? "#FF6347" : "#D2B48C";
    setColors(newColors);
    setSelectedZone(index);
    if (setNumberPawnPart) {
      updateArrayAtPosition(idPaw, pathData.name, setNumberPawnSave, numberPawnSave)
      setNumberPawnPart(pathData.name)
      setContadorBotones(contadorBotones + 1);
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
      <Svg height="350" width="350" viewBox="0 0 612 792">
        <G>
          {paths.map((pathData, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePress(index, pathData)}
              disabled={index >= paths.length - 2} // Deshabilita la selección para los dos últimos paths
            >
              <G>
                <Path d={pathData.d} fill={colors[index]} />
                {index < paths.length - 2 && (
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

export default Hoof;
