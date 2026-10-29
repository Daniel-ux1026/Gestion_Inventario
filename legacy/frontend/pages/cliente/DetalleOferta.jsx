// src/pages/cliente/DetalleOferta.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// ¡Mismo array de productos oferta!
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

// Agregar al carrito (misma lógica que en Ofertas.jsx)
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

const DetalleOferta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const producto = productosOferta.find(p => p.idProducto === Number(id));

    if (!producto) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    Producto no encontrado. <button className="btn btn-link" onClick={() => navigate("/ofertas")}>Volver a Ofertas</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-md-5 text-center mb-4">
                    <img
                        src={`http://localhost:8080${producto.imagenUrl}`}
                        alt={producto.nombreProducto}
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "350px", objectFit: "contain" }}
                        onError={e => { e.target.src = "/uploads/productos/default.jpg"; }}
                    />
                </div>
                <div className="col-md-7">
                    <h2>{producto.nombreProducto}</h2>
                    <p className="text-muted">{producto.descripcion}</p>
                    <p>
                        <span className="text-decoration-line-through text-secondary">
                            S/ {producto.precioVenta.toFixed(2)}
                        </span>
                        <span className="fw-bold text-success fs-4 ms-3">
                            S/ {producto.precioOferta.toFixed(2)}
                        </span>
                    </p>
                    <p>
                        <span className="badge bg-danger fs-6">-20%</span>
                        <span className="ms-3">Stock: {producto.stockActual}</span>
                    </p>
                    <button
                        className="btn btn-primary btn-lg w-100 mt-3"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stockActual === 0}
                    >
                        <i className="fas fa-cart-plus me-2"></i>
                        {producto.stockActual === 0 ? "Sin stock" : "Agregar al carrito"}
                    </button>
                    <button
                        className="btn btn-link mt-2"
                        onClick={() => navigate("/ofertas")}
                    >
                        ← Volver a Ofertas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleOferta;
