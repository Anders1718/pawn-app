import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import paths from './hoofpaths';
// Importa las rutas de los `Path`
import StyledText from '../components/StyledText';
import { useWindowDimensions } from 'react-native';

const useOrientation = () => {
  const { width, height } = useWindowDimensions();
  const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
  return orientation;
};

const Hoof = ({ numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart, setPawnSide, pawnSide, modificarPosicion }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill("#D2B48C"));

  const [colorSide, setColorSide] = useState(['snow', 'snow']);

  const toggleString = (str, setVal) => {
    setVal((prevState) => {
      if (prevState.includes(str)) {
        return prevState.filter(item => item !== str);
      } else {
        return [...prevState, str];
      }
    });
  };

  const selectSide = (pata, index) => {

    const updatedColorSide = [...colorSide];

    setPawnSide((prevState) => {
      if (prevState.includes(pata)) {
        updatedColorSide[index] = 'snow';
        setColorSide(updatedColorSide);
        return prevState.filter(item => item !== pata);
      } else {
        updatedColorSide[index] = 'red';
        setColorSide(updatedColorSide);
        return [...prevState, pata];
      }
    });
  }

  const handlePress = async (index, pathData) => {
    if (index >= paths.length - 2) return; // Evita la selección para los dos últimos paths
    // Deselect all elements first
    const newColors = [...colors];
    // Select the new element
    newColors[index] = newColors[index] === "#D2B48C" ? "#FF6347" : "#D2B48C";
    setColors(newColors);
    setSelectedZone(index);
    if (setNumberPawnPart) {
      updateArrayAtPosition(idPaw, pathData.name, setNumberPawnSave, numberPawnSave)
      toggleString(pathData.name, setNumberPawnPart)
      modificarPosicion(idPaw - 1, pathData.name)
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

  const orientation = useOrientation();

  const svgDimensions = orientation === 'LANDSCAPE' 
    ? { width: 550, height: 550 } 
    : { width: 350, height: 350 };


  return (
    <View style={styles.container}>
      <View style={styles.hoof}>
        <TouchableWithoutFeedback
          onPress={() => selectSide('Lateral', 0)}
        >
          <StyledText style={{color: colorSide[0]}} fontSize='title'>Lateral</StyledText>
        </TouchableWithoutFeedback>
        <Svg height={svgDimensions.height} width={svgDimensions.width} viewBox="0 0 612 792">
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
        <TouchableWithoutFeedback
          onPress={() => selectSide('Medial', 1)}
        >
          <StyledText style={{color: colorSide[1]}} fontSize='title'>Medial</StyledText>
        </TouchableWithoutFeedback>
      </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20, // Ajusta este valor según necesites
    height: '15%', // Ajusta este porcentaje para recortar desde abajo
  },
  hoof: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  svgWrapper: {
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
