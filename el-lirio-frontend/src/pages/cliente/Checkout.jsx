import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Utilidades de carrito
const obtenerCarrito = () => {
    try {
        const data = JSON.parse(localStorage.getItem("carrito"));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};
const guardarCarrito = (data) => {
    localStorage.setItem("carrito", JSON.stringify(data));
};

const Checkout = () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const emailUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).email : "";
    const nombreUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).nombre : "";
    const navigate = useNavigate();

    const [clienteNombre, setClienteNombre] = useState(nombreUsuario || "");
    const [metodoPago, setMetodoPago] = useState("YAPE");
    const [comprobante, setComprobante] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const data = obtenerCarrito();
        setCarrito(data);
    }, []);

    useEffect(() => {
        const totalCalculado = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        setTotal(totalCalculado);
    }, [carrito]);

    const actualizarCantidad = (idx, delta) => {
        const nuevo = [...carrito];
        const nuevaCantidad = nuevo[idx].cantidad + delta;
        if (nuevaCantidad >= 1 && nuevaCantidad <= 99) {
            nuevo[idx].cantidad = nuevaCantidad;
            setCarrito(nuevo);
            guardarCarrito(nuevo);
        }
    };

    const eliminarItem = (idx) => {
        const nuevo = carrito.filter((_, i) => i !== idx);
        setCarrito(nuevo);
        guardarCarrito(nuevo);
    };

    const handleComprobanteChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return Swal.fire('Error', 'Formato no válido. Usa JPG, PNG o GIF.', 'error');
        }
        if (file.size > 5 * 1024 * 1024) {
            return Swal.fire('Error', 'Archivo demasiado grande (máx. 5MB).', 'error');
        }
        setComprobante(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clienteNombre.trim()) {
            return Swal.fire('Falta nombre', 'Ingresa tu nombre completo.', 'warning');
        }
        if (!comprobante) {
            return Swal.fire('Falta comprobante', 'Sube el comprobante de pago.', 'warning');
        }
        if (carrito.length === 0) {
            return Swal.fire('Carrito vacío', 'Agrega productos antes de enviar.', 'warning');
        }
        if (!emailUsuario) {
            return Swal.fire('Error', 'No se detectó tu sesión. Por favor, vuelve a iniciar sesión.', 'error');
        }

        setLoading(true);

        // Log para ver si se está enviando el email
        console.log("Enviando pedido con clienteEmail:", emailUsuario);

        const formData = new FormData();
        formData.append("clienteNombre", clienteNombre.trim());
        formData.append("clienteEmail", emailUsuario); // <--- ¡Clave!
        formData.append("total", total.toFixed(2));
        formData.append("metodoPago", metodoPago);
        formData.append("comprobante", comprobante);
        formData.append("productos", JSON.stringify(carrito));

        try {
            await axios.post("http://localhost:8080/api/pedidos", formData);
            await Swal.fire('¡Éxito!', 'Pedido enviado correctamente.', 'success');
            setClienteNombre(nombreUsuario || "");
            setComprobante(null);
            setCarrito([]);
            setTotal(0);
            guardarCarrito([]);
            navigate("/mis-pedidos"); // Redirige al historial
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo enviar el pedido.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="bg-light p-4 rounded shadow-sm">
                <h2 className="text-center mb-4"><i className="fas fa-shopping-cart me-2"></i>Realizar Pedido</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nombre completo *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej. Juan Pérez"
                            value={clienteNombre}
                            onChange={(e) => setClienteNombre(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Productos seleccionados:</label>
                        {carrito.length === 0 ? (
                            <div className="alert alert-warning">No hay productos en el carrito.</div>
                        ) : (
                            <table className="table table-bordered">
                                <thead className="table-secondary">
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th className="text-center">Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {carrito.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.nombre}</td>
                                        <td>S/. {item.precio.toFixed(2)}</td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-sm btn-outline-dark me-1" onClick={() => actualizarCantidad(idx, -1)}>-</button>
                                            <span className="px-2 fw-bold">{item.cantidad}</span>
                                            <button type="button" className="btn btn-sm btn-outline-dark ms-1" onClick={() => actualizarCantidad(idx, 1)}>+</button>
                                        </td>
                                        <td>S/. {(item.precio * item.cantidad).toFixed(2)}</td>
                                        <td>
                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => eliminarItem(idx)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        <div className="text-end fw-bold">Total: S/. {total.toFixed(2)}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Metodo de pago *</label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="YAPE">Yape</option>
                            <option value="PLIN">Plin</option>
                            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                        </select>
                    </div>
                    <div className="alert alert-info">
                        <strong>Información para el pago:</strong><br />
                        {metodoPago === "YAPE" && "Número Yape: 987-654-321 - EL LIRIO DE LOS VALLES S.A.C"}
                        {metodoPago === "PLIN" && "Número Plin: 987-654-321 - EL LIRIO DE LOS VALLES S.A.C"}
                        {metodoPago === "TRANSFERENCIA" && (
                            <>
                                Banco: BCP<br />
                                Cuenta: 123-456-789-012<br />
                                CCI: 002-123-456-789-012-34<br />
                                Titular: EL LIRIO DE LOS VALLES S.A.C
                            </>
                        )}
                        <br />
                        <small className="text-muted">Monto: S/. {total.toFixed(2)}</small>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Comprobante de pago *</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleComprobanteChange}
                            className="form-control"
                            disabled={loading}
                            required
                        />
                        {comprobante && (
                            <small className="text-success mt-1 d-block">Archivo: {comprobante.name}</small>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || carrito.length === 0}
                        className="btn btn-success w-100"
                    >
                        {loading ? 'Enviando pedido...' : 'Enviar Pedido'}
                    </button>
                    <div className="alert alert-warning mt-3 text-center">
                        Tu pedido será validado. Te contactaremos en máximo 24h.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
