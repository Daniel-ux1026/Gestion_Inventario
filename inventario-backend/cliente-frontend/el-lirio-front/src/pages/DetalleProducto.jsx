import { useParams } from "react-router-dom";
import { useState } from "react";
import { productosBase } from "../data/productosBase";
import { agregarAlCarrito } from "../utils/carrito";
import { alertaAgregadoAlCarrito } from "../utils/alertas";

const DetalleProducto = () => {
  const { id } = useParams();
  const producto = productosBase.find((p) => p.id == id); // id viene como string
  const [cantidad, setCantidad] = useState(1);

  if (!producto) return <h4 className="text-center mt-5">Producto no encontrado.</h4>;

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
    alertaAgregadoAlCarrito(producto.nombre);
  };

  return (
    <div className="container py-4">
      <div className="row align-items-start">
        <div className="col-md-5 text-center mb-3">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-7">
          <h3>{producto.nombre}</h3>
          <p className="text-success fs-4">S/ {producto.precio.toFixed(2)}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>

          <div className="mb-3">
            <label htmlFor="cantidad" className="form-label">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min={1}
              max={producto.stock}
            />
          </div>

          <button className="btn btn-dark w-100" onClick={handleAgregar}>
            <i className="bi bi-cart-plus"></i> Añadir al carrito
          </button>

          <div className="mt-4">
            <h6>Descripción</h6>
            <p>{producto.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <div className="mt-5">
        <h5>Productos relacionados</h5>
        <div className="row g-3">
          {productosBase
            .filter((p) => p.id !== producto.id)
            .slice(0, 3)
            .map((rel) => (
              <div className="col-sm-6 col-md-4" key={rel.id}>
                <div className="card h-100">
                  <img
                    src={rel.imagen}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "contain" }}
                    alt={rel.nombre}
                  />
                  <div className="card-body">
                    <h6>{rel.nombre}</h6>
                    <p className="text-success fw-bold">S/ {rel.precio}</p>
                    <button className="btn btn-outline-primary w-100" onClick={() => window.location.href = `/producto/${rel.id}`}>
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
