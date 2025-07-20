import React from "react";
import { agregarAlCarrito } from "../utils/carrito"; // ajusta la ruta si es necesario

const ProductsGrid = ({ products }) => {
    const handleAddToCart = (product) => {
        agregarAlCarrito({
            id: product.idProducto,
            nombre: product.nombreProducto,
            precio: product.precioVenta,
            imagen: product.urlImagen,
            stock: product.stockActual,
        });
    };

    return (
        <div className="product-grid">
            {products.map(product => (
                <div className="product-card" key={product.idProducto}>
                    <div className="product-image">
                        <img
                            src={`http://localhost:8080${product.urlImagen}`}
                            alt={product.nombreProducto}
                            style={{ width: "100%", height: "200px", objectFit: "contain" }}
                        />
                    </div>
                    <div className="product-info">
                        <h6 className="product-name">{product.nombreProducto}</h6>
                        <p className="product-description">{product.descripcion}</p>
                        <div className="product-price text-success fw-bold">
                            S/ {product.precioVenta}
                        </div>
                        <button
                            className="add-btn btn btn-dark w-100 mt-2"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stockActual === 0}
                        >
                            {product.stockActual === 0 ? "Sin stock" : "Añadir"}
                        </button>
                        <small className="text-muted d-block mt-2">
                            Stock: {product.stockActual ?? "0"} unidades
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsGrid;
