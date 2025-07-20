import React, { useState } from 'react';
import '../../../../../../../Downloads/inventario-backend/admin-frontend/frontend/src/components/Inventario/Inventario.css';
import Volver from '../../../../../../../Downloads/inventario-backend/admin-frontend/frontend/src/components/Common/Volver.jsx';

const Inventario = () => {
  const [productos, setProductos] = useState([
    {
      codigo: 'PRD-001',
      nombre: 'Producto A',
      stock: 50,
      precio: 10.0,
    },
  ]);

  const agregarProducto = () => {
    const nuevoProducto = {
      codigo: `PRD-00${productos.length + 1}`,
      nombre: `Producto ${String.fromCharCode(65 + productos.length)}`,
      stock: 0,
      precio: 0.0,
    };
    setProductos([...productos, nuevoProducto]);
  };

  const editarProducto = (index) => {
    const nombre = prompt('Nuevo nombre del producto:', productos[index].nombre);
    const stock = prompt('Nuevo stock:', productos[index].stock);
    const precio = prompt('Nuevo precio:', productos[index].precio);
    const actualizados = [...productos];
    actualizados[index] = {
      ...actualizados[index],
      nombre,
      stock: parseInt(stock),
      precio: parseFloat(precio),
    };
    setProductos(actualizados);
  };

  const eliminarProducto = (index) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const actualizados = productos.filter((_, i) => i !== index);
      setProductos(actualizados);
    }
  };

  return (
    <div className="container mt-4">
      <Volver />
      <h2>Gestión de Inventario</h2>
      <button className="btn btn-primary mb-3" onClick={agregarProducto}>
        Agregar Producto
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={producto.codigo}>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.stock}</td>
              <td>S/. {producto.precio.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editarProducto(index)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarProducto(index)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
