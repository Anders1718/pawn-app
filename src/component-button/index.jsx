import * as React from "react";
import Card from "./card/Card";
import OptionGrid from "../ui/OptionGrid";

const ComponentButton =
    ({
        title,
        icon,
        subtitle,
        options,
        idPaw,
        setIdPaw,
        modificarPosicion,
        setPawn,
        setFirstPartSick,
        setSecondPartSick,
        modificarPosicionSick,
        setNumberPawnPart,
        numberPawnPart,
        optionsSelectedSave,
        numberPawnSave,
        numberSickSave,
        numberTratSave,
        numberSeverSave,
        setNumberPawnSave,
        setNumberSickSave,
        setNumberTratSave,
        setNumberSeverSave,
        cardSelected,
        setCardSelected,
        handleLongPress,
        onAdd,
        size = 'lg',
        tone = 'primary',
        stretch = false,
        right,
    }) => {

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

        const toggleString = (str) => {
            setSecondPartSick((prevState) => {
                if (prevState.includes(str)) {
                    return prevState.filter(item => item !== str);
                } else {
                    return [...prevState, str];
                }
            });
        };

        return (
            <OptionGrid
                title={title}
                icon={icon}
                subtitle={subtitle}
                items={options}
                onAdd={onAdd}
                stretch={stretch}
                right={right}
                renderChip={(repo, index) => {
                    let isTurnedOver = false;
                    if (optionsSelectedSave) {
                        isTurnedOver = optionsSelectedSave[idPaw - 1].indexOf(repo.number) !== -1 ? true : false;
                    } else {
                        isTurnedOver = cardSelected === index;
                    }
                    return (<Card
                        size={size}
                        tone={tone}
                        isTurnedOver={isTurnedOver}
                        handleLongPress={handleLongPress ? () => handleLongPress({ ...repo }) : undefined}
                        onPress={() => {
                            if (setNumberPawnPart) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberPawnSave, numberPawnSave)
                                setNumberPawnPart(repo.label)
                            }
                            if (setPawn) {
                                setPawn(repo.label)
                                setIdPaw(repo.value)
                            }
                            if (!optionsSelectedSave) {
                                if (cardSelected === index) {
                                    setCardSelected(-1)
                                } else {
                                    setCardSelected(index);
                                }
                            }
                            if (setSecondPartSick) {
                                toggleString(repo.value);
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberTratSave, numberTratSave)
                            } if (setFirstPartSick) {
                                setFirstPartSick((prevState) => {
                                    const arr = Array.isArray(prevState) ? prevState : [];
                                    return arr.includes(repo.value)
                                        ? arr.filter((item) => item !== repo.value)
                                        : [...arr, repo.value];
                                });
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberSickSave, numberSickSave)
                            }
                            if (modificarPosicion) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberSeverSave, numberSeverSave)
                                modificarPosicion(idPaw - 1, repo.value);
                            }
                        }}
                    >
                        {repo.label}
                    </Card>)
                }}
            />
        );
    }

export default ComponentButton;
