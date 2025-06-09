// js/services/authService.js
// Servicio para manejo de autenticación

const authService = {
    /**
     * Iniciar sesión con correo y contraseña
     */
    login: async (correo, contrasenia) => {
        try {
            const response = await apiService.post('/auth/login', {
                correo,
                contrasenia
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al iniciar sesión')
            };
        }
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    },

    /**
     * Validar token actual
     */
    validateToken: async () => {
        try {
            const response = await apiService.get('/auth/validate');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Token inválido')
            };
        }
    },

    /**
     * Obtener token del localStorage
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated: () => {
        const token = authService.getToken();
        return !!token;
    },

    /**
     * Obtener información del usuario actual
     */
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },

    /**
     * Guardar información del usuario
     */
    setCurrentUser: (user) => {
        try {
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    },

    /**
     * Verificar si el usuario tiene un rol específico
     */
    hasRole: (role) => {
        const user = authService.getCurrentUser();
        return user && user.rol === role;
    },

    /**
     * Verificar si el usuario es administrador
     */
    isAdmin: () => {
        return authService.hasRole('ADMIN');
    },

    /**
     * Verificar si el usuario es empleado
     */
    isEmpleado: () => {
        return authService.hasRole('EMPLEADO');
    },

    /**
     * Verificar si el usuario es cliente
     */
    isCliente: () => {
        return authService.hasRole('CLIENTE');
    }
};

// Exportar para uso global
window.authService = authService;