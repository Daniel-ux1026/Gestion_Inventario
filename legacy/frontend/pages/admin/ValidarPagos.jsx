import { useEffect, useState } from "react";
import axios from "axios";

function ValidarPagos() {
    const [pagos, setPagos] = useState([]);

    // Función para cargar los pagos pendientes
    const cargarPagos = () => {
        axios.get("http://localhost:8080/api/pedidos/pendientes")
            .then(res => setPagos(res.data));
    };

    useEffect(() => {
        cargarPagos();
    }, []);

    const aprobar = async (id) => {
        await axios.put(`http://localhost:8080/api/pedidos/${id}/aprobar`);
        // Después de aprobar, recargar la lista
        cargarPagos();
    };

    const rechazar = async (id) => {
        await axios.put(`http://localhost:8080/api/pedidos/${id}/rechazar`);
        // Después de rechazar, recargar la lista
        cargarPagos();
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4 text-center">Pagos Pendientes de Validación</h3>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-secondary" onClick={cargarPagos}>
                    <i className="bi bi-arrow-clockwise"></i> Actualizar
                </button>
            </div>
            <div className="row justify-content-center">
                {pagos.length === 0 && <div className="col-12 text-center">No hay pagos pendientes.</div>}
                {pagos.map(p => (
                    <div key={p.id} className="col-12 col-md-5 col-lg-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-2"><b>Cliente:</b> {p.clienteNombre}</h5>
                                <p className="mb-1"><b>Monto:</b> S/ {p.total}</p>
                                <p className="mb-3"><b>Metodo:</b> {p.metodoPago}</p>
                                <img src={`http://localhost:8080${p.comprobanteUrl}`}
                                     alt="Comprobante"
                                     style={{ width: "100%", maxHeight: 180, objectFit: "contain", border: "1px solid #eee", marginBottom: 15 }} />
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-success w-48" onClick={() => aprobar(p.id)}>Aprobar</button>
                                    <button className="btn btn-danger w-48" onClick={() => rechazar(p.id)}>Rechazar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ValidarPagos;
