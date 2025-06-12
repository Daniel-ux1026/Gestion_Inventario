import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);
  const [proveedorActual, setProveedorActual] = useState({ nombre: '', contacto: '', telefono: '', email: '', activo: true });

  const [mostrarModalOrden, setMostrarModalOrden] = useState(false);
  const [ordenActual, setOrdenActual] = useState({});

  useEffect(() => {
    const listaProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    const listaOrdenes = JSON.parse(localStorage.getItem('ordenesCompra')) || [];
    setProveedores(listaProveedores);
    setOrdenes(listaOrdenes);
  }, []);

  const guardarProveedor = () => {
    const nuevo = { ...proveedorActual, id: Date.now() };
    const actualizados = [...proveedores, nuevo];
    localStorage.setItem('proveedores', JSON.stringify(actualizados));
    setProveedores(actualizados);
    setMostrarModalProveedor(false);
  };

  const guardarEdicionOrden = () => {
    const actualizadas = ordenes.map(o => o.id === ordenActual.id ? ordenActual : o);
    localStorage.setItem('ordenesCompra', JSON.stringify(actualizadas));
    setOrdenes(actualizadas);
    setMostrarModalOrden(false);
  };

  const totalProveedores = proveedores.length;
  const proveedoresActivos = proveedores.filter(p => p.activo).length;
  const promedioEntrega = ordenes.length
    ? (ordenes.reduce((acc, o) => {
        const f1 = new Date(o.fechaOrden);
        const f2 = new Date(o.fechaEntrega);
        return acc + (f2 - f1) / (1000 * 60 * 60 * 24);
      }, 0) / ordenes.length).toFixed(1)
    : 0;
  const ordenesPendientes = ordenes.filter(o => o.estado === 'Pendiente').length;

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Gestión de Proveedores</h3>

      <div className="row text-center mb-4">
        <Indicador titulo="Proveedores totales" valor={totalProveedores} icono="🧑‍💼" />
        <Indicador titulo="Proveedores activos" valor={proveedoresActivos} icono="✅" />
        <Indicador titulo="Tiempo promedio de entrega" valor={`${promedioEntrega} días`} icono="⏱️" />
        <Indicador titulo="Órdenes pendientes" valor={ordenesPendientes} icono="📦" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input type="text" className="form-control w-50" placeholder="🔍 Buscar por cliente o # de documento" />
        <Button onClick={() => {
          setProveedorActual({ nombre: '', contacto: '', telefono: '', email: '', activo: true });
          setMostrarModalProveedor(true);
        }}>
          + Nuevo proveedor
        </Button>
      </div>

      <div className="row">
        {proveedores.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="border rounded p-3">
              <strong>{p.nombre}</strong><br />
              Contacto: {p.contacto}<br />
              Teléfono: {p.telefono}<br />
              Email: {p.email}<br />
              <div className="mt-2 d-flex gap-2">
                <Button variant="outline-primary" size="sm">Ver detalle</Button>
                <Button variant="outline-success" size="sm">Nueva orden</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mt-4">Órdenes de Compra Recientes</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>N° Orden</th>
              <th>Proveedor</th>
              <th>Fecha de Orden</th>
              <th>Fecha de Entrega</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No hay órdenes registradas.</td></tr>
            ) : (
              ordenes.map(o => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{o.proveedor}</td>
                  <td>{o.fechaOrden}</td>
                  <td>{o.fechaEntrega}</td>
                  <td>S/. {o.monto.toFixed(2)}</td>
                  <td>{o.estado}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setOrdenActual(o);
                        setMostrarModalOrden(true);
                      }}
                    >
                      ✏️
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Proveedor */}
      <Modal show={mostrarModalProveedor} onHide={() => setMostrarModalProveedor(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={proveedorActual.nombre} onChange={(e) => setProveedorActual({ ...proveedorActual, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contacto</Form.Label>
              <Form.Control type="text" value={proveedorActual.contacto} onChange={(e) => setProveedorActual({ ...proveedorActual, contacto: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" value={proveedorActual.telefono} onChange={(e) => setProveedorActual({ ...proveedorActual, telefono: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={proveedorActual.email} onChange={(e) => setProveedorActual({ ...proveedorActual, email: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalProveedor(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarProveedor}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Orden */}
      <Modal show={mostrarModalOrden} onHide={() => setMostrarModalOrden(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Proveedor</Form.Label>
              <Form.Control type="text" value={ordenActual.proveedor} onChange={(e) => setOrdenActual({ ...ordenActual, proveedor: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de Orden</Form.Label>
              <Form.Control type="date" value={ordenActual.fechaOrden} onChange={(e) => setOrdenActual({ ...ordenActual, fechaOrden: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de Entrega</Form.Label>
              <Form.Control type="date" value={ordenActual.fechaEntrega} onChange={(e) => setOrdenActual({ ...ordenActual, fechaEntrega: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Monto</Form.Label>
              <Form.Control type="number" value={ordenActual.monto} onChange={(e) => setOrdenActual({ ...ordenActual, monto: parseFloat(e.target.value) })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={ordenActual.estado} onChange={(e) => setOrdenActual({ ...ordenActual, estado: e.target.value })}>
                <option>Pendiente</option>
                <option>Recibido</option>
                <option>Parcial</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalOrden(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarEdicionOrden}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const Indicador = ({ titulo, valor, icono }) => (
  <div className="col">
    <div className="border p-3 rounded">
      <div style={{ fontSize: '1.5rem' }}>{icono}</div>
      <h6 className="mt-2">{titulo}</h6>
      <h4>{valor}</h4>
    </div>
  </div>
);

export default Proveedores;
