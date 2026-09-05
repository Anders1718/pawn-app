import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import paths from './hoofpaths';
import { Chip, Text, useResponsive } from '../ui';
import theme from '../theme';

// Bottom view of the hoof. Tapping a zone toggles it; the Lateral/Medial
// chips toggle the side. Logic is unchanged from the previous version.
const Hoof = ({ numberPawnSave, setNumberPawnSave, idPaw, setNumberPawnPart, setPawnSide, pawnSide = [], modificarPosicion, width }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [colors, setColors] = useState(Array(paths.length).fill(theme.colors.hoof));
  const { innerWidth, isTablet } = useResponsive();

  const size = width || Math.min(innerWidth - 32, isTablet ? 440 : 340);
  const height = Math.round(size * 600 / 612);

  const toggleString = (str, setVal) => {
    setVal((prevState) => {
      if (prevState.includes(str)) {
        return prevState.filter(item => item !== str);
      } else {
        return [...prevState, str];
      }
    });
  };

  const selectSide = (pata) => {
    setPawnSide((prevState) => {
      if (prevState.includes(pata)) {
        return prevState.filter(item => item !== pata);
      } else {
        return [...prevState, pata];
      }
    });
  }

  const handlePress = async (index, pathData) => {
    if (index >= paths.length - 2) return;
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

  const zonesSelected = colors.filter(c => c === theme.colors.hoofSelected).length;

  return (
    <View style={styles.container}>
      <View style={[styles.sides, { width: size }]}>
        <Chip label="Lateral" icon="arrow-back" tone="accent" size="md" selected={pawnSide.includes('Lateral')} onPress={() => selectSide('Lateral')} />
        <Text variant="caption" align="center" style={{ flex: 1 }}>Vista inferior</Text>
        <Chip label="Medial" icon="arrow-forward" tone="accent" size="md" selected={pawnSide.includes('Medial')} onPress={() => selectSide('Medial')} />
      </View>
      <Svg height={height} width={size} viewBox="0 0 612 600">
        <G>
          {paths.map((pathData, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePress(index, pathData)}
              disabled={index >= paths.length - 2}
            >
              <G>
                <Path d={pathData.d} fill={colors[index]} stroke={theme.colors.bg} strokeWidth="2" strokeLinejoin="round" />
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
      <Text variant="caption" align="center">
        {selectedZone !== null ? `Última zona: ${paths[selectedZone].name} · ${zonesSelected} seleccionada${zonesSelected === 1 ? '' : 's'}` : 'Toca las zonas afectadas'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  sides: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
});

export default Hoof;
