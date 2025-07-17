import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { agregarAlCarrito } from "./utils/carrito";

const DetalleOferta = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Obtener producto desde el backend
    useEffect(() => {
        const fetchProducto = async () => {
            setCargando(true);
            setError("");
            try {
                // Cambia la URL por la de tu backend
                const { data } = await axios.get(`http://localhost:8080/api/productos/oferta/${id}`);
                setProducto(data);

                // Buscar productos relacionados en la misma categoría, pero diferente id
                const { data: relacionadosData } = await axios.get(
                    `http://localhost:8080/api/productos/oferta?categoria=${data.categoria}&exclude=${data.id}&limit=3`
                );
                setRelacionados(relacionadosData);
            } catch (e) {
                setError("Producto no encontrado.");
                setProducto(null);
                setRelacionados([]);
            } finally {
                setCargando(false);
            }
        };
        fetchProducto();
    }, [id]);

    if (cargando) return <h4 className="text-center mt-5">Cargando...</h4>;
    if (error || !producto) return <h4 className="text-center mt-5">{error || "Producto no encontrado."}</h4>;

    const handleAgregar = () => {
        for (let i = 0; i < cantidad; i++) {
            agregarAlCarrito(producto);
        }
        alert(`✅ Se agregó ${producto.nombre}`);
    };

    return (
        <div className="container py-4">
            <div className="row align-items-start">
                <div className="col-md-5 text-center mb-3">
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid"
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                </div>
                <div className="col-md-7">
                    <h3>{producto.nombre}</h3>
                    <p className="text-muted text-decoration-line-through">
                        S/ {producto.precioOriginal.toFixed(2)}
                    </p>
                    <p className="text-success fs-4">S/ {producto.precioOferta.toFixed(2)}</p>

                    <div className="mb-3">
                        <label htmlFor="cantidad" className="form-label">Cantidad</label>
                        <input
                            type="number"
                            id="cantidad"
                            className="form-control"
                            value={cantidad}
                            onChange={(e) => setCantidad(Math.max(1, Math.min(3, Number(e.target.value))))}
                            min={1}
                            max={3}
                        />
                    </div>

                    <button className="btn btn-dark w-100" onClick={handleAgregar}>
                        <i className="bi bi-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            </div>

            {/* Productos relacionados */}
            <div className="mt-5">
                <h5>Productos relacionados</h5>
                <div className="row g-3">
                    {relacionados.length === 0 && (
                        <p className="text-muted">No hay productos relacionados.</p>
                    )}
                    {relacionados.map((rel) => (
                        <div className="col-sm-6 col-md-4" key={rel.id}>
                            <div className="card h-100">
                                <img
                                    src={rel.imagen}
                                    className="card-img-top"
                                    style={{ height: "150px", objectFit: "contain" }}
                                    alt={rel.nombre}
                                />
                                <div className="card-body">
                                    <h6>{rel.nombre}</h6>
                                    <p className="text-success fw-bold">S/ {rel.precioOferta.toFixed(2)}</p>
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => window.location.href = `/detalle-oferta/${rel.id}`}
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetalleOferta;
