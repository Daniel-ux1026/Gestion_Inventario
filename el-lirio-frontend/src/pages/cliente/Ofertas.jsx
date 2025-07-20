import React from "react";
import { Carousel } from "react-bootstrap";

// Banners (asegúrate que existan estos archivos en tu estructura)
import banner1 from "../../assets/img/banner/banner1.jpg";
import banner2 from "../../assets/img/banner/banner2.jpg";
import banner3 from "../../assets/img/banner/banner3.jpg";
import banner4 from "../../assets/img/banner/banner4.jpg";
import banner5 from "../../assets/img/banner/banner5.jpg";

// Productos (asegúrate de tener estas imágenes)
import arroz from "../../../../uploads/productos/arroz.jpg";
import aceite from "../../../../uploads/productos/aceite.jpg";
import atun from "../../../../uploads/productos/atun-campomar.jpg";
import cafe from "../../../../uploads/productos/cafe_altomayo.jpg";
import fideo from "../../../../uploads/productos/fideos.jpg";

const banners = [
    { id: 1, src: banner1, alt: "Oferta 1" },
    { id: 2, src: banner2, alt: "Oferta 2" },
    { id: 3, src: banner3, alt: "Oferta 3" },
    { id: 4, src: banner4, alt: "Oferta 4" },
    { id: 5, src: banner5, alt: "Oferta 5" },
];

const productosOferta = [
    {
        id: 1,
        nombre: "Arroz Extra Costeño",
        precio: 10.5,
        precioOferta: 7.99,
        imagen: arroz,
    },
    {
        id: 2,
        nombre: "Aceite Primor",
        precio: 9.5,
        precioOferta: 6.99,
        imagen: aceite,
    },
    {
        id: 3,
        nombre: "Atún Campomar",
        precio: 7.0,
        precioOferta: 5.20,
        imagen: atun,
    },
    {
        id: 4,
        nombre: "Café Altomayo",
        precio: 15.5,
        precioOferta: 11.50,
        imagen: cafe,
    },
    {
        id: 5,
        nombre: "Fideos Don Vittorio",
        precio: 6.2,
        precioOferta: 4.80,
        imagen: fideo,
    },
];

const Ofertas = () => (
    <div className="container my-4">
        {/* Banner/Carrusel */}
        <Carousel>
            {banners.map((banner) => (
                <Carousel.Item key={banner.id}>
                    <img
                        className="d-block w-100"
                        src={banner.src}
                        alt={banner.alt}
                        style={{ maxHeight: 300, objectFit: "cover" }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>

        {/* Productos en oferta */}
        <h4 className="mt-4 mb-3">Productos en Oferta</h4>
        <div className="row">
            {productosOferta.length === 0 ? (
                <div className="col-12">
                    <p className="text-center">No hay ofertas disponibles en este momento.</p>
                </div>
            ) : (
                productosOferta.map((prod) => (
                    <div className="col-md-3 mb-4" key={prod.id}>
                        <div className="card h-100">
                            <img
                                src={prod.imagen}
                                className="card-img-top"
                                alt={prod.nombre}
                                style={{ maxHeight: 290, objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h6 className="card-title">{prod.nombre}</h6>
                                <p className="mb-1 text-decoration-line-through text-secondary">
                                    S/. {prod.precio.toFixed(2)}
                                </p>
                                <p className="fw-bold text-success">
                                    S/. {prod.precioOferta.toFixed(2)}
                                </p>
                                <button className="btn btn-primary w-100">
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

export default Ofertas;
