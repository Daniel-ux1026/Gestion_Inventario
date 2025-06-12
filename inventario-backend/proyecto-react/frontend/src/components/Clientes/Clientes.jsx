import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerClientes,
  agregarCliente,
  editarCliente,
  eliminarCliente
} from '../../services/clientesService';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);

  const [clienteActual, setClienteActual] = useState({
    id: null,
    nombre: '',
    correo: '',
    telefono: '',
    campañas: []
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);

  useEffect(() => {
    setClientes(obtenerClientes());
  }, []);

  const abrirModalNuevo = () => {
    setEsEdicion(false);
    setClienteActual({
      id: null,
      nombre: '',
      correo: '',
      telefono: '',
      campañas: []
    });
    setMostrarModalFormulario(true);
  };

  const abrirModalEdicion = (cliente) => {
    setEsEdicion(true);
    setClienteActual(cliente);
    setMostrarModalFormulario(true);
  };

  const guardarCliente = () => {
    if (!clienteActual.nombre || !clienteActual.correo || !clienteActual.telefono) return;

    if (esEdicion) {
      editarCliente(clienteActual);
    } else {
      agregarCliente(clienteActual);
    }

    setClientes(obtenerClientes());
    setMostrarModalFormulario(false);
  };

  const confirmarEliminar = (id) => {
    setIdEliminar(id);
    setMostrarModalEliminar(true);
  };

  const eliminarConfirmado = () => {
    eliminarCliente(idEliminar);
    setClientes(obtenerClientes());
    setMostrarModalEliminar(false);
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Gestión de Clientes</h3>

      <Button variant="primary" onClick={abrirModalNuevo} className="mb-3">
        Agregar Cliente
      </Button>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No hay clientes registrados.</td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.correo}</td>
                  <td>{c.telefono}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => abrirModalEdicion(c)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmarEliminar(c.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      <Modal show={mostrarModalFormulario} onHide={() => setMostrarModalFormulario(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{esEdicion ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={clienteActual.nombre}
                onChange={(e) => setClienteActual({ ...clienteActual, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                value={clienteActual.correo}
                onChange={(e) => setClienteActual({ ...clienteActual, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={clienteActual.telefono}
                onChange={(e) => setClienteActual({ ...clienteActual, telefono: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalFormulario(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCliente}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminarConfirmado}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clientes;
