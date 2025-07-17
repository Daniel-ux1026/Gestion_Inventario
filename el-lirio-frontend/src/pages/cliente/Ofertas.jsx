import React, { useEffect, useState } from "react";
import axios from "axios";

const Ofertas = () => {
    const [productosOferta, setProductosOferta] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/ofertas")
            .then(res => setProductosOferta(res.data || []))
            .catch(() => setProductosOferta([]));
    }, []);

    if (productosOferta.length === 0) {
        return <div className="container text-center mt-5"><h3>No hay ofertas disponibles en este momento.</h3></div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-danger mb-4 text-center">🔥 Ofertas Especiales 🔥</h2>
            <div className="row">
                {productosOferta.map(prod => (
                    <div className="col-sm-6 col-md-4 col-lg-3" key={prod.idProducto}>
                        <div className="card mb-4 border-danger shadow-sm position-relative">
                            <span className="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">
                                -{prod.porcentajeDescuento || Math.round(100 - prod.precioOferta * 100 / prod.precioVenta)}%
                            </span>
                            <img
                                src={`http://localhost:8080${prod.urlImagen}`}
                                alt={prod.nombreProducto}
                                className="card-img-top"
                                style={{ height: "180px", objectFit: "contain" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{prod.nombreProducto}</h5>
                                <p className="card-text small">{prod.descripcion}</p>
                                <div>
                                    <span className="text-secondary text-decoration-line-through me-2">
                                        S/ {prod.precioVenta}
                                    </span>
                                    <span className="text-danger fw-bold fs-5">
                                        S/ {prod.precioOferta}
                                    </span>
                                </div>
                                <button className="btn btn-outline-danger w-100 mt-2">
                                    <i className="bi bi-cart-plus"></i> Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Ofertas;
