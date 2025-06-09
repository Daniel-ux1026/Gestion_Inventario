// js/services/api.js
// Configuración base de la API

const API_BASE_URL = window.location.origin + '/api';

// Configurar interceptor de axios para incluir token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globales
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Servicio base para realizar peticiones HTTP
const apiService = {
    get: (url, config = {}) => {
        return axios.get(`${API_BASE_URL}${url}`, config);
    },

    post: (url, data, config = {}) => {
        return axios.post(`${API_BASE_URL}${url}`, data, config);
    },

    put: (url, data, config = {}) => {
        return axios.put(`${API_BASE_URL}${url}`, data, config);
    },

    delete: (url, config = {}) => {
        return axios.delete(`${API_BASE_URL}${url}`, config);
    },

    patch: (url, data, config = {}) => {
        return axios.patch(`${API_BASE_URL}${url}`, data, config);
    }
};

// Función para manejar errores de API de forma consistente
const handleApiError = (error, defaultMessage = 'Error en la operación') => {
    if (error.response) {
        // El servidor respondió con un código de error
        return error.response.data || error.response.statusText || defaultMessage;
    } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        return 'Error de conexión con el servidor';
    } else {
        // Error al configurar la petición
        return error.message || defaultMessage;
    }
};

// Función para mostrar notificaciones (puedes expandir esto más tarde)
const showNotification = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    // Aquí puedes agregar una librería de notificaciones como Toastify
};

// Exportar para uso en otros archivos
window.apiService = apiService;
window.handleApiError = handleApiError;
window.showNotification = showNotification;
window.API_BASE_URL = API_BASE_URL;