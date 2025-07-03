import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { obtenerCarrito, guardarCarrito } from "../utils/carrito";

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("yape");
  const [comprobante, setComprobante] = useState(null);
  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [pedidosTotales, setPedidosTotales] = useState(0);
  const [historialPedidos, setHistorialPedidos] = useState([]);
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [filtroTiempo, setFiltroTiempo] = useState("todo");

  useEffect(() => {
    const data = (obtenerCarrito() || []).filter(Boolean);
    setCarrito(data);

    const historial = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
    const hoy = new Date().toISOString().slice(0, 10);
    const pedidosHoy = historial.filter((p) => p.fecha === hoy).length;

    setPedidosHoy(pedidosHoy);
    setPedidosTotales(historial.length);
    setHistorialPedidos(historial);
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad > 3) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Solo puedes agregar hasta 3 unidades.",
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
    const precio = item.precioOferta ?? item.precio ?? 0;
    return sum + precio * (item.cantidad || 1);
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
      total,
      metodoPago,
    });

    localStorage.setItem("pedidosHistorial", JSON.stringify(historial));
    Swal.fire({ icon: "success", title: "Pedido realizado", text: "Gracias por tu compra." });

    localStorage.removeItem("carrito");
    setCarrito([]);
    setPedidosHoy(pedidosHoy + 1);
    setPedidosTotales(pedidosTotales + 1);
    setHistorialPedidos(historial);
  };

  const filtrarPedidosPorTiempo = () => {
    const hoy = new Date();
    return historialPedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha);
      const diff = (hoy - fechaPedido) / (1000 * 60 * 60 * 24);
      switch (filtroTiempo) {
        case "hoy": return diff < 1;
        case "semana": return diff <= 7;
        case "mes": return diff <= 30;
        case "6meses": return diff <= 180;
        default: return true;
      }
    });
  };

  const generarNotaVentaPDF = (pedido, index) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("NOTA DE VENTA", 14, 20);

    doc.setFontSize(10);
    doc.text(`Fecha: ${pedido.fecha}`, 14, 30);
    doc.text(`Pedido N°: ${index + 1}`, 14, 36);
    doc.text(`Método de Pago: ${pedido.metodoPago}`, 14, 42);
    doc.text(`Total: S/ ${pedido.total.toFixed(2)}`, 14, 48);

    autoTable(doc, {
      startY: 55,
      head: [["Producto", "Precio", "Cantidad", "Subtotal"]],
      body: pedido.productos.map((item) => [
        item.nombre,
        `S/ ${(item.precioOferta ?? item.precio).toFixed(2)}`,
        item.cantidad,
        `S/ ${((item.precioOferta ?? item.precio) * item.cantidad).toFixed(2)}`,
      ]),
    });

    doc.save(`nota_venta_${index + 1}.pdf`);
  };

  return (
    <div className="container py-4">
      <h3>🧾 Checkout</h3>

      {/* Resumen */}
      <div className="alert alert-info">
        Pedidos hoy: <strong>{pedidosHoy}</strong> | Pedidos totales: <strong>{pedidosTotales}</strong>
      </div>

      {/* Carrito */}
      {carrito.length > 0 && (
        <>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>S/ {(item.precioOferta ?? item.precio).toFixed(2)}</td>
                  <td>
                    <input type="number" min={1} max={3} value={item.cantidad} className="form-control"
                      onChange={(e) => actualizarCantidad(item.id, Number(e.target.value))} />
                  </td>
                  <td>S/ {((item.precioOferta ?? item.precio) * item.cantidad).toFixed(2)}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(item.id)}>🗑</button></td>
                </tr>
              ))}
              <tr><td colSpan="3" className="text-end fw-bold">Total</td><td colSpan="2" className="fw-bold text-success">S/ {total.toFixed(2)}</td></tr>
            </tbody>
          </table>

          {/* Pago */}
          <div className="mb-3">
            <h5>Método de pago</h5>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="yape" checked={metodoPago === "yape"} onChange={() => setMetodoPago("yape")} />
              <label htmlFor="yape" className="form-check-label">Yape</label>
            </div>
            <div className="form-check mb-2">
              <input type="radio" className="form-check-input" id="transferencia" checked={metodoPago === "transferencia"} onChange={() => setMetodoPago("transferencia")} />
              <label htmlFor="transferencia" className="form-check-label">Transferencia</label>
            </div>

            {metodoPago === "yape" && <img src="/yape-qr.png" alt="QR Yape" style={{ width: "180px" }} />}
            {metodoPago === "transferencia" && <p>CCI: <strong>002-123456789012345678</strong></p>}

            <label className="form-label mt-3">Comprobante:</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setComprobante(e.target.files[0])} />
          </div>

          <button className="btn btn-dark w-100" onClick={realizarPedido}>✅ Realizar pedido</button>
        </>
      )}

      {/* Historial */}
      <div className="mt-5">
        <h4>📦 Historial de Pedidos</h4>
        <select className="form-select w-auto mb-3" value={filtroTiempo} onChange={(e) => setFiltroTiempo(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
          <option value="6meses">6 meses</option>
        </select>

        {filtrarPedidosPorTiempo().map((pedido, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <strong>Pedido #{index + 1} - {pedido.fecha} - Total: S/ {pedido.total.toFixed(2)}</strong>
                <div>
                  <button className="btn btn-outline-dark btn-sm me-2" onClick={() => generarNotaVentaPDF(pedido, index)}>🧾 Nota de venta</button>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setPedidoExpandido(pedidoExpandido === index ? null : index)}>
                    {pedidoExpandido === index ? "Ocultar" : "Ver más"}
                  </button>
                </div>
              </div>
              {pedidoExpandido === index && (
                <table className="table table-bordered mt-3">
                  <thead>
                    <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {pedido.productos.map((item, i) => (
                      <tr key={i}>
                        <td>{item.nombre}</td>
                        <td>S/ {(item.precioOferta ?? item.precio).toFixed(2)}</td>
                        <td>{item.cantidad}</td>
                        <td>S/ {((item.precioOferta ?? item.precio) * item.cantidad).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
