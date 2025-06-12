// Crea este archivo: proyecto-react/frontend/src/services/productoService.js
import api from './api';

export const listarProductos = async () => {
    try {
        const response = await api.get('/productos/listar');
        return response.data; // Suponiendo que tu ApiResponse envuelve los datos
    } catch (error) {
        console.error("Error al listar productos:", error);
        throw error;
    }
};

export const guardarProducto = async (productoData) => {
    try {
        const response = await api.post('/productos', productoData);
        return response.data;
    } catch (error) {
        console.error("Error al guardar producto:", error);
        throw error;
    }
};

// ... otros métodos como eliminar, actualizar, etc.