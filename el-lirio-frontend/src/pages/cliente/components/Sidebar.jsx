import React from "react";

const Sidebar = ({ categories, selectedCategories, onCategoryChange, minPrice, maxPrice, onPriceChange, onApplyFilters, onClearFilters }) => (
    <div className="sidebar">
        <h5>Categorías</h5>
        {categories.map(cat => (
            <div className="category-item" key={cat.name}>
                <input type="checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => onCategoryChange(cat.name)} />
                <label className="mb-0">{cat.name} <small>({cat.count})</small></label>
            </div>
        ))}
        <h5 className="mt-4">Rango de Precio</h5>
        <div className="price-range">
            <span>S/</span>
            <input type="number" className="price-input" value={minPrice} min={0} onChange={e => onPriceChange('min', e.target.value)} />
            <span>-</span>
            <input type="number" className="price-input" value={maxPrice} min={0} onChange={e => onPriceChange('max', e.target.value)} />
        </div>
        <button className="btn btn-danger w-100 mt-3" onClick={onApplyFilters}>
            <i className="bi bi-funnel"></i> Aplicar Filtros
        </button>
        <button className="btn btn-outline-secondary w-100 mt-2" onClick={onClearFilters}>
            <i className="bi bi-arrow-clockwise"></i> Limpiar
        </button>
    </div>
);

export default Sidebar;
