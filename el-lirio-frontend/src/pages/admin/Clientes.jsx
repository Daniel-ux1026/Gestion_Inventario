import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Clientes = () => {
    const [clientes, setClientes] = useState([
        {
            nombre: 'Juan Pérez',
            correo: 'juan@example.com',
            telefono: '987654321',
        },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [form, setForm] = useState({ nombre: '', correo: '', telefono: '' });

    // Abrir modal para agregar o editar
    const handleOpen = (index = null) => {
        if (index === null) {
            // Nuevo cliente
            setForm({ nombre: '', correo: '', telefono: '' });
        } else {
            // Editar cliente
            setForm(clientes[index]);
        }
        setEditIndex(index);
        setShowModal(true);
    };

    // Cerrar modal
    const handleClose = () => {
        setShowModal(false);
        setEditIndex(null);
        setForm({ nombre: '', correo: '', telefono: '' });
    };

    // Guardar cliente (nuevo o editado)
    const handleSave = () => {
        if (!form.nombre || !form.correo || !form.telefono) {
            alert('Completa todos los campos.');
            return;
        }
        if (editIndex === null) {
            setClientes([...clientes, form]);
        } else {
            const actualizados = [...clientes];
            actualizados[editIndex] = form;
            setClientes(actualizados);
        }
        handleClose();
    };

    // Eliminar cliente
    const eliminarCliente = (index) => {
        if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
            const actualizados = clientes.filter((_, i) => i !== index);
            setClientes(actualizados);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Clientes</h2>
            <button className="btn btn-primary mb-3" onClick={() => handleOpen()}>
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
                                onClick={() => handleOpen(index)}
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

            {/* Modal para agregar/editar */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editIndex === null ? 'Agregar Cliente' : 'Editar Cliente'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.correo}
                                onChange={e => setForm({ ...form, correo: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.telefono}
                                onChange={e => setForm({ ...form, telefono: e.target.value })}
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

export default Clientes;
