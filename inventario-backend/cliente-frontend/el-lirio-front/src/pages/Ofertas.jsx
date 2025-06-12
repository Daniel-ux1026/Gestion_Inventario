import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { productosOferta } from "../data/productosOfertas.js";
import "../styles/BannerAnimado.css"; // Asegúrate de crear este CSS

const Ofertas = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [precioMin, setPrecioMin] = useState(1);
  const [precioMax, setPrecioMax] = useState(300);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreProductoAgregado, setNombreProductoAgregado] = useState("");

  const cambiarCantidad = (id, nuevaCantidad) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(2, nuevaCantidad)),
    }));
  };

  const mostrarConfirmacion = (nombre) => {
    setNombreProductoAgregado(nombre);
    setMostrarModal(true);
    setTimeout(() => setMostrarModal(false), 2000);
  };

  const categoriasUnicas = ["Todos", ...new Set(productosOferta.map((p) => p.categoria))];

  const productosFiltrados = productosOferta
    .filter((prod) => {
      const coincideNombre = prod.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
      const coincideCategoria = categoria === "Todos" || prod.categoria === categoria;
      const dentroDelRango = prod.precioOferta >= precioMin && prod.precioOferta <= precioMax;
      const coincideMes =
        !fechaSeleccionada ||
        new Date(prod.fechaOferta).getMonth() === new Date(fechaSeleccionada).getMonth();
      return coincideNombre && coincideCategoria && dentroDelRango && coincideMes;
    })
    .sort((a, b) => new Date(b.fechaOferta) - new Date(a.fechaOferta));

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4 text-center">🔥 Productos en Oferta 🔥</h3>

      {/* MODAL */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered backdrop="static">
        <Modal.Body className="text-center">
          <h5 className="text-success">✅ Se agregó exitosamente</h5>
          <p className="mb-0">{nombreProductoAgregado}</p>
        </Modal.Body>
      </Modal>

      {/* BANNER ANIMADO */}
      <div className="banner mb-5">
        <div className="decoracion"></div>
        <div className="decoracion"></div>
        <div className="decoracion"></div>

        <div className="content">
          <div className="oferta-badge">🔥 Oferta Especial</div>
          <h1 className="titulo">¡MEGA OFERTAS!</h1>
          <p className="subtitulo">Los mejores productos a precios increíbles</p>
          <div className="descuento">HASTA 10% OFF</div>
          <p className="tiempo-limitado">⏰ ¡Por tiempo limitado!</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input type="text" className="form-control" placeholder="Buscar producto..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} />
        </div>
        <div className="col-md-2 mb-2">
          <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            {categoriasUnicas.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 mb-2">
          <input type="number" className="form-control" placeholder="Precio mínimo" min="1" max="300" value={precioMin} onChange={(e) => setPrecioMin(Number(e.target.value))} />
        </div>
        <div className="col-md-2 mb-2">
          <input type="number" className="form-control" placeholder="Precio máximo" min="1" max="300" value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} />
        </div>
        <div className="col-md-3 mb-2">
          <input type="date" className="form-control" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} />
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="row g-3">
        {productosFiltrados.length === 0 ? (
          <p className="text-center text-muted">No se encontraron productos.</p>
        ) : (
          productosFiltrados.map((prod) => {
            const cantidad = cantidades[prod.id] || 1;
            return (
              <div className="col-sm-6 col-md-4 col-lg-3" key={prod.id}>
                <div className="card h-100 shadow-sm d-flex flex-column">
                  <Link to={`/detalle-oferta/${prod.id}`}>
                    <img src={prod.imagen} className="card-img-top" alt={prod.nombre} style={{ height: "200px", objectFit: "contain" }} />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{prod.nombre}</h6>
                    <p className="text-muted text-decoration-line-through">S/ {prod.precioOriginal.toFixed(2)}</p>
                    <p className="text-success fw-bold mb-2">S/ {prod.precioOferta.toFixed(2)}</p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="me-2">Cantidad:</small>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => cambiarCantidad(prod.id, cantidad - 1)}>-</button>
                        <span className="px-2">{cantidad}</span>
                        <button className="btn btn-outline-secondary btn-sm ms-1" onClick={() => cambiarCantidad(prod.id, cantidad + 1)}>+</button>
                      </div>
                    </div>
                    <button className="btn btn-primary mt-auto" onClick={() => {
                      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                      const existente = carrito.find(p => p.id === prod.id);

                      if (existente) {
                        if (existente.cantidad + cantidad > 2) {
                          alert("Máximo 2 unidades por producto.");
                          return;
                        }
                        existente.cantidad += cantidad;
                      } else {
                        carrito.push({ ...prod, cantidad });
                      }

                      localStorage.setItem("carrito", JSON.stringify(carrito));
                      mostrarConfirmacion(prod.nombre);
                    }}>
                      <i className="bi bi-cart-plus"></i> Añadir
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Ofertas;
