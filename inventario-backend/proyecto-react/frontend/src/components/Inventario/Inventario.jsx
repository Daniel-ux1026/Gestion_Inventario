import React, { useState, useEffect } from "react";
import {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
} from "../../services/inventarioService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id: null,
    codigo: "",
    nombre: "",
    stock: 0,
    precio: 0,
  });
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  const abrirNuevo = () => {
    setProductoActual({ id: null, codigo: "", nombre: "", stock: 0, precio: 0 });
    setModalFormulario(true);
  };

  const abrirEditar = (producto) => {
    setProductoActual({ ...producto });
    setModalFormulario(true);
  };

  const guardar = () => {
    if (productoActual.id) {
      editarProducto(productoActual);
    } else {
      agregarProducto(productoActual);
    }
    setProductos(obtenerProductos());
    setModalFormulario(false);
  };

  const confirmarEliminar = (producto) => {
    setProductoAEliminar(producto);
    setModalEliminar(true);
  };

  const eliminar = () => {
    eliminarProducto(productoAEliminar.id);
    setProductos(obtenerProductos());
    setModalEliminar(false);
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Gestión de Inventario</h3>
      <button className="btn btn-primary mb-3" onClick={abrirNuevo}>
        Agregar Producto
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No hay productos registrados.</td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.stock}</td>
                  <td>S/. {parseFloat(p.precio).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => abrirEditar(p)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmarEliminar(p)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal formulario */}
      <Modal show={modalFormulario} onHide={() => setModalFormulario(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{productoActual.id ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Código</Form.Label>
              <Form.Control
                value={productoActual.codigo}
                onChange={(e) => setProductoActual({ ...productoActual, codigo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={productoActual.nombre}
                onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={productoActual.stock}
                onChange={(e) => setProductoActual({ ...productoActual, stock: parseInt(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={productoActual.precio}
                onChange={(e) => setProductoActual({ ...productoActual, precio: parseFloat(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalFormulario(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal eliminar */}
      <Modal show={modalEliminar} onHide={() => setModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar <strong>{productoAEliminar?.nombre}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inventario;
