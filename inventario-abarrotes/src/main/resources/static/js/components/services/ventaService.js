// js/services/ventaService.js
// Servicio para manejo de ventas

const ventaService = {
    /**
     * Obtener todas las ventas
     */
    getAll: async () => {
        try {
            const response = await apiService.get('/ventas');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas')
            };
        }
    },

    /**
     * Obtener venta por ID
     */
    getById: async (id) => {
        try {
            const response = await apiService.get(`/ventas/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar venta')
            };
        }
    },

    /**
     * Crear nueva venta
     */
    create: async (venta) => {
        try {
            const response = await apiService.post('/ventas', venta);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al crear venta')
            };
        }
    },

    /**
     * Anular venta
     */
    anular: async (id) => {
        try {
            await apiService.delete(`/ventas/${id}`);
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al anular venta')
            };
        }
    },

    /**
     * Obtener ventas por usuario (vendedor)
     */
    getByUsuario: async (usuarioId) => {
        try {
            const response = await apiService.get(`/ventas/usuario/${usuarioId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas por usuario')
            };
        }
    },

    /**
     * Obtener ventas por cliente
     */
    getByCliente: async (clienteId) => {
        try {
            const response = await apiService.get(`/ventas/cliente/${clienteId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas por cliente')
            };
        }
    },

    /**
     * Obtener ventas del día
     */
    getDelDia: async () => {
        try {
            const response = await apiService.get('/ventas/hoy');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas del día')
            };
        }
    },

    /**
     * Obtener ventas del mes
     */
    getDelMes: async () => {
        try {
            const response = await apiService.get('/ventas/mes');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas del mes')
            };
        }
    },

    /**
     * Obtener ventas por rango de fechas
     */
    getByRangoFechas: async (fechaInicio, fechaFin) => {
        try {
            const response = await apiService.get(`/ventas/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar ventas por rango de fechas')
            };
        }
    },

    /**
     * Obtener estadísticas de ventas
     */
    getEstadisticas: async () => {
        try {
            const response = await apiService.get('/ventas/estadisticas');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar estadísticas')
            };
        }
    },

    /**
     * Obtener top clientes
     */
    getTopClientes: async () => {
        try {
            const response = await apiService.get('/ventas/top-clientes');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar top clientes')
            };
        }
    }
};

// Exportar para uso global
window.ventaService = ventaService;