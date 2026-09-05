import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import paths from './hoofpaths3';
import { Text, useResponsive } from '../ui';
import theme from '../theme';

// Side view. Only the first two paths are selectable.
const HoofSide = ({ numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart, modificarPosicion, width }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill(theme.colors.hoof));
  const { innerWidth, isTablet } = useResponsive();

  const w = width || Math.min((innerWidth - 44) / 2, isTablet ? 300 : 200);
  const h = Math.round(w * 480 / 1024);

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
    if (index >= 2) return;
    const newColors = [...colors];
    newColors[index] = newColors[index] === theme.colors.hoof ? theme.colors.hoofSelected : theme.colors.hoof;
    setColors(newColors);
    setSelectedZone(index);
    if (setNumberPawnPart) {
      updateArrayAtPosition(idPaw - 1, pathData.name, setNumberPawnSave, numberPawnSave)
      toggleString(pathData.name, setNumberPawnPart)
      modificarPosicion(idPaw - 1, pathData.name)
    }
  };

  const updateArrayAtPosition = (index, newValue, setArray, actualArray) => {
    const newArray = [...actualArray];
    const arrayPoscion = actualArray[index]
    const itemsArray = actualArray[index].indexOf(newValue);

    if (itemsArray === -1) {
      arrayPoscion.push(newValue);
    } else {
      arrayPoscion.splice(itemsArray, 1);
    }
    newArray[index] = arrayPoscion;
    setArray(newArray);
  };

  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.label}>Vista lateral</Text>
      <Svg height={h} width={w} viewBox="0 0 1024 480">
        <G>
          {paths.map((pathData, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePress(index, pathData)}
              disabled={index >= 2}
            >
              <G>
                <Path d={pathData.d} fill={colors[index]} stroke={theme.colors.bg} strokeWidth="2" strokeLinejoin="round" />
                {index < 2 && (
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
      <Text variant="caption" align="center">{selectedZone !== null ? `Zona ${paths[selectedZone].name}` : ' '}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: { marginBottom: 6 },
});

export default HoofSide;
