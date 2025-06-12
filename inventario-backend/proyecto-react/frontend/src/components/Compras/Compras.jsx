import React, { useEffect, useState } from 'react';
import {
  obtenerCompras,
  agregarCompra,
  editarCompra,
  eliminarCompra
} from '../../services/comprasService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const Compras = () => {
  const [compras, setCompras] = useState([]);

  // Estados para modal de registro/edición
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const [compraActual, setCompraActual] = useState({
    id: null,
    proveedor: '',
    producto: '',
    monto: '',
    fecha: '',
    estado: 'Pendiente',
  });

  // Estados para modal de eliminación
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);

  useEffect(() => {
    setCompras(obtenerCompras());
  }, []);

  const abrirRegistrar = () => {
    setCompraActual({
      id: null,
      proveedor: '',
      producto: '',
      monto: '',
      fecha: '',
      estado: 'Pendiente',
    });
    setEsEdicion(false);
    setMostrarModalFormulario(true);
  };

  const abrirEditar = (compra) => {
    setCompraActual({ ...compra });
    setEsEdicion(true);
    setMostrarModalFormulario(true);
  };

  const guardarCompra = () => {
    if (esEdicion) {
      editarCompra(compraActual);
    } else {
      agregarCompra(compraActual);
    }
    setCompras(obtenerCompras());
    setMostrarModalFormulario(false);
  };

  const confirmarEliminar = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminar(true);
  };

  const eliminarConfirmado = () => {
    eliminarCompra(compraAEliminar.id);
    setCompras(obtenerCompras());
    setMostrarModalEliminar(false);
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Gestión de Compras</h3>
      <button className="btn btn-primary mb-3" onClick={abrirRegistrar}>
        Registrar Compra
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
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
            {compras.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay compras registradas.</td>
              </tr>
            ) : (
              compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.proveedor}</td>
                  <td>{compra.producto}</td>
                  <td>S/. {parseFloat(compra.monto).toFixed(2)}</td>
                  <td>{compra.fecha}</td>
                  <td>
                    <span className={`badge ${compra.estado === 'Pendiente' ? 'bg-danger' : 'bg-success'}`}>
                      {compra.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => abrirEditar(compra)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmarEliminar(compra)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Registro/Edición */}
      <Modal show={mostrarModalFormulario} onHide={() => setMostrarModalFormulario(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{esEdicion ? "Editar Compra" : "Registrar Compra"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor</Form.Label>
              <Form.Control
                type="text"
                value={compraActual.proveedor}
                onChange={(e) => setCompraActual({ ...compraActual, proveedor: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type="text"
                value={compraActual.producto}
                onChange={(e) => setCompraActual({ ...compraActual, producto: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                value={compraActual.monto}
                onChange={(e) => setCompraActual({ ...compraActual, monto: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={compraActual.fecha}
                onChange={(e) => setCompraActual({ ...compraActual, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={compraActual.estado}
                onChange={(e) => setCompraActual({ ...compraActual, estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Recibido">Recibido</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalFormulario(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCompra}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar la compra de <strong>{compraAEliminar?.proveedor}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminarConfirmado}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Compras;
