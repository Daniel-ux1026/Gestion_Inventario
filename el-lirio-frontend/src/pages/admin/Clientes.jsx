import React, { useState } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([
    {
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      telefono: '987654321',
    },
  ]);

  const agregarCliente = () => {
    const nombre = prompt('Nombre del cliente:');
    const correo = prompt('Correo electrónico:');
    const telefono = prompt('Teléfono:');

    if (nombre && correo && telefono) {
      setClientes([...clientes, { nombre, correo, telefono }]);
    } else {
      alert('Todos los campos son obligatorios.');
    }
  };

  const editarCliente = (index) => {
    const cliente = clientes[index];
    const nombre = prompt('Nuevo nombre:', cliente.nombre);
    const correo = prompt('Nuevo correo:', cliente.correo);
    const telefono = prompt('Nuevo teléfono:', cliente.telefono);

    if (nombre && correo && telefono) {
      const actualizados = [...clientes];
      actualizados[index] = { nombre, correo, telefono };
      setClientes(actualizados);
    } else {
      alert('Los campos no pueden quedar vacíos.');
    }
  };

  const eliminarCliente = (index) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      const actualizados = clientes.filter((_, i) => i !== index);
      setClientes(actualizados);
    }
  };

  return (
    <div className="container mt-4">
      <Volver />
      <h2>Gestión de Clientes</h2>
      <button className="btn btn-primary mb-3" onClick={agregarCliente}>
        Agregar Cliente
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.correo}</td>
              <td>{cliente.telefono}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editarCliente(index)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarCliente(index)}
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

export default Clientes;
