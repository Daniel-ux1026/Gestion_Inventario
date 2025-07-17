import { useEffect, useState } from "react";
import axios from "axios";

const AdminOfertas = () => {
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/ofertas")
            .then(res => setOfertas(res.data))
            .catch(() => setOfertas([]));
    }, []);

    const eliminarOferta = id => {
        if (window.confirm("¿Eliminar esta oferta?")) {
            axios.delete(`http://localhost:8080/api/ofertas/${id}`)
                .then(() => setOfertas(ofertas.filter(o => o.id !== id)));
        }
    };

    return (
        <div>
            <h2>Gestión de Ofertas</h2>
            <button onClick={() => {/* abre modal de crear */}}>Crear nueva oferta</button>
            <table>
                <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio Oferta</th>
                    <th>Vigencia</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {ofertas.map(o => (
                    <tr key={o.id}>
                        <td>{o.nombre}</td>
                        <td>S/ {o.precioOferta}</td>
                        <td>{o.fechaVigencia}</td>
                        <td>
                            <button onClick={() => {/* editar */}}>Editar</button>
                            <button onClick={() => eliminarOferta(o.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Modal para crear/editar oferta */}
        </div>
    );
};

export default AdminOfertas;
