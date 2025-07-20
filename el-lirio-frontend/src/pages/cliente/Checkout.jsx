import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Checkout = () => {
    const [clienteNombre, setClienteNombre] = useState("");
    const [total, setTotal] = useState("");
    const [metodoPago, setMetodoPago] = useState("YAPE");
    const [comprobante, setComprobante] = useState(null);

    const handleComprobanteChange = (e) => setComprobante(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comprobante) {
            Swal.fire("Debes subir tu comprobante.");
            return;
        }
        const formData = new FormData();
        formData.append("clienteNombre", clienteNombre);
        formData.append("total", total);
        formData.append("metodoPago", metodoPago);
        formData.append("comprobante", comprobante);

        try {
            await axios.post("http://localhost:8080/api/pedidos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            Swal.fire("¡Pedido registrado! Esperando validación del administrador.");
            // limpiar campos si quieres...
        } catch {
            Swal.fire("No se pudo enviar el pedido.");
        }
    };

    return (
        <form className="container my-4" onSubmit={handleSubmit}>
            <h4>Realizar Pedido</h4>
            <input type="text" placeholder="Nombre cliente" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} className="form-control mb-2" required />
            <input type="number" placeholder="Total S/." value={total} onChange={e => setTotal(e.target.value)} className="form-control mb-2" required />
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
