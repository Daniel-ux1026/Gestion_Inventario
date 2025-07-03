import api from './api';


const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
        // Almacena el token en localStorage para usarlo en futuras peticiones
        localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
};

const register = (userData) => {
    // El userData debe coincidir con la estructura de tu UsuarioDTO en el backend
    return api.post('/usuarios', userData);
};

const requestPasswordRecovery = (email) => {
    // !! NECESITAS CREAR ESTE ENDPOINT EN TU BACKEND !!
    // Por ejemplo: POST /api/auth/forgot-password
    return api.post('/auth/forgot-password', { email });
};

const logout = () => {
    localStorage.removeItem('accessToken');
};

export const authService = {
    login,
    register,
    requestPasswordRecovery,
    logout,
};