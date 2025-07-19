const ProductsGrid = ({ products, onAddToCart }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-search" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                <h5 className="mt-3">No se encontraron productos</h5>
                <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
            </div>
        );
    }
    return (
        <div className="product-grid">
            {products.map(product => (
                <div className="product-card" key={product.idProducto}>
                    <div className="product-image">
                        <img src={`http://localhost:8080${product.urlImagen}`} alt={product.nombreProducto} onError={e => e.target.src="https://via.placeholder.com/150"} />
                    </div>
                    <div className="product-info">
                        <h6 className="product-name">{product.nombreProducto}</h6>
                        <p className="product-description">{product.descripcion}</p>
                        <div className="product-price">S/ {product.precioVenta}</div>
                        <button className="add-btn" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
                            {product.stock === 0 ? 'Sin stock' : 'Añadir'}
                        </button>
                        <small className="text-muted d-block mt-2">Stock: {product.stock} unidades</small>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ProductsGrid;
