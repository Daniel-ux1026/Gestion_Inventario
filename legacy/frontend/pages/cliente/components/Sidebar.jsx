import React from "react";

const Sidebar = ({
                     categories,
                     selectedCategories,
                     onCategoryChange,
                     minPrice,
                     maxPrice,
                     setMinPrice,
                     setMaxPrice,
                     onApplyFilters,
                     onClearFilters,
                 }) => (
    <div className="sidebar">
        <h5 className="mb-3">Categorías</h5>
        <div>
            {categories.map((cat) => (
                <div className="category-item" key={cat.name}>
                    <input
                        type="checkbox"
                        id={`cat_${cat.name}`}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => onCategoryChange(cat.name)}
                    />
                    <label htmlFor={`cat_${cat.name}`} className="mb-0 ms-2">
                        {cat.name} <small className="text-muted">({cat.count})</small>
                    </label>
                </div>
            ))}
        </div>
        <h5 className="mt-4 mb-3">Rango de Precio</h5>
        <div className="price-range d-flex align-items-center gap-2 mb-2">
            <span>S/</span>
            <input
                type="number"
                className="price-input"
                min={0}
                autoComplete="off"
                placeholder="Mín"
                value={minPrice}
                onChange={e => {
                    // Quita ceros a la izquierda, permite vacío
                    let val = e.target.value.replace(/^0+(?!$)/, "");
                    setMinPrice(val);
                }}
                style={{ width: "70px" }}
            />
            <span>-</span>
            <input
                type="number"
                className="price-input"
                min={0}
                autoComplete="off"
                placeholder="Máx"
                value={maxPrice}
                onChange={e => {
                    let val = e.target.value.replace(/^0+(?!$)/, "");
                    setMaxPrice(val);
                }}
                style={{ width: "70px" }}
            />
        </div>
        <button
            className="btn btn-danger w-100 mt-3"
            onClick={onApplyFilters}
            type="button"
        >
            <i className="bi bi-funnel"></i> Aplicar Filtros
        </button>
        <button
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={onClearFilters}
            type="button"
        >
            <i className="bi bi-arrow-clockwise"></i> Limpiar
        </button>
    </div>
);

export default Sidebar;
