import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  obtenerVentas,
  eliminarVenta,
  editarVenta
} from '../../services/ventasService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Ventas = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [ventaActual, setVentaActual] = useState(null);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  // Cargar ventas desde localStorage
  useEffect(() => {
    setVentas(obtenerVentas());
  }, []);

  // Abrir modal de edición
  const abrirModalEditar = (venta) => {
    setVentaActual(venta);
    setModalEditarVisible(true);
  };

  // Guardar cambios de edición
  const guardarEdicion = () => {
    editarVenta(ventaActual);
    setVentas(obtenerVentas());
    setModalEditarVisible(false);
  };

  // Mostrar modal de eliminación
  const confirmarEliminar = (venta) => {
    setVentaAEliminar(venta);
    setModalEliminarVisible(true);
  };

  // Confirmar eliminación
  const eliminarConfirmado = () => {
    eliminarVenta(ventaAEliminar.id);
    setVentas(obtenerVentas());
    setModalEliminarVisible(false);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gestión de Ventas</h3>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          ← Volver al Dashboard
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/ventas/nueva')}>
          + Nueva venta
        </button>
      </div>

      {/* Tabla de ventas */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vendedor</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No hay ventas registradas.</td>
              </tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.cliente}</td>
                  <td>{venta.fecha}</td>
                  <td>{venta.vendedor}</td>
                  <td>{venta.total}</td>
                  <td>
                    <span className={`badge ${venta.estado === 'Pendiente' ? 'bg-danger' : 'bg-success'}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${venta.pago === 'Crédito' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {venta.pago}
                    </span>
                  </td>
                  <td>
                    <i
                      className="bi bi-pencil-square text-primary me-2"
                      role="button"
                      onClick={() => abrirModalEditar(venta)}
                    ></i>
                    <i
                      className="bi bi-trash text-danger"
                      role="button"
                      onClick={() => confirmarEliminar(venta)}
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      <Modal show={modalEditarVisible} onHide={() => setModalEditarVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaActual && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  type="text"
                  value={ventaActual.cliente}
                  onChange={(e) => setVentaActual({ ...ventaActual, cliente: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={ventaActual.fecha}
                  onChange={(e) => setVentaActual({ ...ventaActual, fecha: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="number"
                  value={ventaActual.total}
                  onChange={(e) => setVentaActual({ ...ventaActual, total: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={ventaActual.estado}
                  onChange={(e) => setVentaActual({ ...ventaActual, estado: e.target.value })}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pago</Form.Label>
                <Form.Select
                  value={ventaActual.pago}
                  onChange={(e) => setVentaActual({ ...ventaActual, pago: e.target.value })}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Crédito">Crédito</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEditarVisible(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={modalEliminarVisible} onHide={() => setModalEliminarVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la venta del cliente <strong>{ventaAEliminar?.cliente}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEliminarVisible(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarConfirmado}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ventas;
