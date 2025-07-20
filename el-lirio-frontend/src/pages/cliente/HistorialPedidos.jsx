import React, { useEffect, useState } from "react";

const HistorialPedidos = () => {
    const [historialPedidos, setHistorialPedidos] = useState([]);

    useEffect(() => {
        const historial = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
        setHistorialPedidos(historial);
    }, []);

    if (historialPedidos.length === 0) {
        return (
            <div className="text-center my-5">
                <i className="bi bi-bag-x" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
                <h4 className="mt-3">¡Aún no tienes pedidos!</h4>
                <p>Cuando realices una compra, aquí verás tu historial.</p>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <h3 className="mb-4">Mi Historial de Pedidos</h3>
            <table className="table table-hover table-bordered">
                <thead>
                <tr>
                    <th># Pedido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Método</th>
                    <th>Productos</th>
                </tr>
                </thead>
                <tbody>
                {historialPedidos.map((pedido, idx) => (
                    <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{pedido.fecha}</td>
                        <td>S/ {pedido.total?.toFixed(2)}</td>
                        <td>{pedido.metodoPago}</td>
                        <td>
                            <ul className="mb-0">
                                {pedido.productos.map((prod, j) => (
                                    <li key={j}>{prod.nombre} x{prod.cantidad}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialPedidos;
