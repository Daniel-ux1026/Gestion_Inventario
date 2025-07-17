import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetalleProducto = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/productos/${id}`)
            .then(res => setProducto(res.data.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!producto) return <p>Cargando detalle...</p>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={`http://localhost:8080${producto.urlImagen}`} alt={producto.nombreProducto} style={{ width: "100%" }} />
                </div>
                <div className="col-md-6">
                    <h2>{producto.nombreProducto}</h2>
                    <p className="text-success fw-bold">S/ {producto.precioVenta}</p>
                    <p>{producto.descripcion}</p>
                    {/* Aquí cantidad, botón añadir carrito, etc */}
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
