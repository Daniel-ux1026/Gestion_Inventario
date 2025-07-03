import api from './api'; // Usamos la instancia central de axios que creamos antes

const listarProductos = () => {
    return api.get('/productos/listar'); // O '/productos/activos' si prefieres
};

const buscarProductoPorId = (id) => {
    return api.get(`/productos/${id}`);
};

const guardarProducto = (productoData) => {
    // Si el producto tiene un ID, es una actualización (PUT)
    if (productoData.idProducto) {
        return api.put(`/productos/${productoData.idProducto}`, productoData);
    }
    // Si no tiene ID, es una creación (POST)
    return api.post('/productos', productoData);
};

const eliminarProducto = (id) => {
    // Usamos el endpoint para el borrado lógico
    return api.delete(`/productos/${id}`);
};

export const productoService = {
    listarProductos,
    buscarProductoPorId,
    guardarProducto,
    eliminarProducto,
};