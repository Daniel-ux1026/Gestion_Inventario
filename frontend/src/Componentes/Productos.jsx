import { useEffect, useState } from "react";

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/backend_war/api/productos")
            .then((res) => res.json())
            .then(setProductos)
            .catch(() => setError("Error al cargar productos"));
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5">
            <h3>Productos</h3>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                {productos.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nombre}</td>
                        <td>{p.cantidad}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
