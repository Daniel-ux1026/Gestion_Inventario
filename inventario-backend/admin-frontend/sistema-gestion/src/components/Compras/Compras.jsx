import React, { useState } from 'react';
import './Compras.css';
import Volver from '../Common/Volver';

const Compras = () => {
  const [compras, setCompras] = useState([
    {
      proveedor: 'Distribuidora Lima S.A.C.',
      producto: 'Arroz Extra Costeño',
      monto: 2180.0,
      fecha: '12/04/2025',
      estado: 'Recibido',
    },
  ]);

  const registrarCompra = () => {
    const proveedor = prompt('Nombre del proveedor:');
    const producto = prompt('Nombre del producto:');
    const monto = parseFloat(prompt('Monto de la compra:'));
    const fecha = prompt('Fecha (DD/MM/YYYY):');
    const estado = prompt('Estado (Recibido/Pendiente):');

    if (proveedor && producto && !isNaN(monto) && fecha && estado) {
      setCompras([
        ...compras,
        { proveedor, producto, monto, fecha, estado },
      ]);
    } else {
      alert('Campos inválidos. Intenta nuevamente.');
    }
  };

  const editarCompra = (index) => {
    const compra = compras[index];
    const proveedor = prompt('Nuevo proveedor:', compra.proveedor);
    const producto = prompt('Nuevo producto:', compra.producto);
    const monto = parseFloat(prompt('Nuevo monto:', compra.monto));
    const fecha = prompt('Nueva fecha:', compra.fecha);
    const estado = prompt('Nuevo estado:', compra.estado);

    if (proveedor && producto && !isNaN(monto) && fecha && estado) {
      const actualizadas = [...compras];
      actualizadas[index] = { proveedor, producto, monto, fecha, estado };
      setCompras(actualizadas);
    } else {
      alert('Datos inválidos al editar.');
    }
  };

  const eliminarCompra = (index) => {
    if (window.confirm('¿Estás seguro de eliminar esta compra?')) {
      const actualizadas = compras.filter((_, i) => i !== index);
      setCompras(actualizadas);
    }
  };

  return (
    <div className="container mt-4">
      <Volver />
      <h2>Gestión de Compras</h2>
      <button className="btn btn-primary mb-3" onClick={registrarCompra}>
        Registrar Compra
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Producto</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={index}>
              <td>{compra.proveedor}</td>
              <td>{compra.producto}</td>
              <td>S/. {compra.monto.toFixed(2)}</td>
              <td>{compra.fecha}</td>
              <td>
                <span className={`badge bg-${compra.estado === 'Recibido' ? 'success' : 'secondary'}`}>
                  {compra.estado}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => editarCompra(index)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => eliminarCompra(index)}>
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

export default Compras;
