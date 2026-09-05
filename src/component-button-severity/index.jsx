import React, { useEffect } from "react";
import Card from "./card/Card";
import OptionGrid from "../ui/OptionGrid";

const ComponentButtonSeverity =
    ({
        title,
        icon,
        subtitle,
        options,
        idPaw,
        setIdPaw,
        modificarPosicion,
        setPawn,
        setNumberPawnPart,
        optionsSelectedSave,
        numberPawnSave,
        setNumberPawnSave,
        setNumberSeveritySave,
        numberSeveritySave,
        setSeverity,
        severity,
        size = 'lg',
        tone = 'accent',
    }) => {

        const [cardSelected, setCardSelected] = React.useState(null);

        useEffect(() => {
            modificarPosicion(idPaw - 1, '');
        }, [severity])

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

        const toggleStringSeverity = (str) => {
            setSeverity((prevState) => {
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
                                setCardSelected(index);
                            }
                            if (setNumberSeveritySave) {
                                toggleStringSeverity(repo.value);
                                updateArrayAtPosition(idPaw - 1, repo.number, setNumberSeveritySave, numberSeveritySave);
                            }
                        }}
                    >
                        {repo.label}
                    </Card>)
                }}
            />
        );
    }

export default ComponentButtonSeverity;
