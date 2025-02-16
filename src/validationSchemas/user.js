import * as yup from 'yup'

export const userValidation = yup.object().shape({
    nombre: yup.string().required('Nombre es requerido'),
    apellido: yup.string().required('Apellido es requerido'),
    profesion: yup.string().required('Profesion es requerida'),
    universidad: yup.string().required('Universidad es requerida'),
    banco: yup.string().required('Banco es requerido'),
    tipoCuenta: yup.string().required('Tipo de cuenta es requerido'),
    numeroCuenta: yup.string().required('Número de cuenta es requerido'),
})
