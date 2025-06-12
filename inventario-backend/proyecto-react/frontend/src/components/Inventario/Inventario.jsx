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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalFormulario, setModalFormulario] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [productoActual, setProductoActual] = useState({ idProducto: null, codigoProducto: "", nombreProducto: "", stockActual: 0, precioVenta: 0.0 });
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const apiResponse = await obtenerProductos();
                if (apiResponse && apiResponse.success) {
                    setProductos(apiResponse.data);
                } else {
                    setError(apiResponse ? apiResponse.message : "Error al cargar los datos.");
                }
            } catch (err) {
                // CORRECCIÓN: Se utiliza la variable 'err' para logging.
                console.error("Error al cargar productos:", err);
                setError("No se pudo conectar al servidor.");
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const abrirNuevo = () => {
        setProductoActual({ idProducto: null, codigoProducto: "", nombreProducto: "", stockActual: 0, precioVenta: 0.0 });
        setModalFormulario(true);
    };

    const abrirEditar = (producto) => {
        setProductoActual({ ...producto });
        setModalFormulario(true);
    };

    const confirmarEliminar = (producto) => {
        setProductoAEliminar(producto);
        setModalEliminar(true);
    };

    const guardar = async () => {
        try {
            let response;
            if (productoActual.idProducto) {
                response = await editarProducto(productoActual.idProducto, productoActual);
            } else {
                response = await agregarProducto(productoActual);
            }

            if (response && response.success) {
                setModalFormulario(false);
                const updateResponse = await obtenerProductos();
                if (updateResponse.success) setProductos(updateResponse.data);
            } else {
                setError(response ? response.message : 'Error al guardar.');
            }
        } catch (err) {
            // CORRECCIÓN: Se utiliza la variable 'err' para logging.
            console.error("Error en la operación de guardar:", err);
            setError('Error de conexión al guardar el producto.');
        }
    };

    const eliminar = async () => {
        if (!productoAEliminar) return;
        try {
            const response = await eliminarProducto(productoAEliminar.idProducto);
            if (response && response.success) {
                setModalEliminar(false);
                setProductoAEliminar(null);
                setProductos(productos.filter(p => p.idProducto !== productoAEliminar.idProducto));
            } else {
                setError(response ? response.message : 'Error al eliminar.');
            }
        } catch (err) {
            // CORRECCIÓN: Se utiliza la variable 'err' para logging.
            console.error("Error en la operación de eliminar:", err);
            setError('Error de conexión al eliminar el producto.');
        }
    };

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
                ← Volver al Dashboard
            </Link>

            <h3 className="mb-4">Gestión de Inventario</h3>
            <button className="btn btn-primary mb-3" onClick={abrirNuevo}>
                Agregar Producto
            </button>

            {/* ... resto del JSX que ya estaba correcto ... */}
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
                            <tr key={p.idProducto}>
                                <td>{p.codigoProducto}</td>
                                <td>{p.nombreProducto}</td>
                                <td>{p.stockActual}</td>
                                <td>S/. {parseFloat(p.precioVenta).toFixed(2)}</td>
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

            {/* Modal para Formulario de Producto */}
            <Modal show={modalFormulario} onHide={() => setModalFormulario(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{productoActual.idProducto ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                value={productoActual.codigoProducto}
                                onChange={(e) => setProductoActual({ ...productoActual, codigoProducto: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                value={productoActual.nombreProducto}
                                onChange={(e) => setProductoActual({ ...productoActual, nombreProducto: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                value={productoActual.stockActual}
                                onChange={(e) => setProductoActual({ ...productoActual, stockActual: parseInt(e.target.value) || 0 })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={productoActual.precioVenta}
                                onChange={(e) => setProductoActual({ ...productoActual, precioVenta: parseFloat(e.target.value) || 0.0 })}
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

            {/* Modal para Confirmar Eliminación */}
            <Modal show={modalEliminar} onHide={() => setModalEliminar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar <strong>{productoAEliminar?.nombreProducto}</strong>?
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