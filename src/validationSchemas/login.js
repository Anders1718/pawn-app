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
        .required('Id es requerido')
})