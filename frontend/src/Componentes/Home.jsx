import React, { useState } from 'react';

// Datos simulados para productos y categorías
const productos = [
    { id: 1, nombre: "Fideo Benoti", precio: 65, img: "/imagenes/fideo-benoti.jpg", categoria: "Fideos" },
    { id: 2, nombre: "Aceite", precio: 65, img: "/imagenes/aceite.jpg", categoria: "Aceites" },
    { id: 3, nombre: "Arroz", precio: 150, img: "/imagenes/arroz.jpg", categoria: "Arroz" },
    { id: 4, nombre: "Aceite de 20 L", precio: 150, img: "/imagenes/aceite-20l.jpg", categoria: "Aceites" },
    { id: 5, nombre: "Aceite La Patrona", precio: 130, img: "/imagenes/aceite-patrona.jpg", categoria: "Aceites" },
    { id: 6, nombre: "Aceite Palmerola", precio: 145, img: "/imagenes/aceite-palmerola.jpg", categoria: "Aceites" },
    { id: 7, nombre: "Bolsa Rayo", precio: 9, img: "/imagenes/bolsa-rayo.jpg", categoria: "Fideos" },
    { id: 8, nombre: "Aceite B-1", precio: 68, img: "/imagenes/aceite-b1.jpg", categoria: "Aceites" },
];

// Categorías únicas para filtros
const categorias = [...new Set(productos.map(p => p.categoria))];

export default function Home() {
    const [busqueda, setBusqueda] = useState("");
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(categorias);
    const [rangoPrecio, setRangoPrecio] = useState([0, 200]);

    // Maneja selección de categorías (checkbox)
    const toggleCategoria = (categoria) => {
        if (categoriasSeleccionadas.includes(categoria)) {
            setCategoriasSeleccionadas(categoriasSeleccionadas.filter(c => c !== categoria));
        } else {
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoria]);
        }
    };

    // Filtrado de productos según filtros
    const productosFiltrados = productos.filter(producto => {
        const dentroCategoria = categoriasSeleccionadas.includes(producto.categoria);
        const dentroPrecio = producto.precio >= rangoPrecio[0] && producto.precio <= rangoPrecio[1];
        const contieneBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return dentroCategoria && dentroPrecio && contieneBusqueda;
    });

    return (
        <>
            {/* Navbar rojo */}
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#e10000' }}>
                <div className="container">
                    {/* Icono menu hamburguesa */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                        <span className="navbar-toggler-icon" style={{color: 'white'}}><i className="bi bi-list"></i></span>
                    </button>

                    {/* Logo y nombre */}
                    <a className="navbar-brand mx-auto d-flex align-items-center" href="#">
                        <img src="/imagenes/lirio-logo.png" alt="Lirio" style={{ height: '40px', marginRight: '10px' }} />
                        <span style={{ color: 'white', fontWeight: 'bold' }}>EL LIRIO DE LOS VALLES S.A.C</span>
                    </a>

                    {/* Iconos a la derecha */}
                    <div className="d-flex align-items-center">
                        <i className="bi bi-person fs-4 text-white mx-3" title="Usuario"></i>
                        <i className="bi bi-cart fs-4 text-white"></i>
                    </div>
                </div>
            </nav>

            <div className="container-fluid mt-3">
                <div className="row">
                    {/* Sidebar filtros */}
                    <aside className="col-lg-2 border-end">
                        <h6>Categorías</h6>
                        {categorias.map(cat => (
                            <div key={cat} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={cat}
                                    checked={categoriasSeleccionadas.includes(cat)}
                                    onChange={() => toggleCategoria(cat)}
                                />
                                <label className="form-check-label" htmlFor={cat}>{cat}</label>
                            </div>
                        ))}

                        <h6 className="mt-4">Rango de Precio</h6>
                        <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="200"
                            value={rangoPrecio[1]}
                            onChange={(e) => setRangoPrecio([0, Number(e.target.value)])}
                        />
                        <div>0 - S/.{rangoPrecio[1]}</div>
                    </aside>

                    {/* Contenido principal */}
                    <main className="col-lg-10">
                        {/* Buscador */}
                        <div className="mb-3 d-flex justify-content-end">
                            <input
                                type="search"
                                className="form-control w-50"
                                placeholder="Value"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        {/* Grid de productos */}
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                            {productosFiltrados.map(producto => (
                                <div key={producto.id} className="col">
                                    <div className="card h-100">
                                        <img
                                            src={producto.img}
                                            className="card-img-top"
                                            alt={producto.nombre}
                                            style={{ objectFit: 'cover', height: '150px' }}
                                        />
                                        <div className="card-body">
                                            <h6>{producto.nombre}</h6>
                                            <p className="mb-1">S/.{producto.precio}</p>
                                            <p className="text-muted small">Descripción</p>
                                            <button className="btn btn-dark btn-sm">Añadir</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-top mt-5 p-3 d-flex justify-content-between">
                <div>
                    <a href="#" className="me-2 text-dark text-decoration-none">
                        <i className="bi bi-x-lg"></i>
                    </a>
                    <a href="#" className="me-2 text-dark text-decoration-none">
                        <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="me-2 text-dark text-decoration-none">
                        <i className="bi bi-youtube"></i>
                    </a>
                    <a href="#" className="text-dark text-decoration-none">
                        <i className="bi bi-linkedin"></i>
                    </a>
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                    Inversiones El Lirio de los Valles S.A.C. RUC 20480460538. Todos los derechos reservados.
                </div>
                <div>
                    <a href="#" className="me-3 text-dark text-decoration-none">Libro de reclamaciones</a>
                    <a href="#" className="text-dark text-decoration-none">Redes sociales</a>
                </div>
            </footer>
        </>
    );
}
