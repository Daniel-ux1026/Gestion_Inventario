// js/services/productoService.js
// Servicio para manejo de productos

const productoService = {
    /**
     * Obtener todos los productos
     */
    getAll: async () => {
        try {
            const response = await apiService.get('/productos');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos')
            };
        }
    },

    /**
     * Obtener producto por ID
     */
    getById: async (id) => {
        try {
            const response = await apiService.get(`/productos/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar producto')
            };
        }
    },

    /**
     * Crear nuevo producto
     */
    create: async (producto) => {
        try {
            const response = await apiService.post('/productos', producto);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al crear producto')
            };
        }
    },

    /**
     * Actualizar producto
     */
    update: async (id, producto) => {
        try {
            const response = await apiService.put(`/productos/${id}`, producto);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al actualizar producto')
            };
        }
    },

    /**
     * Eliminar producto
     */
    delete: async (id) => {
        try {
            await apiService.delete(`/productos/${id}`);
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al eliminar producto')
            };
        }
    },

    /**
     * Buscar productos por término
     */
    search: async (termino) => {
        try {
            const response = await apiService.get(`/productos/buscar?termino=${encodeURIComponent(termino)}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al buscar productos')
            };
        }
    },

    /**
     * Obtener productos por categoría
     */
    getByCategoria: async (categoriaId) => {
        try {
            const response = await apiService.get(`/productos/categoria/${categoriaId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos por categoría')
            };
        }
    },

    /**
     * Obtener productos por marca
     */
    getByMarca: async (marcaId) => {
        try {
            const response = await apiService.get(`/productos/marca/${marcaId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos por marca')
            };
        }
    },

    /**
     * Obtener productos disponibles (con stock)
     */
    getDisponibles: async () => {
        try {
            const response = await apiService.get('/productos/disponibles');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos disponibles')
            };
        }
    },

    /**
     * Obtener productos con stock bajo
     */
    getStockBajo: async (minStock = 5) => {
        try {
            const response = await apiService.get(`/productos/stock-bajo?minStock=${minStock}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos con stock bajo')
            };
        }
    },

    /**
     * Obtener productos sin stock
     */
    getSinStock: async () => {
        try {
            const response = await apiService.get('/productos/sin-stock');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cargar productos sin stock')
            };
        }
    },

    /**
     * Cambiar estado del producto
     */
    cambiarEstado: async (id) => {
        try {
            const response = await apiService.put(`/productos/${id}/cambiar-estado`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al cambiar estado del producto')
            };
        }
    },

    /**
     * Actualizar stock del producto
     */
    actualizarStock: async (id, cantidad, tipoMovimiento) => {
        try {
            const response = await apiService.put(`/productos/${id}/actualizar-stock`, {
                cantidad,
                tipoMovimiento
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al actualizar stock')
            };
        }
    },

    /**
     * Verificar si existe un código de producto
     */
    existeCodigo: async (codigo) => {
        try {
            const response = await apiService.get(`/productos/verificar-codigo?codigo=${encodeURIComponent(codigo)}`);
            return {
                success: true,
                exists: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: handleApiError(error, 'Error al verificar código')
            };
        }
    }
};

// Exportar para uso global
window.productoService = productoService;