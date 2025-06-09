// js/components/productos/ProductoForm.js
// Formulario para crear/editar productos

const ProductoForm = ({ producto, onClose, onSave }) => {
    const [categorias, setCategorias] = React.useState([]);
    const [marcas, setMarcas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Usar hook de validación
    const {
        data: formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        reset
    } = useFormValidation(
        {
            codigo: '',
            nombre: '',
            presentacion: '',
            precioCompra: '',
            precioVenta: '',
            stock: '',
            categoria: { idCategoria: '' },
            marca: { idMarca: '' }
        },
        validationSchemas.producto
    );

    React.useEffect(() => {
        loadCategorias();
        loadMarcas();

        if (producto) {
            // Cargar datos del producto a editar
            Object.keys(formData).forEach(key => {
                if (key === 'categoria') {
                    handleChange(key, { idCategoria: producto.categoria?.idCategoria || '' });
                } else if (key === 'marca') {
                    handleChange(key, { idMarca: producto.marca?.idMarca || '' });
                } else {
                    handleChange(key, producto[key] || '');
                }
            });
        }
    }, [producto]);

    const loadCategorias = async () => {
        try {
            // Simulamos categorías - en producción cargar del backend
            setCategorias([
                { idCategoria: 1, nombre: 'Bebidas' },
                { idCategoria: 2, nombre: 'Lácteos' },
                { idCategoria: 3, nombre: 'Carnes' },
                { idCategoria: 4, nombre: 'Frutas y Verduras' },
                { idCategoria: 5, nombre: 'Abarrotes' },
                { idCategoria: 6, nombre: 'Limpieza' },
                { idCategoria: 7, nombre: 'Panadería' },
                { idCategoria: 8, nombre: 'Dulces y Golosinas' }
            ]);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const loadMarcas = async () => {
        try {
            // Simulamos marcas - en producción cargar del backend
            setMarcas([
                { idMarca: 1, nombre: 'Coca Cola' },
                { idMarca: 2, nombre: 'Nestlé' },
                { idMarca: 3, nombre: 'Gloria' },
                { idMarca: 4, nombre: 'San Fernando' },
                { idMarca: 5, nombre: 'Laive' },
                { idMarca: 6, nombre: 'Ajinomoto' },
                { idMarca: 7, nombre: 'Sapolio' },
                { idMarca: 8, nombre: 'Bimbo' }
            ]);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const dataToSend = {
                ...formData,
                precioCompra: parseFloat(formData.precioCompra),
                precioVenta: parseFloat(formData.precioVenta),
                stock: parseInt(formData.stock)
            };

            let result;
            if (producto) {
                result = await productoService.update(producto.idProducto, dataToSend);
            } else {
                result = await productoService.create(dataToSend);
            }

            if (result.success) {
                showNotification(
                    `Producto ${producto ? 'actualizado' : 'creado'} correctamente`,
                    'success'
                );
                onSave();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al guardar el producto', 'error');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            const parentObj = { ...formData[parent] };
            parentObj[child] = value;
            handleChange(parent, parentObj);
        } else {
            handleChange(name, value);
        }
    };

    const handleInputBlur = (e) => {
        const { name } = e.target;
        handleBlur(name);
    };

    // Calcular margen de ganancia
    const calcularMargen = () => {
        const compra = parseFloat(formData.precioCompra) || 0;
        const venta = parseFloat(formData.precioVenta) || 0;
        return venta - compra;
    };

    const calcularPorcentajeGanancia = () => {
        const compra = parseFloat(formData.precioCompra) || 0;
        const margen = calcularMargen();
        return compra > 0 ? (margen / compra) * 100 : 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            <i className="fas fa-box mr-2 text-blue-600"></i>
                            {producto ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Información Básica
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Código */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código del Producto *
                                </label>
                                <input
                                    type="text"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.codigo && errors.codigo
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: COC001"
                                />
                                {touched.codigo && errors.codigo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Producto *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.nombre && errors.nombre
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: Coca Cola Original"
                                />
                                {touched.nombre && errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>
                        </div>

                        {/* Presentación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Presentación *
                            </label>
                            <input
                                type="text"
                                name="presentacion"
                                value={formData.presentacion}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    touched.presentacion && errors.presentacion
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                }`}
                                placeholder="Ej: Botella 500ml"
                            />
                            {touched.presentacion && errors.presentacion && (
                                <p className="mt-1 text-sm text-red-600">{errors.presentacion}</p>
                            )}
                        </div>

                        {/* Categoría y Marca */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría *
                                </label>
                                <select
                                    name="categoria.idCategoria"
                                    value={formData.categoria.idCategoria}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marca *
                                </label>
                                <select
                                    name="marca.idMarca"
                                    value={formData.marca.idMarca}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar marca</option>
                                    {marcas.map(marca => (
                                        <option key={marca.idMarca} value={marca.idMarca}>
                                            {marca.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Precios y Stock */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Precios y Stock
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Precio de compra */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio de Compra *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precioCompra"
                                        value={formData.precioCompra}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            touched.precioCompra && errors.precioCompra
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {touched.precioCompra && errors.precioCompra && (
                                    <p className="mt-1 text-sm text-red-600">{errors.precioCompra}</p>
                                )}
                            </div>

                            {/* Precio de venta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio de Venta *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precioVenta"
                                        value={formData.precioVenta}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                            touched.precioVenta && errors.precioVenta
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {touched.precioVenta && errors.precioVenta && (
                                    <p className="mt-1 text-sm text-red-600">{errors.precioVenta}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Inicial *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.stock && errors.stock
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                />
                                {touched.stock && errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Cálculos automáticos */}
                        {formData.precioCompra && formData.precioVenta && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Análisis de Rentabilidad</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Margen de ganancia:</span>
                                        <span className={`font-medium ${calcularMargen() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {helpers.formatearMoneda(calcularMargen())}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Porcentaje de ganancia:</span>
                                        <span className={`font-medium ${calcularPorcentajeGanancia() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {calcularPorcentajeGanancia().toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <ButtonSpinner />
                                    <span className="ml-2">Guardando...</span>
                                </span>
                            ) : (
                                <>
                                    <i className={`fas ${producto ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                                    {producto ? 'Actualizar' : 'Crear'} Producto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Exportar componente
window.ProductoForm = ProductoForm;