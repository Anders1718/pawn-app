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
        size = 'lg',
        tone = 'info',
    }) => {

        const [cardSelected, setCardSelected] = React.useState(null);

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
                renderChip={(repo, index) => {
                    let isTurnedOver = false;
                    const numberSearch = index + 1;
                    if (optionsSelectedSave) {
                        isTurnedOver = optionsSelectedSave[idPaw - 1].indexOf(numberSearch) !== -1 ? true : false;
                    } else {
                        isTurnedOver = cardSelected === index;
                    }
                    return (<Card
                        size={size}
                        tone={tone}
                        isTurnedOver={isTurnedOver}
                        onPress={() => {
                            if (setNumberPawnPart) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberPawnSave, numberPawnSave)
                                setNumberPawnPart(repo.label)
                            }
                            if (setPawn) {
                                setPawn(repo.label)
                                setIdPaw(repo.value)
                            }
                            if (cardSelected === index) {
                                setCardSelected(-1)
                            } else {
                                setCardSelected(index)
                            }
                            if (modificarPosicionSick) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberSeverSave, numberSeverSave)
                                modificarPosicionSick(idPaw - 1, true);
                                modificarPosicion(idPaw - 1, repo.value)
                            } else if (setSecondPartSick) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberTratSave, numberTratSave)
                                toggleString(repo.value);
                            } else if (setFirstPartSick) {
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberSickSave, numberSickSave)
                                setFirstPartSick(repo.value)
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
