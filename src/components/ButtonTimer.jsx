import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

const ButtonTimer = ({children, onPress, onPressIn}) => {
  const [timer, setTimer] = useState(null);

  const handlePressIn = () => {
    const timeoutId = setTimeout(() => {
    onPressIn();
    }, 1000); // Tiempo en milisegundos

    setTimer(timeoutId);
  };

  const handlePressOut = () => {

    if (timer) {
      clearTimeout(timer);
    }
  };

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {children}
    </TouchableOpacity>
  );
}

export default ButtonTimer;
