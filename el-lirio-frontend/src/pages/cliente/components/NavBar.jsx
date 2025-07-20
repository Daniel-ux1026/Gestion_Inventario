import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerCarrito } from "../utils/carrito";

const Navbar = () => {
    const [cantidad, setCantidad] = useState(0);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Función para actualizar cantidad del carrito
        const actualizarCantidad = () => {
            const carrito = obtenerCarrito();
            setCantidad(carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0));
        };

        // Escuchar cambios en el carrito (evento global)
        window.addEventListener("carritoActualizado", actualizarCantidad);
        // Carga inicial
        actualizarCantidad();

        // Leer usuario al cargar
        const usuarioGuardado = localStorage.getItem("usuario");
        setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);

        // Cleanup listener al desmontar
        return () => window.removeEventListener("carritoActualizado", actualizarCantidad);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario(null);
        navigate("/login");
    };

    return (
        <header className="header-navbar">
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg,#dc3545,#c82333)", boxShadow: "0 2px 10px rgba(220,53,69,0.16)" }}>
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                        <span className="logo-icon d-flex align-items-center justify-content-center">
                            <i className="bi bi-flower1" style={{ fontSize: "1.8rem", color: "#dc3545", background: "#fff", borderRadius: "8px", padding: "5px" }}></i>
                        </span>
                        <div style={{ lineHeight: "1" }}>
                            <span style={{ fontSize: "0.95rem", fontWeight: "bold", letterSpacing: ".5px" }}>EL LIRIO DE LOS VALLES S.A.C</span><br />
                            <span style={{ fontSize: "0.8rem", opacity: "0.8" }}>LIRIO</span>
                        </div>
                    </Link>
                    {/* Hamburger for mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* Nav links */}
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav ms-auto align-items-center gap-2">
                            {/* Ofertas */}
                            <li className="nav-item">
                                <Link to="/ofertas" className="nav-link text-white d-flex align-items-center gap-1">
                                    <i className="bi bi-tags-fill"></i> Ofertas
                                </Link>
                            </li>
                            {/* Usuario/Rol */}
                            <li className="nav-item">
                                {usuario ? (
                                    <div className="d-flex align-items-center">
                                        <span className="nav-link text-white fw-bold d-flex align-items-center gap-1">
                                            <i className="bi bi-person-circle"></i>
                                            {usuario.nombre || usuario.email || usuario.sub || "Cliente"}
                                            {usuario.rol?.nombreRol && (
                                                <span className="badge bg-light text-dark ms-2" style={{ fontSize: "0.75rem" }}>
                                                    {usuario.rol?.nombreRol?.toUpperCase()}
                                                </span>
                                            )}
                                        </span>
                                        <button
                                            className="btn btn-outline-light btn-sm ms-2"
                                            onClick={handleLogout}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="nav-link text-white">
                                        <i className="bi bi-person-circle"></i> Iniciar / Crear cuenta
                                    </Link>
                                )}
                            </li>
                            {/* Carrito */}
                            <li className="nav-item">
                                <Link to="/checkout" className="btn btn-light position-relative ms-1" style={{ fontWeight: 500 }}>
                                    <i className="bi bi-cart3 me-1"></i> Carrito
                                    {cantidad > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                                            {cantidad}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
