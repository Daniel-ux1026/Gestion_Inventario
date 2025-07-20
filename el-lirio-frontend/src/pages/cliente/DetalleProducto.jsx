import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { agregarAlCarrito } from "./utils/carrito.js";
import Swal from "sweetalert2";
import axios from "axios";
import "../admin/styles/DetalleProducto.css"

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/productos/${id}`)
            .then(res => setProducto(res.data.data))
            .catch(err => setProducto(null));
    }, [id]);

    if (!producto) return (
        <div className="container py-5 text-center">
            <h4>Cargando detalle...</h4>
        </div>
    );

    const handleAdd = () => {
        for (let i = 0; i < cantidad; i++) {
            agregarAlCarrito({
                id: producto.idProducto,
                nombre: producto.nombreProducto,
                precio: producto.precioVenta,
                imagen: producto.urlImagen,
                stock: producto.stockActual,
            });
        }
        Swal.fire({
            icon: "success",
            title: "¡Agregado al carrito!",
            text: `${producto.nombreProducto} x${cantidad}`,
            timer: 1200,
            showConfirmButton: false
        });
    };

    return (
        <div className="container py-4">
            <div className="row g-4 align-items-start">
                {/* Imagen principal */}
                <div className="col-md-5 text-center">
                    <div className="bg-white p-3 rounded shadow position-relative" style={{ minHeight: 330 }}>
                        <img
                            src={`http://localhost:8080${producto.urlImagen}`}
                            alt={producto.nombreProducto}
                            style={{
                                maxHeight: "300px",
                                objectFit: "contain",
                                width: "100%",
                                transition: "transform 0.3s",
                                borderRadius: "12px"
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                            onError={e => e.target.src = "/uploads/productos/default.jpg"}
                        />
                        {producto.stockActual <= 5 && (
                            <span className="badge bg-warning position-absolute top-0 end-0 m-2">¡Últimas unidades!</span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="col-md-7">
                    <h2 className="fw-bold mb-2">{producto.nombreProducto}</h2>
                    <p className="text-muted mb-1">{producto.descripcion}</p>

                    <div className="mb-2">
                        <span className="h4 text-success fw-bold me-3">
                            S/ {Number(producto.precioVenta).toFixed(2)}
                        </span>
                        {/* Precio tachado si quieres mostrar descuento */}
                        {producto.precioAnterior && (
                            <span className="text-secondary text-decoration-line-through">
                                S/ {Number(producto.precioAnterior).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="mb-2">
                        <span className={`fw-bold ${producto.stockActual > 0 ? 'text-success' : 'text-danger'}`}>
                            {producto.stockActual > 0 ? `Disponible (${producto.stockActual} uds)` : "Sin stock"}
                        </span>
                    </div>

                    {/* Selector de cantidad */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Cantidad:</label>
                        <div className="input-group" style={{ maxWidth: 140 }}>
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                            >-</button>
                            <input
                                type="number"
                                className="form-control text-center"
                                value={cantidad}
                                min={1}
                                max={producto.stockActual}
                                onChange={e => setCantidad(Math.max(1, Math.min(producto.stockActual, Number(e.target.value))))}
                                style={{ fontWeight: 600 }}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setCantidad(Math.min(producto.stockActual, cantidad + 1))}
                            >+</button>
                        </div>
                    </div>

                    {/* Botón agregar al carrito */}
                    <button
                        className="btn btn-primary btn-lg w-100 shadow-sm"
                        style={{ fontWeight: "bold", fontSize: 18 }}
                        onClick={handleAdd}
                        disabled={producto.stockActual === 0}
                    >
                        <i className="fas fa-cart-plus me-2"></i>
                        {producto.stockActual === 0 ? "Sin stock" : "Añadir al carrito"}
                    </button>
                </div>
            </div>

            {/* Puedes mostrar productos relacionados aquí */}
        </div>
    );
};

export default DetalleProducto;
