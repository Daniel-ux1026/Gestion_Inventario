import { useEffect, useState } from "react";
import axios from "axios";

function ValidarPagos() {
    const [pagos, setPagos] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/pedidos/pendientes")
            .then(res => setPagos(res.data));
    }, []);

    const aprobar = async (id) => {
        await axios.put(`http://localhost:8080/api/pedidos/${id}/aprobar`);
        setPagos(pagos.filter(p => p.id !== id));
    };

    const rechazar = async (id) => {
        await axios.put(`http://localhost:8080/api/pedidos/${id}/rechazar`);
        setPagos(pagos.filter(p => p.id !== id));
    };

    return (
        <div className="container mt-4">
            <h4>Pagos Pendientes de Validación</h4>
            <div className="row">
                {pagos.length === 0 && <div>No hay pagos pendientes.</div>}
                {pagos.map(p => (
                    <div key={p.id} className="col-md-4 mb-3">
                        <div className="card p-3">
                            <p><b>Cliente:</b> {p.clienteNombre}</p>
                            <p><b>Monto:</b> S/ {p.total}</p>
                            <p><b>Método:</b> {p.metodoPago}</p>
                            <img src={`http://localhost:8080${p.comprobanteUrl}`} alt="Comprobante" style={{ maxWidth: 200 }} />
                            <div className="mt-2">
                                <button className="btn btn-success me-2" onClick={() => aprobar(p.id)}>Aprobar</button>
                                <button className="btn btn-danger" onClick={() => rechazar(p.id)}>Rechazar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ValidarPagos;
