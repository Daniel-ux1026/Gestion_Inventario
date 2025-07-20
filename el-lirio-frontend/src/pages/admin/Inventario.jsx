import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


const Inventario = () => {
  const [productos, setProductos] = useState([
    { codigo: 'PRD-001', nombre: 'Producto A', stock: 50, precio: 10.0 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ codigo: '', nombre: '', stock: '', precio: '' });

  // Abrir modal para agregar o editar
  const handleOpen = (index = null) => {
    if (index === null) {
      // Nuevo producto
      setForm({
        codigo: `PRD-00${productos.length + 1}`,
        nombre: '',
        stock: '',
        precio: '',
      });
    } else {
      // Editar producto
      setForm(productos[index]);
    }
    setEditIndex(index);
    setShowModal(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setShowModal(false);
    setEditIndex(null);
    setForm({ codigo: '', nombre: '', stock: '', precio: '' });
  };

  // Guardar producto (nuevo o editado)
  const handleSave = () => {
    if (!form.nombre || form.stock === '' || form.precio === '') {
      alert('Completa todos los campos.');
      return;
    }
    const producto = {
      ...form,
      stock: parseInt(form.stock),
      precio: parseFloat(form.precio),
    };
    if (editIndex === null) {
      setProductos([...productos, producto]);
    } else {
      const actualizados = [...productos];
      actualizados[editIndex] = producto;
      setProductos(actualizados);
    }
    handleClose();
  };

  // Eliminar producto
  const eliminarProducto = (index) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const actualizados = productos.filter((_, i) => i !== index);
      setProductos(actualizados);
    }
  };

  return (
      <div className="container mt-4">
        <h2>Gestión de Inventario</h2>
        <button className="btn btn-primary mb-3" onClick={() => handleOpen()}>
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
                      onClick={() => handleOpen(index)}
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

        {/* Modal para agregar/editar */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editIndex === null ? 'Agregar Producto' : 'Editar Producto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Código</Form.Label>
                <Form.Control
                    type="text"
                    value={form.codigo}
                    disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Precio</Form.Label>
                <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default Inventario;
