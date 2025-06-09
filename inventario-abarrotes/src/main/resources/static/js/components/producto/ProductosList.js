// js/components/productos/ProductosList.js
// Lista de productos con tabla y filtros avanzados

const ProductosList = () => {
    const [productos, setProductos] = React.useState([]);
    const [filteredProductos, setFilteredProductos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');
    const [stockFilter, setStockFilter] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');

    // Estados para ordenamiento y paginación
    const [sortField, setSortField] = React.useState('nombre');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    React.useEffect(() => {
        loadProductos();
    }, []);

    React.useEffect(() => {
        applyFilters();
    }, [productos, searchTerm, categoryFilter, stockFilter, statusFilter, sortField, sortDirection]);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const result = await productoService.getAll();

            if (result.success) {
                setProductos(result.data);
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al cargar productos', 'error');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...productos];

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = helpers.filtrarPor(filtered, searchTerm, ['nombre', 'codigo', 'presentacion']);
        }

        // Filtro por categoría
        if (categoryFilter) {
            filtered = filtered.filter(p => p.categoria?.nombre === categoryFilter);
        }

        // Filtro por stock
        if (stockFilter) {
            switch (stockFilter) {
                case 'disponible':
                    filtered = filtered.filter(p => p.stock > 5);
                    break;
                case 'bajo':
                    filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
                    break;
                case 'agotado':
                    filtered = filtered.filter(p => p.stock === 0);
                    break;
            }
        }

        // Filtro por estado
        if (statusFilter) {
            const isActive = statusFilter === 'activo';
            filtered = filtered.filter(p => p.estado === isActive);
        }

        // Ordenamiento
        filtered = helpers.ordenarPor(filtered, sortField, sortDirection === 'asc');

        setFilteredProductos(filtered);
        setCurrentPage(1); // Reset página al filtrar
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleEdit = (producto) => {
        setEditingProduct(producto);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(CONSTANTS.MENSAJES.CONFIRMAR_ELIMINACION)) {
            try {
                const result = await productoService.delete(id);
                if (result.success) {
                    showNotification('Producto eliminado correctamente', 'success');
                    loadProductos();
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Error al eliminar producto', 'error');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const result = await productoService.cambiarEstado(id);
            if (result.success) {
                showNotification('Estado actualizado correctamente', 'success');
                loadProductos();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al cambiar estado', 'error');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setStockFilter('');
        setStatusFilter('');
        setSortField('nombre');
        setSortDirection('asc');
    };

    // Paginación
    const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProductos = filteredProductos.slice(startIndex, endIndex);

    // Obtener categorías únicas para el filtro
    const categorias = [...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))];

    if (loading) {
        return (
            <div className="p-6">
                <SimpleHeader title="Productos" subtitle="Gestión del inventario de productos" />
                <div className="bg-white rounded-xl card-shadow">
                    <TableSpinner rows={10} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <SimpleHeader
                    title="Productos"
                    subtitle={`${filteredProductos.length} productos encontrados`}
                />
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nuevo Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    {/* Búsqueda */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, código o presentación..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filtro por categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock
                        </label>
                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todo el stock</option>
                            <option value="disponible">Stock disponible (&gt;5)</option>
                            <option value="bajo">Stock bajo (1-5)</option>
                            <option value="agotado">Sin stock (0)</option>
                        </select>
                    </div>

                    {/* Filtro por estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>

                {/* Acciones de filtros */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Mostrando {currentProductos.length} de {filteredProductos.length} productos
                    </div>
                    <button
                        onClick={clearFilters}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        <i className="fas fa-filter mr-1"></i>
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-xl card-shadow overflow-hidden">
                {/* Header de tabla con configuración */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Lista de Productos</h3>
                    <div className="flex items-center space-x-4">
                        {/* Items por página */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Mostrar:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        {/* Botón de exportar */}
                        <button
                            onClick={() => helpers.descargarCSV(filteredProductos, 'productos.csv')}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                            <i className="fas fa-download mr-1"></i>
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader
                                field="codigo"
                                currentField={sortField}
                                direction={sortDirection}
                                onSort={handleSort}
                            >
                                Código
                            </SortableHeader>
                            <SortableHeader
                                field="nombre"
                                currentField={sortField}
                                direction={sortDirection}
                                onSort={handleSort}
                            >
                                Producto
                            </SortableHeader>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Presentación
                            </th>
                            <SortableHeader
                                field="stock"
                                currentField={sortField}
                                direction={sortDirection}
                                onSort={handleSort}
                            >
                                Stock
                            </SortableHeader>
                            <SortableHeader
                                field="precioVenta"
                                currentField={sortField}
                                direction={sortDirection}
                                onSort={handleSort}
                            >
                                Precio
                            </SortableHeader>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {currentProductos.map((producto) => (
                            <ProductoRow
                                key={producto.idProducto}
                                producto={producto}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredProductos.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-box text-gray-400 text-4xl mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron productos
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || categoryFilter || stockFilter || statusFilter
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'Comienza agregando tu primer producto'
                            }
                        </p>
                        {!searchTerm && !categoryFilter && !stockFilter && !statusFilter && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Agregar Producto
                            </button>
                        )}
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modal de producto */}
            {showModal && (
                <ProductoForm
                    producto={editingProduct}
                    onClose={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                    }}
                    onSave={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                        loadProductos();
                    }}
                />
            )}
        </div>
    );
};

// Componente de header ordenable
const SortableHeader = ({ field, currentField, direction, onSort, children }) => {
    const isActive = currentField === field;

    return (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                <div className="flex flex-col">
                    <i className={`fas fa-caret-up text-xs ${
                        isActive && direction === 'asc' ? 'text-blue-600' : 'text-gray-400'
                    }`}></i>
                    <i className={`fas fa-caret-down text-xs -mt-1 ${
                        isActive && direction === 'desc' ? 'text-blue-600' : 'text-gray-400'
                    }`}></i>
                </div>
            </div>
        </th>
    );
};

// Componente de fila de producto
const ProductoRow = ({ producto, onEdit, onDelete, onToggleStatus }) => {
    const getStockColor = (stock) => {
        if (stock === 0) return 'bg-red-100 text-red-800';
        if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStockIcon = (stock) => {
        if (stock === 0) return 'fas fa-times-circle';
        if (stock <= 5) return 'fas fa-exclamation-triangle';
        return 'fas fa-check-circle';
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {producto.codigo}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div>
                    <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                    {producto.marca && (
                        <div className="text-sm text-gray-500">{producto.marca.nombre}</div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {producto.categoria?.nombre || 'Sin categoría'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {producto.presentacion}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(producto.stock)}`}>
                    <i className={`${getStockIcon(producto.stock)} mr-1`}></i>
                    {producto.stock}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {helpers.formatearMoneda(producto.precioVenta)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => onToggleStatus(producto.idProducto)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        producto.estado
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                >
                    <i className={`fas ${producto.estado ? 'fa-check' : 'fa-times'} mr-1`}></i>
                    {producto.estado ? 'Activo' : 'Inactivo'}
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(producto)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        onClick={() => onDelete(producto.idProducto)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                    <button
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Ver detalles"
                    >
                        <i className="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Componente de paginación
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
             i <= Math.min(totalPages - 1, currentPage + delta);
             i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                            page === currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : page === '...'
                                    ? 'border-transparent cursor-default'
                                    : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

// Exportar componente
window.ProductosList = ProductosList;