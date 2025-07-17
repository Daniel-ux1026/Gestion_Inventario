import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/productos/listar")
            .then((res) => {
                // Tu API retorna { success, message, data: [...] }
                setProductos(res.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar productos", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Productos</h2>
            <div className="row">
                {productos.map(prod => {
                    // Aquí va el log, para ver cada URL de imagen
                    console.log("Imagen URL:", prod.imagenUrl);

                    return (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={prod.idProducto}>
                            <div className="card mb-4">
                                <img
                                    src={`http://localhost:8080${prod.urlImagen}`}
                                    alt={prod.nombreProducto}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "contain" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{prod.nombreProducto}</h5>
                                    <p className="card-text">{prod.descripcion}</p>
                                    <p className="text-success fw-bold mb-2">S/ {prod.precioVenta}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default Home;
