export const initialValuePrice = (preventivosCount, terapeuticosCount, revisionCount, name) => {

    const preventivo = {
        cantidadPreventivos: preventivosCount,
        descripcionPreventivos: name[1],
        valorPreventivos: '',
    }

    const terapeutico = {
        cantidadTerapeuticos: terapeuticosCount,
        descripcionTerapeuticos: name[0],
        valorTerapeuticos: '',
    }

    const revision = {
        cantidadRevision: revisionCount,
        descripcionRevision: name[2],
        valorRevision: '',
    }

    const desplazamiento = {
        cantidadDesplazamiento: 1,
        descripcionDesplazamiento: 'Desplazamiento',
        valorDesplazamiento: '',
    }

    let retorno = {
        ...desplazamiento,
    }

    if (preventivosCount > 0) {
        retorno = {
            ...retorno,
            ...preventivo,
        }
    } else {
        preventivo.valorPreventivos = 10000
        retorno = {
            ...retorno,
            ...preventivo,
        }
    }

    if (terapeuticosCount > 0) {
        retorno = {
            ...retorno,
            ...terapeutico,
        }
    }else {
        terapeutico.valorTerapeuticos = 10000;
        retorno = {
            ...retorno,
            ...terapeutico,
        }
    }

    if (revisionCount > 0) {
        retorno = {
            ...retorno,
            ...revision,
        }
    } else {
        revision.valorRevision = 10000;
        retorno = {
            ...retorno,
            ...revision,
        }
    }

    return retorno ;
}