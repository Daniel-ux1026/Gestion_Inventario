import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([
        {
            name: "Distribuidora Lima S.A.C.",
            contact: "Carlos Mendoza",
            phone: "+51 987 654 321",
            email: "ventas@dlima.com.pe",
        },
        {
            name: "Productos del Sur E.I.R.L.",
            contact: "María Gonzales",
            phone: "+51 923 456 789",
            email: "mgonzales@spsur.com",
        },
        {
            name: "Importaciones Mendoza S.A.",
            contact: "Roberto Mendoza",
            phone: "+51 912 345 678",
            email: "info@importmendoza.pe",
        },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', contact: '', phone: '', email: '' });
    const [editIndex, setEditIndex] = useState(null);

    // Abrir modal para agregar o editar
    const abrirModal = (index = null) => {
        if (index === null) {
            setForm({ name: '', contact: '', phone: '', email: '' }); // Nuevo proveedor
            setEditIndex(null);
        } else {
            setForm(proveedores[index]); // Editar proveedor
            setEditIndex(index);
        }
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setForm({ name: '', contact: '', phone: '', email: '' });
        setEditIndex(null);
    };

    const guardarProveedor = () => {
        if (!form.name || !form.contact || !form.phone || !form.email) {
            alert("Todos los campos son obligatorios.");
            return;
        }
        if (editIndex === null) {
            setProveedores([...proveedores, form]);
        } else {
            const actualizados = [...proveedores];
            actualizados[editIndex] = form;
            setProveedores(actualizados);
        }
        cerrarModal();
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-4">Gestión de Proveedores</h4>
            {/* Métricas */}
            <div className="row mb-4 text-center">
                <div className="col-md-3">
                    <div className="border rounded p-3">
                        <div>👷‍♂️</div>
                        <h5>Proveedores totales</h5>
                        <p className="fs-4">{proveedores.length}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="border rounded p-3">
                        <div>✅</div>
                        <h5>Proveedores activos</h5>
                        <p className="fs-4">{proveedores.length}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="border rounded p-3">
                        <div>⏱️</div>
                        <h5>Tiempo promedio de entrega</h5>
                        <p className="fs-4">4.2 días</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="border rounded p-3">
                        <div>📦</div>
                        <h5>Órdenes pendientes</h5>
                        <p className="fs-4">8</p>
                    </div>
                </div>
            </div>
            {/* Directorio */}
            <div className="mb-4">
                <h5>Directorio de Proveedores</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="🔍 Buscar por nombre o contacto (no funcional demo)"
                    />
                    <button className="btn btn-primary" onClick={() => abrirModal()}>
                        + Nuevo proveedor
                    </button>
                </div>
                <div className="d-flex gap-4 flex-wrap">
                    {proveedores.map((prov, i) => (
                        <div className="border p-3 rounded shadow-sm" key={i} style={{ width: '300px' }}>
                            <strong>{prov.name}</strong>
                            <p className="mb-1">Contacto: {prov.contact}</p>
                            <p className="mb-1">Teléfono: {prov.phone}</p>
                            <p className="mb-1">Email: {prov.email}</p>
                            <div className="d-flex gap-2 mt-2">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => abrirModal(i)}>
                                    Editar
                                </button>
                                <button className="btn btn-outline-success btn-sm">
                                    Nueva orden
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Órdenes Recientes */}
            <div>
                <h5 className="mb-3">Órdenes de Compra Recientes</h5>
                <table className="table table-bordered">
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
                    <tr>
                        <td>#OC-2025-042</td>
                        <td>Distribuidora Lima S.A.C.</td>
                        <td>10/04/2025</td>
                        <td>15/04/2025</td>
                        <td>S/. 3,450.00</td>
                        <td>Pendiente</td>
                        <td><i className="bi bi-pencil-square text-primary"></i></td>
                    </tr>
                    <tr>
                        <td>#OC-2025-041</td>
                        <td>Productos del Sur E.I.R.L.</td>
                        <td>08/04/2025</td>
                        <td>12/04/2025</td>
                        <td>S/. 2,180.00</td>
                        <td>Recibido</td>
                        <td><i className="bi bi-pencil-square text-primary"></i></td>
                    </tr>
                    <tr>
                        <td>#OC-2025-040</td>
                        <td>Importaciones Mendoza S.A.</td>
                        <td>05/04/2025</td>
                        <td>10/04/2025</td>
                        <td>S/. 1,250.00</td>
                        <td>Parcial</td>
                        <td><i className="bi bi-pencil-square text-primary"></i></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            {/* Modal para agregar/editar proveedor */}
            <Modal show={showModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editIndex === null ? "Nuevo Proveedor" : "Editar Proveedor"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Razón Social</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Contacto</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.contact}
                                onChange={e => setForm({ ...form, contact: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={guardarProveedor}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Proveedores;
