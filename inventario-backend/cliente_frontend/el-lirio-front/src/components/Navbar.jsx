import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerCarrito } from "../utils/carrito";

const Navbar = () => {
  const [cantidad, setCantidad] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Actualiza carrito
    const carritoObj = obtenerCarrito();
    const carritoArray = Object.values(carritoObj || {});
    const total = carritoArray.reduce((sum, p) => sum + (p?.cantidad || 0), 0);
    setCantidad(total);

    // Actualiza usuario logueado
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      setUsuario(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-3">
        <div className="container-fluid">
          {/* Botón hamburguesa */}
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

          {/* Logo / Home */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-house-door-fill fs-5 me-2"></i> El Lirio
          </Link>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/ofertas" className="nav-link text-white">
                  <i className="bi bi-tags-fill"></i> Ofertas
                </Link>
              </li>

              {/* Si está logueado muestra usuario y cerrar sesión, sino iniciar/crear cuenta */}
              <li className="nav-item">
                {usuario ? (
                    <div className="d-flex align-items-center">
                  <span className="nav-link text-white">
                    <i className="bi bi-person-circle"></i> {usuario.nombre}
                  </span>
                      <button
                          className="btn btn-outline-light btn-sm ms-2"
                          onClick={handleLogout}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                ) : (
                    <Link to="/login" className="nav-link">
                      <i className="bi bi-person-circle "></i> Iniciar / Crear cuenta
                    </Link>
                )}
              </li>

              <li className="nav-item">
                <Link to="/checkout" className="btn btn-light position-relative">
                  <i className="bi bi-cart3 me-1"></i> Carrito
                  {cantidad > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                    {cantidad}
                  </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
