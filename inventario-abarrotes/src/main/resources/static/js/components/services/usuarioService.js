// js/services/usuarioService.js
// Servicio para manejo de usuarios

const usuarioService = {
    /**
     * Obtener todos los usuarios
     */
    getAll: async () => {
        try {
            const response = await apiService.get('/usuarios');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar usuarios')
            };
        }
    },

    /**
     * Obtener usuario por ID
     */
    getById: async (id) => {
        try {
            const response = await apiService.get(`/usuarios/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar usuario')
            };
        }
    },

    /**
     * Crear nuevo usuario
     */
    create: async (usuario) => {
        try {
            const response = await apiService.post('/usuarios', usuario);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al crear usuario')
            };
        }
    },

    /**
     * Actualizar usuario
     */
    update: async (id, usuario) => {
        try {
            const response = await apiService.put(`/usuarios/${id}`, usuario);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al actualizar usuario')
            };
        }
    },

    /**
     * Eliminar usuario
     */
    delete: async (id) => {
        try {
            await apiService.delete(`/usuarios/${id}`);
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al eliminar usuario')
            };
        }
    },

    /**
     * Buscar usuarios por término
     */
    search: async (termino) => {
        try {
            const response = await apiService.get(`/usuarios/buscar?termino=${encodeURIComponent(termino)}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al buscar usuarios')
            };
        }
    },

    /**
     * Obtener clientes
     */
    getClientes: async () => {
        try {
            const response = await apiService.get('/usuarios/clientes');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar clientes')
            };
        }
    },

    /**
     * Obtener empleados
     */
    getEmpleados: async () => {
        try {
            const response = await apiService.get('/usuarios/empleados');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar empleados')
            };
        }
    },

    /**
     * Obtener usuarios por rol
     */
    getByRol: async (rolId) => {
        try {
            const response = await apiService.get(`/usuarios/rol/${rolId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar usuarios por rol')
            };
        }
    },

    /**
     * Cambiar estado del usuario
     */
    cambiarEstado: async (id) => {
        try {
            const response = await apiService.put(`/usuarios/${id}/cambiar-estado`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cambiar estado del usuario')
            };
        }
    },

    /**
     * Cambiar contraseña
     */
    cambiarContrasenia: async (id, contraseniaActual, nuevaContrasenia) => {
        try {
            await apiService.post(`/usuarios/${id}/cambiar-contrasenia`, {
                contraseniaActual,
                nuevaContrasenia
            });
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cambiar contraseña')
            };
        }
    },

    /**
     * Verificar si existe un correo
     */
    existeCorreo: async (correo) => {
        try {
            const response = await apiService.get(`/usuarios/verificar-correo?correo=${encodeURIComponent(correo)}`);
            return {
                success: true,
                exists: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al verificar correo')
            };
        }
    },

    /**
     * Verificar si existe un DNI
     */
    existeDni: async (dni) => {
        try {
            const response = await apiService.get(`/usuarios/verificar-dni?dni=${encodeURIComponent(dni)}`);
            return {
                success: true,
                exists: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al verificar DNI')
            };
        }
    }
};

// Exportar para uso global
window.usuarioService = usuarioService;