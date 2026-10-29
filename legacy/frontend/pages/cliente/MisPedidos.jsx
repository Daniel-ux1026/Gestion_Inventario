import { useEffect, useState } from "react";
import axios from "axios";

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener usuario del localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    const clienteEmail = usuarioGuardado ? JSON.parse(usuarioGuardado).email : "";

    useEffect(() => {
        if (!clienteEmail) {
            setLoading(false);
            setError("No se encontró información del usuario. Por favor, inicia sesión.");
            return;
        }

        const fetchPedidos = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/pedidos/cliente/email/${encodeURIComponent(clienteEmail)}`
                );
                console.log("Pedidos recibidos en frontend:", response.data);
                setPedidos(response.data);
                setError(null);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setError("No tienes autorización para ver esta información. Por favor, inicia sesión nuevamente.");
                } else if (error.response?.status === 404) {
                    setError("No se encontraron pedidos para tu cuenta.");
                    setPedidos([]);
                } else {
                    setError(`Error al cargar pedidos: ${error.message}`);
                }
                setPedidos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [clienteEmail]);

    if (loading) {
        return (
            <div className="container py-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando tus pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h3 className="mb-4 text-center">
                <i className="fas fa-history me-2"></i>
                Mis Pedidos
            </h3>

            {error && (
                <div className="alert alert-danger text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <br />
                    <a href="/login" className="btn btn-primary btn-sm mt-2">
                        Iniciar Sesión
                    </a>
                </div>
            )}

            {!clienteEmail ? (
                <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Debes iniciar sesión para ver tus pedidos.
                    <br />
                    <a href="/login" className="btn btn-primary btn-sm mt-2">
                        Iniciar Sesión
                    </a>
                </div>
            ) : !error && pedidos.length === 0 ? (
                <div className="alert alert-info text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    No tienes pedidos aún.
                    <br />
                    <a href="/productos" className="btn btn-primary btn-sm mt-2">
                        Ver productos
                    </a>
                </div>
            ) : !error && (
                <div className="row">
                    {pedidos.map(p => (
                        <div key={p.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="card-title">Pedido #{p.id}</h6>
                                        {p.estado === "PENDIENTE_VALIDACION" && <span className="badge bg-warning">Pendiente</span>}
                                        {p.estado === "APROBADO" && <span className="badge bg-success">Aprobado</span>}
                                        {p.estado === "RECHAZADO" && <span className="badge bg-danger">Rechazado</span>}
                                    </div>
                                    <p className="mb-1">
                                        <i className="fas fa-calendar me-1"></i>
                                        <small>{new Date(p.fechaCreacion).toLocaleString()}</small>
                                    </p>
                                    <p className="mb-1">
                                        <i className="fas fa-money-bill me-1"></i>
                                        <strong>S/ {p.total}</strong>
                                    </p>
                                    <p className="mb-2">
                                        <i className="fas fa-credit-card me-1"></i>
                                        {p.metodoPago}
                                    </p>
                                    <hr />
                                    <h6>Productos:</h6>
                                    <ul className="list-unstyled small">
                                        {(() => {
                                            try {
                                                const arr = JSON.parse(p.productos);
                                                if (!Array.isArray(arr)) return <li>Sin productos</li>;
                                                return arr.map((prod, idx) => (
                                                    <li key={idx} className="mb-1">
                                                        <i className="fas fa-box me-1"></i>
                                                        {prod.nombre} x {prod.cantidad} — S/ {(prod.precio * prod.cantidad).toFixed(2)}
                                                    </li>
                                                ));
                                            } catch (e) {
                                                return <li>Error al cargar productos</li>;
                                            }
                                        })()}
                                    </ul>
                                    {p.comprobanteUrl && (
                                        <div className="mt-2">
                                            <small className="text-muted">Comprobante:</small><br />
                                            <img
                                                src={`http://localhost:8080${p.comprobanteUrl}`}
                                                alt="Comprobante"
                                                className="img-thumbnail"
                                                style={{ maxWidth: "100px", cursor: "pointer" }}
                                                onClick={() => window.open(`http://localhost:8080${p.comprobanteUrl}`, '_blank')}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            <span style={{ display: 'none' }} className="text-muted">
                                                Comprobante no disponible
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisPedidos;
