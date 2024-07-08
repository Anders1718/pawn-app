export const initialValuePrice = (preventivosCount, terapeuticosCount, name) => {

    if (preventivosCount > 0 && terapeuticosCount > 0) {
        return {
            cantidadPreventivos: preventivosCount,
            descripcionPreventivos: name[1],
            valorPreventivos: '',
            cantidadTerapeuticos: terapeuticosCount,
            descripcionTerapeuticos: name[0],
            valorTerapeuticos: ''
        }
    } else if (preventivosCount > 0) {
        return {
            cantidadPreventivos: preventivosCount,
            descripcionPreventivos: name[1],
            valorPreventivos: '',
            cantidadTerapeuticos: terapeuticosCount,
            descripcionTerapeuticos: name[0],
            valorTerapeuticos: 0,
        }
    } else if (terapeuticosCount > 0) {
        return {
            cantidadPreventivos: preventivosCount,
            descripcionPreventivos: name[1],
            valorPreventivos: 0,
            cantidadTerapeuticos: terapeuticosCount,
            descripcionTerapeuticos: name[0],
            valorTerapeuticos: ''
        }
    }
}