import { useState } from "react";
import { Link } from "react-router-dom";
import { agregarAlCarrito } from "../utils/carrito";
import { alertaAgregadoAlCarrito } from "../utils/alertas";
import { productosBase } from "../data/productosBase"; // ✅ Importación correcta

const categorias = ["Todos", ...new Set(productosBase.map(p => p.categoria))];

const Home = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [precioMin, setPrecioMin] = useState(1);
  const [precioMax, setPrecioMax] = useState(100);

  const productosFiltrados = productosBase.filter((prod) => {
    const coincideNombre = prod.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideCategoria = categoria === "Todos" || prod.categoria === categoria;
    const dentroDelRango = prod.precio >= precioMin && prod.precio <= precioMax;
    return coincideNombre && coincideCategoria && dentroDelRango;
  });

  return (
    <div className="container-fluid p-4 pb-5" style={{ paddingBottom: "140px" }}>

      {/* CARRUSEL DE BANNERS */}
      <div id="carouselPrincipal" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {[0, 1, 2, 3, 4].map(i => (
            <button
              key={i}
              type="button"
              data-bs-target="#carouselPrincipal"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner rounded shadow-sm">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <div key={n} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img src={`/banner${n}.jpg`} className="d-block w-100" alt={`Banner ${n}`} style={{ maxHeight: "400px", objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselPrincipal" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselPrincipal" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <label className="form-label">Precio mínimo</label>
          <input
            type="number"
            className="form-control"
            min="1"
            step="0.1"
            value={precioMin}
            onChange={(e) => setPrecioMin(Number(e.target.value))}
          />
        </div>
        <div className="col-md-3 mb-2">
          <label className="form-label">Precio máximo</label>
          <input
            type="number"
            className="form-control"
            min="1"
            step="0.1"
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
          />
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="row g-3">
        {productosFiltrados.map((prod) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={prod.id}>
            <div className="card h-100 shadow-sm">
              <Link to={`/producto/${prod.id}`}>
                <img
                  src={prod.imagen}
                  className="card-img-top"
                  alt={prod.nombre}
                  style={{ height: "200px", objectFit: "contain" }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{prod.nombre}</h6>
                <p className="text-success fw-bold mb-2">S/ {prod.precio.toFixed(2)}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => {
                    agregarAlCarrito(prod);
                    alertaAgregadoAlCarrito(prod.nombre);
                  }}
                >
                  <i className="bi bi-cart-plus"></i> Añadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
