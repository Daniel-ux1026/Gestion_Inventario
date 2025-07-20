import React from "react";
import { Carousel } from "react-bootstrap";
import banner1 from '../../assets/img/banner/banner1.jpg';
import banner2 from '../../assets/img/banner/banner2.jpg';
import banner3 from '../../assets/img/banner/banner3.jpg';

import arroz from '../../assets/img/productos/arroz.jpg';
import aceite from '../../assets/img/productos/aceite.jpg';

const banners = [
    { id: 1, src: banner1, alt: "Oferta 1" },
    { id: 2, src: banner2, alt: "Oferta 2" },
    { id: 3, src: banner3, alt: "Oferta 3" },
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
    // ...más productos
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
            {productosOferta.map((prod) => (
                <div className="col-md-3 mb-4" key={prod.id}>
                    <div className="card h-100">
                        <img
                            src={prod.imagen}
                            className="card-img-top"
                            alt={prod.nombre}
                            style={{ maxHeight: 170, objectFit: "cover" }}
                        />
                        <div className="card-body">
                            <h6 className="card-title">{prod.nombre}</h6>
                            <p className="mb-1 text-decoration-line-through text-secondary">
                                S/. {prod.precio.toFixed(2)}
                            </p>
                            <p className="fw-bold text-success">S/. {prod.precioOferta.toFixed(2)}</p>
                            <button className="btn btn-primary w-100">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Ofertas;
