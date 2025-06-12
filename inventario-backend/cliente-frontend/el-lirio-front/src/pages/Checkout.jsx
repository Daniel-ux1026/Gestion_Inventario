import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerCarrito, guardarCarrito } from "../utils/carrito";

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("yape");
  const [comprobante, setComprobante] = useState(null);
  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [pedidosTotales, setPedidosTotales] = useState(0);

  useEffect(() => {
    const data = (obtenerCarrito() || []).filter(Boolean); // evita nulls
    setCarrito(data);

    const historial = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
    const hoy = new Date().toISOString().slice(0, 10);
    const pedidosHoy = historial.filter(p => p.fecha === hoy).length;

    setPedidosHoy(pedidosHoy);
    setPedidosTotales(historial.length);
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad > 3) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Solo puedes agregar hasta 3 unidades de este producto.",
      });
      return;
    }

    const actualizado = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(actualizado);
    guardarCarrito(actualizado);
  };

  const eliminarProducto = (id) => {
    const actualizado = carrito.filter((item) => item.id !== id);
    setCarrito(actualizado);
    guardarCarrito(actualizado);
  };

  const total = carrito.reduce((sum, item) => {
    if (!item) return sum;
    const precioUnitario = item.precioOferta ?? item.precio ?? 0;
    return sum + precioUnitario * (item.cantidad || 1);
  }, 0);

  const realizarPedido = () => {
    if (!comprobante) {
      Swal.fire({
        icon: "warning",
        title: "Comprobante requerido",
        text: "Por favor sube el comprobante de pago.",
      });
      return;
    }

    const historial = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
    historial.push({
      fecha: new Date().toISOString().slice(0, 10),
      productos: carrito,
      total
    });
    localStorage.setItem("pedidosHistorial", JSON.stringify(historial));

    Swal.fire({
      icon: "success",
      title: "Pedido realizado",
      text: "Gracias por tu compra.",
      confirmButtonColor: "#198754",
      confirmButtonText: "Aceptar",
    });

    localStorage.removeItem("carrito");
    setCarrito([]);
    setPedidosHoy(pedidosHoy + 1);
    setPedidosTotales(pedidosTotales + 1);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">🧾 Checkout</h3>

      <div className="mb-4">
        <div className="alert alert-secondary">
          <strong>📊 Resumen:</strong><br />
          Pedidos realizados hoy: <strong>{pedidosHoy}</strong><br />
          Pedidos totales: <strong>{pedidosTotales}</strong>
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.nombre}</td>
                    <td>S/ {(item?.precioOferta ?? item?.precio ?? 0).toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min={1}
                        max={3}
                        value={item?.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(item.id, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>
                      S/ {((item?.precioOferta ?? item?.precio ?? 0) * (item?.cantidad || 1)).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarProducto(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Total:
                  </td>
                  <td colSpan={2} className="fw-bold text-success">
                    S/ {total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h5 className="mb-3">Método de pago</h5>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="pago"
                id="yape"
                value="yape"
                checked={metodoPago === "yape"}
                onChange={() => setMetodoPago("yape")}
              />
              <label className="form-check-label" htmlFor="yape">
                Yape
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="pago"
                id="transferencia"
                value="transferencia"
                checked={metodoPago === "transferencia"}
                onChange={() => setMetodoPago("transferencia")}
              />
              <label className="form-check-label" htmlFor="transferencia">
                Transferencia Bancaria
              </label>
            </div>

            {metodoPago === "yape" && (
              <div className="mb-3">
                <p>Escanea este código QR:</p>
                <img
                  src="/yape-qr.png"
                  alt="QR Yape"
                  style={{ maxWidth: "200px", borderRadius: "8px" }}
                />
              </div>
            )}

            {metodoPago === "transferencia" && (
              <div className="mb-3">
                <p>Cuenta Interbancaria (CCI):</p>
                <strong>002-123456789012345678</strong>
              </div>
            )}

            <div className="mb-4">
              <label className="form-label">Sube el comprobante de pago:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setComprobante(e.target.files[0])}
              />
            </div>

            <button className="btn btn-dark btn-lg w-100" onClick={realizarPedido}>
              Realizar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
