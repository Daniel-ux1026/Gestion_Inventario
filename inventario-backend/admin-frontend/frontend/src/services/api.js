import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // La URL base de tu backend
});

// Interceptor para añadir el token a las cabeceras de las peticiones protegidas
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;