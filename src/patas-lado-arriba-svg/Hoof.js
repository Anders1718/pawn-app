import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import paths from './hoofpaths2';
import { Text, useResponsive } from '../ui';
import theme from '../theme';

// Upper side view. Only the first three paths are selectable.
const HoofSideUp = ({ numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart, modificarPosicion, width }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill(theme.colors.hoof));
  const { innerWidth, isTablet } = useResponsive();

  const w = width || Math.min((innerWidth - 44) / 2, isTablet ? 300 : 200);
  const h = Math.round(w * 720 / 1024);

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
    if (index >= 3) return;
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
      <Text variant="caption" style={styles.label}>Vista superior</Text>
      <Svg height={h} width={w} viewBox="0 0 1024 720">
        <G>
          {paths.map((pathData, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePress(index, pathData)}
              disabled={index >= 3}
            >
              <G>
                <Path d={pathData.d} fill={colors[index]} stroke={theme.colors.bg} strokeWidth="2" strokeLinejoin="round" />
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
      <Text variant="caption" align="center">{selectedZone !== null ? `Zona ${paths[selectedZone].name}` : ' '}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  label: { marginBottom: 6 },
});

export default HoofSideUp;
