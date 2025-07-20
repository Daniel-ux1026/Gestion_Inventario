import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Helper para manejar localStorage carrito
const obtenerCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];
const guardarCarrito = (data) => localStorage.setItem("carrito", JSON.stringify(data));

const Checkout = () => {
    const [clienteNombre, setClienteNombre] = useState("");
    const [metodoPago, setMetodoPago] = useState("YAPE");
    const [comprobante, setComprobante] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    // Cargar carrito al iniciar
    useEffect(() => {
        const data = obtenerCarrito();
        setCarrito(data);
    }, []);

    // Calcular total cuando cambie el carrito
    useEffect(() => {
        const t = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        setTotal(t);
    }, [carrito]);

    // Sumar cantidad
    const aumentar = (idx) => {
        const nuevo = [...carrito];
        if (nuevo[idx].cantidad < 99) {
            nuevo[idx].cantidad += 1;
            setCarrito(nuevo);
            guardarCarrito(nuevo);
        }
    };

    // Restar cantidad
    const disminuir = (idx) => {
        const nuevo = [...carrito];
        if (nuevo[idx].cantidad > 1) {
            nuevo[idx].cantidad -= 1;
            setCarrito(nuevo);
            guardarCarrito(nuevo);
        }
    };

    // Eliminar producto
    const eliminar = (idx) => {
        const nuevo = carrito.filter((_, i) => i !== idx);
        setCarrito(nuevo);
        guardarCarrito(nuevo);
    };

    // Manejar comprobante
    const handleComprobanteChange = (e) => setComprobante(e.target.files[0]);

    // Enviar pedido
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comprobante) {
            Swal.fire("Debes subir tu comprobante.");
            return;
        }
        if (!clienteNombre.trim()) {
            Swal.fire("Escribe tu nombre.");
            return;
        }
        if (carrito.length === 0) {
            Swal.fire("El carrito está vacío.");
            return;
        }

        const formData = new FormData();
        formData.append("clienteNombre", clienteNombre);
        formData.append("total", total);
        formData.append("metodoPago", metodoPago);
        formData.append("comprobante", comprobante);
        formData.append("productos", JSON.stringify(carrito));

        try {
            await axios.post("http://localhost:8080/api/pedidos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            Swal.fire("¡Pedido registrado! Esperando validación del administrador.");
            setClienteNombre("");
            setComprobante(null);
            setCarrito([]);
            setTotal(0);
            guardarCarrito([]);
        } catch {
            Swal.fire("No se pudo enviar el pedido.");
        }
    };

    return (
        <form className="container my-4" onSubmit={handleSubmit}>
            <h4>Realizar Pedido</h4>
            <input type="text"
                   placeholder="Nombre cliente"
                   value={clienteNombre}
                   onChange={e => setClienteNombre(e.target.value)}
                   className="form-control mb-2"
                   required
            />

            {/* Productos elegidos */}
            <div className="mb-3">
                <h6>Productos seleccionados:</h6>
                <table className="table table-sm table-bordered">
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {carrito.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center text-secondary">
                                No hay productos en el carrito.
                            </td>
                        </tr>
                    )}
                    {carrito.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.nombre}</td>
                            <td>S/. {item.precio.toFixed(2)}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <button type="button" className="btn btn-outline-secondary btn-sm me-1" onClick={() => disminuir(idx)}>-</button>
                                    <span style={{ width: "2rem", textAlign: "center" }}>{item.cantidad}</span>
                                    <button type="button" className="btn btn-outline-secondary btn-sm ms-1" onClick={() => aumentar(idx)}>+</button>
                                </div>
                            </td>
                            <td>S/. {(item.precio * item.cantidad).toFixed(2)}</td>
                            <td>
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(idx)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-2">
                <strong>Total: S/. {total.toFixed(2)}</strong>
            </div>

            <select className="form-select mb-2" value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                <option value="YAPE">Yape</option>
                <option value="PLIN">Plin</option>
                <option value="TRANSFERENCIA">Transferencia</option>
            </select>
            <input type="file" accept="image/*" onChange={handleComprobanteChange} className="form-control mb-2" required />
            <button type="submit" className="btn btn-success">Enviar Pedido</button>
        </form>
    );
};

export default Checkout;
