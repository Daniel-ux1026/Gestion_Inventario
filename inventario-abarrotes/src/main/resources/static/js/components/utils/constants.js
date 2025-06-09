// js/utils/constants.js
// Constantes globales de la aplicación

const CONSTANTS = {
    // Roles de usuario
    ROLES: {
        ADMIN: 'ADMIN',
        EMPLEADO: 'EMPLEADO',
        CLIENTE: 'CLIENTE'
    },

    // Estados
    ESTADOS: {
        ACTIVO: true,
        INACTIVO: false
    },

    // Tipos de movimiento de stock
    MOVIMIENTOS_STOCK: {
        ENTRADA: 'ENTRADA',
        SALIDA: 'SALIDA'
    },

    // Límites de stock
    STOCK: {
        MINIMO: 5,
        CRITICO: 1,
        MAXIMO: 1000
    },

    // Validaciones
    VALIDACIONES: {
        DNI_LENGTH: 8,
        TELEFONO_LENGTH: 9,
        PASSWORD_MIN_LENGTH: 6,
        CODIGO_PRODUCTO_MAX_LENGTH: 50,
        NOMBRE_MAX_LENGTH: 100
    },

    // Mensajes de error comunes
    MENSAJES: {
        ERROR_GENERICO: 'Ha ocurrido un error inesperado',
        ERROR_CONEXION: 'Error de conexión con el servidor',
        ERROR_AUTENTICACION: 'Error de autenticación',
        ERROR_AUTORIZACION: 'No tienes permisos para realizar esta acción',
        CAMPOS_REQUERIDOS: 'Por favor, completa todos los campos requeridos',
        OPERACION_EXITOSA: 'Operación realizada exitosamente',
        CONFIRMAR_ELIMINACION: '¿Estás seguro de que deseas eliminar este elemento?',
        CONFIRMAR_ANULACION: '¿Estás seguro de que deseas anular esta venta?'
    },

    // Configuración de paginación
    PAGINACION: {
        ITEMS_POR_PAGINA: 10,
        PAGINAS_VISIBLES: 5
    },

    // Formatos de fecha
    FORMATOS_FECHA: {
        FECHA_CORTA: 'DD/MM/YYYY',
        FECHA_LARGA: 'DD/MM/YYYY HH:mm',
        FECHA_ISO: 'YYYY-MM-DD',
        DATETIME_ISO: 'YYYY-MM-DDTHH:mm:ss'
    },

    // Moneda
    MONEDA: {
        SIMBOLO: '€',
        CODIGO: 'EUR',
        DECIMALES: 2
    },

    // Colores para estados
    COLORES_ESTADO: {
        ACTIVO: 'bg-green-100 text-green-800',
        INACTIVO: 'bg-red-100 text-red-800',
        PENDIENTE: 'bg-yellow-100 text-yellow-800',
        COMPLETADO: 'bg-blue-100 text-blue-800'
    },

    // Colores para roles
    COLORES_ROL: {
        ADMIN: 'bg-purple-100 text-purple-800',
        EMPLEADO: 'bg-blue-100 text-blue-800',
        CLIENTE: 'bg-green-100 text-green-800'
    },

    // Colores para stock
    COLORES_STOCK: {
        DISPONIBLE: 'bg-green-100 text-green-800',
        BAJO: 'bg-yellow-100 text-yellow-800',
        AGOTADO: 'bg-red-100 text-red-800'
    },

    // Patrones de validación
    PATRONES: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        DNI: /^[0-9]{8}$/,
        TELEFONO: /^[0-9]{9}$/,
        SOLO_NUMEROS: /^\d+$/,
        SOLO_LETRAS: /^[A-Za-zÀ-ÿ\s]+$/,
        ALFANUMERICO: /^[A-Za-z0-9À-ÿ\s]+$/,
        CODIGO_PRODUCTO: /^[A-Za-z0-9\-_]+$/
    },

    // Configuración de la aplicación
    APP: {
        NOMBRE: 'Sistema de Inventario - Abarrotes',
        VERSION: '1.0.0',
        AUTOR: 'Tu Empresa',
        DESCRIPCION: 'Sistema de gestión de inventario para abarrotes'
    },

    // Rutas de navegación
    RUTAS: {
        HOME: '/',
        DASHBOARD: '/dashboard',
        PRODUCTOS: '/productos',
        USUARIOS: '/usuarios',
        VENTAS: '/ventas',
        PROVEEDORES: '/proveedores',
        REPORTES: '/reportes'
    },

    // Iconos para menú
    ICONOS_MENU: {
        DASHBOARD: 'fas fa-chart-bar',
        PRODUCTOS: 'fas fa-box',
        USUARIOS: 'fas fa-users',
        VENTAS: 'fas fa-shopping-cart',
        PROVEEDORES: 'fas fa-truck',
        REPORTES: 'fas fa-chart-line'
    },

    // Configuración de tablas
    TABLA: {
        FILAS_POR_PAGINA: [10, 25, 50, 100],
        FILA_DEFAULT: 10
    },

    // Timeouts y delays
    TIMEOUTS: {
        BUSQUEDA_DELAY: 300, // ms para debounce en búsquedas
        NOTIFICACION_DURATION: 3000, // ms para duración de notificaciones
        LOADING_MIN_TIME: 500, // ms mínimo para mostrar loading
        SESSION_CHECK_INTERVAL: 300000 // 5 minutos para verificar sesión
    }
};

// Funciones de utilidad para constantes
const CONSTANTS_UTILS = {
    /**
     * Obtener color por estado
     */
    getColorByEstado: (estado) => {
        return estado ? CONSTANTS.COLORES_ESTADO.ACTIVO : CONSTANTS.COLORES_ESTADO.INACTIVO;
    },

    /**
     * Obtener color por rol
     */
    getColorByRol: (rol) => {
        return CONSTANTS.COLORES_ROL[rol] || CONSTANTS.COLORES_ESTADO.PENDIENTE;
    },

    /**
     * Obtener color por stock
     */
    getColorByStock: (stock) => {
        if (stock === 0) return CONSTANTS.COLORES_STOCK.AGOTADO;
        if (stock <= CONSTANTS.STOCK.MINIMO) return CONSTANTS.COLORES_STOCK.BAJO;
        return CONSTANTS.COLORES_STOCK.DISPONIBLE;
    },

    /**
     * Validar si el rol es válido
     */
    isValidRole: (rol) => {
        return Object.values(CONSTANTS.ROLES).includes(rol);
    },

    /**
     * Obtener texto del estado
     */
    getEstadoTexto: (estado) => {
        return estado ? 'Activo' : 'Inactivo';
    },

    /**
     * Obtener icono por sección
     */
    getIconoBySeccion: (seccion) => {
        return CONSTANTS.ICONOS_MENU[seccion.toUpperCase()] || 'fas fa-circle';
    }
};

// Exportar para uso global
window.CONSTANTS = CONSTANTS;
window.CONSTANTS_UTILS = CONSTANTS_UTILS;