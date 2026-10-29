// src/pages/cliente/Ofertas.jsx
import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Array de productos de oferta (puedes agregar/quitar los que quieras)
const productosOferta = [
    {
        idProducto: 3,
        nombreProducto: "Aceite Olivar",
        descripcion: "Aceite Olivar de oliva",
        precioVenta: 3.40,
        precioOferta: 2.72,
        stockActual: 50,
        imagenUrl: "/uploads/productos/aceite-olivar.jpg",
    },
    {
        idProducto: 7,
        nombreProducto: "Arroz Costeño",
        descripcion: "Arroz costeño",
        precioVenta: 2.10,
        precioOferta: 1.68,
        stockActual: 50,
        imagenUrl: "/uploads/productos/arroz-costeno.jpg",
    },
    {
        idProducto: 10,
        nombreProducto: "Arroz Faraón",
        descripcion: "Arroz Faraón de calidad",
        precioVenta: 2.30,
        precioOferta: 1.84,
        stockActual: 50,
        imagenUrl: "/uploads/productos/arroz_faraon.jpg",
    },
    {
        idProducto: 25,
        nombreProducto: "Opal",
        descripcion: "Jabón Opal",
        precioVenta: 2.00,
        precioOferta: 1.60,
        stockActual: 50,
        imagenUrl: "/uploads/productos/opal.jpg",
    },
    {
        idProducto: 26,
        nombreProducto: "Patrona",
        descripcion: "Jabón Patrona",
        precioVenta: 2.00,
        precioOferta: 1.60,
        stockActual: 50,
        imagenUrl: "/uploads/productos/patrona.jpg",
    },
    {
        idProducto: 12,
        nombreProducto: "Atún Campomar",
        descripcion: "Atún Campomar enlatado",
        precioVenta: 2.10,
        precioOferta: 1.68,
        stockActual: 50,
        imagenUrl: "/uploads/productos/atun-campomar.jpg",
    }
];

// Función para agregar producto al carrito
const agregarAlCarrito = (producto) => {
    try {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const existente = carrito.find(item => item.id === producto.idProducto);

        if (existente) {
            existente.cantidad += 1;
            Swal.fire({
                icon: "success",
                title: "Cantidad actualizada",
                text: `${producto.nombreProducto} - Cantidad: ${existente.cantidad}`,
                timer: 1200,
                showConfirmButton: false
            });
        } else {
            carrito.push({
                id: producto.idProducto,
                nombre: producto.nombreProducto,
                precio: producto.precioOferta,
                imagen: producto.imagenUrl,
                cantidad: 1
            });
            Swal.fire({
                icon: "success",
                title: "¡Agregado!",
                text: `${producto.nombreProducto} se agregó al carrito`,
                timer: 1200,
                showConfirmButton: false
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        window.dispatchEvent(new Event("carritoActualizado"));
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo agregar al carrito"
        });
    }
};

const Ofertas = () => {
    const navigate = useNavigate();

    return (
        <div className="container my-4">
            <h3 className="mb-4 text-primary">
                <i className="fas fa-fire text-danger me-2"></i>
                Productos en Oferta
            </h3>
            <div className="row">
                {productosOferta.map(producto => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4" key={producto.idProducto}>
                        <div className="card h-100 shadow-sm border-0 hover-card">
                            <div
                                className="card-img-container text-center"
                                style={{ padding: "1rem", cursor: "pointer" }}
                                onClick={() => navigate(`/detalle-oferta/${producto.idProducto}`)}
                            >
                                <img
                                    src={`http://localhost:8080${producto.imagenUrl}`}
                                    alt={producto.nombreProducto}
                                    className="card-img-top"
                                    style={{ height: 140, objectFit: "contain", maxWidth: "100%" }}
                                    onError={(e) => { e.target.src = "/uploads/productos/default.jpg"; }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h6
                                    className="card-title text-truncate"
                                    title={producto.nombreProducto}
                                    style={{ cursor: "pointer", color: "#0d6efd" }}
                                    onClick={() => navigate(`/detalle-oferta/${producto.idProducto}`)}
                                >
                                    {producto.nombreProducto}
                                </h6>
                                <p className="small text-muted mb-2 text-truncate">
                                    {producto.descripcion}
                                </p>
                                <div className="mb-2">
                                    <span className="text-decoration-line-through text-secondary small">
                                        Antes: S/. {producto.precioVenta.toFixed(2)}
                                    </span>
                                    <span className="fw-bold text-success fs-5 ms-2">
                                        S/. {producto.precioOferta.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-primary w-100"
                                    disabled={producto.stockActual === 0}
                                    onClick={() => agregarAlCarrito(producto)}
                                >
                                    <i className="fas fa-cart-plus me-1"></i>
                                    {producto.stockActual === 0 ? "Sin stock" : "Agregar al carrito"}
                                </button>
                                <small className="text-muted mt-2 d-block">
                                    Stock: {producto.stockActual ?? 0} unidades
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ofertas;
