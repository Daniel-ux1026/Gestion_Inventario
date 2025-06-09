// js/utils/validators.js
// Funciones de validación para formularios

const validators = {
    /**
     * Validaciones básicas
     */
    required: (valor, mensaje = 'Este campo es obligatorio') => {
        if (valor === null || valor === undefined || valor === '') {
            return { valid: false, message: mensaje };
        }
        if (typeof valor === 'string' && valor.trim() === '') {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar longitud mínima
     */
    minLength: (valor, minimo, mensaje) => {
        if (!valor) return { valid: true }; // Si está vacío, lo maneja required

        if (valor.length < minimo) {
            return {
                valid: false,
                message: mensaje || `Debe tener al menos ${minimo} caracteres`
            };
        }
        return { valid: true };
    },

    /**
     * Validar longitud máxima
     */
    maxLength: (valor, maximo, mensaje) => {
        if (!valor) return { valid: true };

        if (valor.length > maximo) {
            return {
                valid: false,
                message: mensaje || `No puede exceder ${maximo} caracteres`
            };
        }
        return { valid: true };
    },

    /**
     * Validar email
     */
    email: (valor, mensaje = 'El formato del correo no es válido') => {
        if (!valor) return { valid: true };

        if (!CONSTANTS.PATRONES.EMAIL.test(valor)) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar DNI peruano
     */
    dni: (valor, mensaje = 'El DNI debe tener exactamente 8 dígitos') => {
        if (!valor) return { valid: true };

        if (!CONSTANTS.PATRONES.DNI.test(valor)) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar teléfono peruano
     */
    telefono: (valor, mensaje = 'El teléfono debe tener exactamente 9 dígitos') => {
        if (!valor) return { valid: true };

        if (!CONSTANTS.PATRONES.TELEFONO.test(valor)) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar números enteros
     */
    integer: (valor, mensaje = 'Debe ser un número entero') => {
        if (!valor && valor !== 0) return { valid: true };

        if (!Number.isInteger(Number(valor))) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar números decimales
     */
    decimal: (valor, mensaje = 'Debe ser un número válido') => {
        if (!valor && valor !== 0) return { valid: true };

        if (isNaN(Number(valor))) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar valor mínimo
     */
    min: (valor, minimo, mensaje) => {
        if (!valor && valor !== 0) return { valid: true };

        if (Number(valor) < minimo) {
            return {
                valid: false,
                message: mensaje || `El valor mínimo es ${minimo}`
            };
        }
        return { valid: true };
    },

    /**
     * Validar valor máximo
     */
    max: (valor, maximo, mensaje) => {
        if (!valor && valor !== 0) return { valid: true };

        if (Number(valor) > maximo) {
            return {
                valid: false,
                message: mensaje || `El valor máximo es ${maximo}`
            };
        }
        return { valid: true };
    },

    /**
     * Validar que sea un número positivo
     */
    positive: (valor, mensaje = 'Debe ser un número positivo') => {
        if (!valor && valor !== 0) return { valid: true };

        if (Number(valor) <= 0) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar contraseña segura
     */
    password: (valor, mensaje = 'La contraseña debe tener al menos 6 caracteres') => {
        if (!valor) return { valid: true };

        if (valor.length < CONSTANTS.VALIDACIONES.PASSWORD_MIN_LENGTH) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar que dos valores coincidan
     */
    match: (valor1, valor2, mensaje = 'Los valores no coinciden') => {
        if (valor1 !== valor2) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar código de producto
     */
    codigoProducto: (valor, mensaje = 'El código solo puede contener letras, números, guiones y guiones bajos') => {
        if (!valor) return { valid: true };

        if (!CONSTANTS.PATRONES.CODIGO_PRODUCTO.test(valor)) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar fecha
     */
    fecha: (valor, mensaje = 'Formato de fecha inválido') => {
        if (!valor) return { valid: true };

        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar fecha futura
     */
    fechaFutura: (valor, mensaje = 'La fecha debe ser futura') => {
        if (!valor) return { valid: true };

        const fecha = new Date(valor);
        const hoy = new Date();

        if (fecha <= hoy) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    },

    /**
     * Validar fecha pasada
     */
    fechaPasada: (valor, mensaje = 'La fecha debe ser pasada') => {
        if (!valor) return { valid: true };

        const fecha = new Date(valor);
        const hoy = new Date();

        if (fecha >= hoy) {
            return { valid: false, message: mensaje };
        }
        return { valid: true };
    }
};

/**
 * Validador de formularios
 */
const FormValidator = {
    /**
     * Validar un campo con múltiples reglas
     */
    validateField: (valor, reglas) => {
        for (const regla of reglas) {
            const resultado = regla(valor);
            if (!resultado.valid) {
                return resultado;
            }
        }
        return { valid: true };
    },

    /**
     * Validar formulario completo
     */
    validateForm: (datos, esquema) => {
        const errores = {};
        let esValido = true;

        for (const campo in esquema) {
            const valor = datos[campo];
            const reglas = esquema[campo];

            const resultado = FormValidator.validateField(valor, reglas);
            if (!resultado.valid) {
                errores[campo] = resultado.message;
                esValido = false;
            }
        }

        return {
            valid: esValido,
            errors: errores
        };
    },

    /**
     * Crear reglas de validación comunes
     */
    rules: {
        // Usuario
        nombre: [
            validators.required,
            (valor) => validators.maxLength(valor, 30),
            (valor) => CONSTANTS.PATRONES.SOLO_LETRAS.test(valor) ?
                { valid: true } :
                { valid: false, message: 'Solo se permiten letras' }
        ],

        apellido: [
            validators.required,
            (valor) => validators.maxLength(valor, 50),
            (valor) => CONSTANTS.PATRONES.SOLO_LETRAS.test(valor) ?
                { valid: true } :
                { valid: false, message: 'Solo se permiten letras' }
        ],

        dni: [
            validators.required,
            validators.dni
        ],

        telefono: [
            validators.required,
            validators.telefono
        ],

        correo: [
            validators.required,
            validators.email
        ],

        contrasenia: [
            validators.required,
            validators.password
        ],

        // Producto
        codigoProducto: [
            validators.required,
            (valor) => validators.maxLength(valor, 50),
            validators.codigoProducto
        ],

        nombreProducto: [
            validators.required,
            (valor) => validators.maxLength(valor, 70)
        ],

        presentacion: [
            validators.required,
            (valor) => validators.maxLength(valor, 90)
        ],

        precio: [
            validators.required,
            validators.decimal,
            validators.positive
        ],

        stock: [
            validators.required,
            validators.integer,
            (valor) => validators.min(valor, 0, 'El stock no puede ser negativo')
        ],

        // Venta
        cantidad: [
            validators.required,
            validators.integer,
            validators.positive
        ],

        precioUnitario: [
            validators.required,
            validators.decimal,
            validators.positive
        ]
    }
};

/**
 * Hook personalizado para validación en tiempo real
 */
const useFormValidation = (initialData, validationSchema) => {
    const [data, setData] = React.useState(initialData);
    const [errors, setErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});

    const validateField = (name, value) => {
        if (validationSchema[name]) {
            const result = FormValidator.validateField(value, validationSchema[name]);
            setErrors(prev => ({
                ...prev,
                [name]: result.valid ? null : result.message
            }));
            return result.valid;
        }
        return true;
    };

    const validateForm = () => {
        const result = FormValidator.validateForm(data, validationSchema);
        setErrors(result.errors);
        return result.valid;
    };

    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, data[name]);
    };

    const reset = () => {
        setData(initialData);
        setErrors({});
        setTouched({});
    };

    return {
        data,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        validateField,
        reset,
        isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
    };
};

/**
 * Esquemas de validación predefinidos
 */
const validationSchemas = {
    usuario: {
        nombre: FormValidator.rules.nombre,
        apellido: FormValidator.rules.apellido,
        dni: FormValidator.rules.dni,
        telefono: FormValidator.rules.telefono,
        correo: FormValidator.rules.correo,
        contrasenia: FormValidator.rules.contrasenia
    },

    usuarioEditar: {
        nombre: FormValidator.rules.nombre,
        apellido: FormValidator.rules.apellido,
        dni: FormValidator.rules.dni,
        telefono: FormValidator.rules.telefono,
        correo: FormValidator.rules.correo
        // Sin contraseña requerida para edición
    },

    producto: {
        codigo: FormValidator.rules.codigoProducto,
        nombre: FormValidator.rules.nombreProducto,
        presentacion: FormValidator.rules.presentacion,
        precioCompra: FormValidator.rules.precio,
        precioVenta: FormValidator.rules.precio,
        stock: FormValidator.rules.stock
    },

    detalleVenta: {
        cantidad: FormValidator.rules.cantidad,
        precioUnitario: FormValidator.rules.precioUnitario
    },

    login: {
        correo: [validators.required, validators.email],
        contrasenia: [validators.required]
    },

    cambiarContrasenia: {
        contraseniaActual: [validators.required],
        nuevaContrasenia: FormValidator.rules.contrasenia,
        confirmarContrasenia: [validators.required]
    }
};

/**
 * Función para validar cambio de contraseña
 */
const validatePasswordChange = (data) => {
    const baseValidation = FormValidator.validateForm(data, validationSchemas.cambiarContrasenia);

    // Validar que las contraseñas coincidan
    const passwordMatch = validators.match(
        data.nuevaContrasenia,
        data.confirmarContrasenia,
        'Las contraseñas no coinciden'
    );

    if (!passwordMatch.valid) {
        baseValidation.valid = false;
        baseValidation.errors.confirmarContrasenia = passwordMatch.message;
    }

    return baseValidation;
};

// Exportar para uso global
window.validators = validators;
window.FormValidator = FormValidator;
window.useFormValidation = useFormValidation;
window.validationSchemas = validationSchemas;
window.validatePasswordChange = validatePasswordChange;