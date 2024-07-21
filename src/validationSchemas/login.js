import * as yup from 'yup'


export const loginValidationSchema = yup.object().shape({
    sick: yup
        .string()
        .required('Debe seleccionar una de las opciones'),
})

export const farmValidation = yup.object().shape({
    finca: yup
        .string()
        .required('Email es requerida'),
    nombre: yup
        .string()
        .required('Password es requerida'),
    nit: yup
        .string()
        .required('Email es requerida'),
    tel: yup
        .string()
        .required('Password es requerida'),
    ubicacion: yup
        .string()
        .required('Email es requerida'),
})

export const cowValidation = yup.object().shape({
    id: yup
        .string()
        .required('Id es requerido'),
    sala: yup
        .string(),
})

export const enfermedadesValidation = yup.object().shape({
    nombre: yup
        .string()
        .required('Nombre es requerido'),
    id: yup
        .string()
        .required('Identificador es requerido'),
})

export const reportValidation = yup.object().shape({
    fechaInicio: yup
        .string()
        .required('Fecha de inicio es requerida'),
    fechaFin: yup
        .string()
        .required('Fecha de fin es requerida'),
});

export const precioValidation = yup.object().shape({
    cantidadPreventivos: yup
        .number()
        .required('Campo requerido'),
    descripcionPreventivos: yup
        .string()
        .required('Campo requerido'),
    cantidadTerapeuticos: yup
        .number()
        .required('Campo requerido'),
    descripcionTerapeuticos: yup
        .string()
        .required('Campo requerido'),
    valorPreventivos: yup
        .number()
        .required('Campo requerido'),
    valorTerapeuticos: yup
        .number()
        .required('Campo requerido'),
    valorDesplazamiento: yup
        .number()
        .required('Campo requerido'),
    descripcionDesplazamiento: yup
        .string()
        .required('Campo requerido'),
    cantidadDesplazamiento: yup
        .number()
        .required('Campo requerido'),
    valorRevision: yup
        .number()
        .required('Campo requerido'),
    cantidadRevision: yup
        .number()
        .required('Campo requerido'),
    descripcionRevision: yup
        .string()
        .required('Campo requerido'),
})