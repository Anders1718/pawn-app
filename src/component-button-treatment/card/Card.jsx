import * as React from "react";
import Chip from "../../ui/Chip";

// Selectable option tile. Presentation lives in the shared Chip; the parent
// decides the selected state.
export default function Card({ onPress, isTurnedOver, children, handleLongPress, size = 'lg', tone = 'primary', style }) {
    return (
        <Chip
            label={children}
            selected={isTurnedOver}
            onPress={onPress}
            onLongPress={handleLongPress}
            size={size}
            tone={tone}
            style={style}
        />
    );
}
