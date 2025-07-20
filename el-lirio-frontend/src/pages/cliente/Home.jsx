import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar.jsx";
import ProductsGrid from "./components/ProductsGrid";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario?.rol?.nombreRol === "ADMIN") {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/productos/listar")
            .then(res => {
                const data = res.data.data || [];
                setProductos(data);
                setFiltered(data);
                const cats = [...new Set(data.map(p => p.categoria?.nombreCategoria || "Sin categoría"))];
                setCategories(cats.map(name => ({
                    name,
                    count: data.filter(p => (p.categoria?.nombreCategoria || "Sin categoría") === name).length
                })));
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products: ", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = productos;
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.categoria?.nombreCategoria));
        }
        filtered = filtered.filter(p => p.precioVenta >= minPrice && p.precioVenta <= maxPrice);
        setFiltered(filtered);
    }, [productos, selectedCategories, minPrice, maxPrice]);

    const onCategoryChange = (cat) => {
        setSelectedCategories(sel =>
            sel.includes(cat) ? sel.filter(c => c !== cat) : [...sel, cat]
        );
    };

    const onPriceChange = (type, value) => {
        if (type === 'min') setMinPrice(Number(value));
        else setMaxPrice(Number(value));
    };

    const onClearFilters = () => {
        setSelectedCategories([]);
        setMinPrice(0);
        setMaxPrice(1000);
    };

    const onAddToCart = (product) => {
        alert(`Producto ${product.nombreProducto} agregado`);
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Cargando productos...</p></div>;

    return (
        <div className="container my-4">
            <div className="row">
                <aside className="col-12 col-md-4 col-lg-3 mb-4">
                    <Sidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={onCategoryChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                        onClearFilters={onClearFilters}
                    />
                </aside>
                <section className="col-12 col-md-8 col-lg-9">
                    <div className="products-container">
                        <h4 className="mb-0">Nuestros Productos</h4>
                        {filtered.length === 0 ? (
                            <p>No hay productos que mostrar.</p>
                        ) : (
                            <ProductsGrid products={filtered} onAddToCart={onAddToCart} />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
