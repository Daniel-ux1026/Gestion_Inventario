// js/components/ventas/VentaForm.js
// Formulario de ventas con carrito de compras

const VentaForm = ({ onClose, onSave }) => {
    const [productos, setProductos] = React.useState([]);
    const [clientes, setClientes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [loadingData, setLoadingData] = React.useState(true);

    // Estado del carrito
    const [clienteSeleccionado, setClienteSeleccionado] = React.useState('');
    const [carrito, setCarrito] = React.useState([]);
    const [busquedaProducto, setBusquedaProducto] = React.useState('');
    const [productosDisponibles, setProductosDisponibles] = React.useState([]);

    React.useEffect(() => {
        loadInitialData();
    }, []);

    React.useEffect(() => {
        filtrarProductos();
    }, [busquedaProducto, productos]);

    const loadInitialData = async () => {
        try {
            setLoadingData(true);

            // Cargar productos disponibles y clientes
            const [productosResult, clientesResult] = await Promise.all([
                productoService.getDisponibles(),
                usuarioService.getClientes()
            ]);

            if (productosResult.success) {
                setProductos(productosResult.data);
            }

            if (clientesResult.success) {
                setClientes(clientesResult.data);
            }
        } catch (error) {
            showNotification('Error al cargar datos iniciales', 'error');
            console.error('Error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const filtrarProductos = () => {
        if (!busquedaProducto.trim()) {
            setProductosDisponibles([]);
            return;
        }

        const filtered = productos.filter(producto =>
            producto.stock > 0 &&
            (producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
                producto.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())) &&
            !carrito.some(item => item.producto.idProducto === producto.idProducto)
        ).slice(0, 5); // Máximo 5 resultados

        setProductosDisponibles(filtered);
    };

    const agregarAlCarrito = (producto) => {
        const nuevoItem = {
            id: helpers.generarId(),
            producto: producto,
            cantidad: 1,
            precioUnitario: producto.precioVenta,
            subtotal: producto.precioVenta
        };

        setCarrito([...carrito, nuevoItem]);
        setBusquedaProducto('');
        setProductosDisponibles([]);
    };

    const actualizarCantidad = (itemId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(itemId);
            return;
        }

        const item = carrito.find(item => item.id === itemId);
        if (item && nuevaCantidad > item.producto.stock) {
            showNotification(`Stock máximo disponible: ${item.producto.stock}`, 'warning');
            return;
        }

        setCarrito(carrito.map(item => {
            if (item.id === itemId) {
                const nuevoSubtotal = nuevaCantidad * item.precioUnitario;
                return { ...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
            }
            return item;
        }));
    };

    const actualizarPrecio = (itemId, nuevoPrecio) => {
        if (nuevoPrecio <= 0) return;

        setCarrito(carrito.map(item => {
            if (item.id === itemId) {
                const nuevoSubtotal = item.cantidad * nuevoPrecio;
                return { ...item, precioUnitario: nuevoPrecio, subtotal: nuevoSubtotal };
            }
            return item;
        }));
    };

    const eliminarDelCarrito = (itemId) => {
        setCarrito(carrito.filter(item => item.id !== itemId));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.subtotal, 0);
    };

    const calcularTotalItems = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    };

    const limpiarCarrito = () => {
        setCarrito([]);
        setClienteSeleccionado('');
        setBusquedaProducto('');
    };

    const handleSubmitVenta = async () => {
        // Validaciones
        if (!clienteSeleccionado) {
            showNotification('Debe seleccionar un cliente', 'warning');
            return;
        }

        if (carrito.length === 0) {
            showNotification('Debe agregar al menos un producto', 'warning');
            return;
        }

        // Validar stock disponible
        for (const item of carrito) {
            if (item.cantidad > item.producto.stock) {
                showNotification(`Stock insuficiente para ${item.producto.nombre}`, 'error');
                return;
            }
        }

        setLoading(true);

        try {
            const ventaData = {
                clienteId: parseInt(clienteSeleccionado),
                detalles: carrito.map(item => ({
                    productoId: item.producto.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario
                }))
            };

            const result = await ventaService.create(ventaData);

            if (result.success) {
                showNotification('Venta creada exitosamente', 'success');
                onSave();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al procesar la venta', 'error');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8">
                    <LoadingSpinner message="Cargando datos..." fullScreen={false} />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-6xl max-h-screen overflow-hidden flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            <i className="fas fa-shopping-cart mr-2 text-green-600"></i>
                            Nueva Venta
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Panel izquierdo - Selección de productos */}
                    <div className="w-1/2 border-r border-gray-200 flex flex-col">
                        {/* Cliente */}
                        <div className="p-6 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cliente *
                            </label>
                            <select
                                value={clienteSeleccionado}
                                onChange={(e) => setClienteSeleccionado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.idUsuario} value={cliente.idUsuario}>
                                        {cliente.nombreCompleto} - {cliente.correo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Búsqueda de productos */}
                        <div className="p-6 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar Producto
                            </label>
                            <div className="relative">
                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o código..."
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Resultados de búsqueda */}
                            {productosDisponibles.length > 0 && (
                                <div className="mt-3 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                                    {productosDisponibles.map(producto => (
                                        <div
                                            key={producto.idProducto}
                                            onClick={() => agregarAlCarrito(producto)}
                                            className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
                                                    <p className="text-sm text-gray-600">{producto.codigo} - {producto.presentacion}</p>
                                                    <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-green-600">
                                                        {helpers.formatearMoneda(producto.precioVenta)}
                                                    </p>
                                                    <button className="text-blue-600 text-sm hover:text-blue-800">
                                                        <i className="fas fa-plus-circle mr-1"></i>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información adicional */}
                        <div className="flex-1 p-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Instrucciones
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Busca productos escribiendo el nombre o código</li>
                                    <li>• Haz clic en un producto para agregarlo al carrito</li>
                                    <li>• Ajusta cantidades y precios en el carrito</li>
                                    <li>• Selecciona un cliente antes de finalizar</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho - Carrito */}
                    <div className="w-1/2 flex flex-col">
                        {/* Header del carrito */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Carrito de Compras
                                    {carrito.length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                            {calcularTotalItems()} items
                                        </span>
                                    )}
                                </h3>
                                {carrito.length > 0 && (
                                    <button
                                        onClick={limpiarCarrito}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        <i className="fas fa-trash mr-1"></i>
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Items del carrito */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {carrito.length === 0 ? (
                                <div className="text-center py-12">
                                    <i className="fas fa-shopping-cart text-gray-400 text-4xl mb-4"></i>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Carrito vacío
                                    </h3>
                                    <p className="text-gray-600">
                                        Busca y agrega productos para comenzar la venta
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {carrito.map(item => (
                                        <CarritoItem
                                            key={item.id}
                                            item={item}
                                            onUpdateCantidad={actualizarCantidad}
                                            onUpdatePrecio={actualizarPrecio}
                                            onRemove={eliminarDelCarrito}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resumen y acciones */}
                        {carrito.length > 0 && (
                            <div className="border-t border-gray-200 p-6">
                                {/* Resumen de totales */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">{helpers.formatearMoneda(calcularTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total de items:</span>
                                        <span className="font-medium">{calcularTotalItems()}</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-green-600">{helpers.formatearMoneda(calcularTotal())}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmitVenta}
                                        disabled={loading || !clienteSeleccionado}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <ButtonSpinner />
                                                <span className="ml-2">Procesando...</span>
                                            </span>
                                        ) : (
                                            <>
                                                <i className="fas fa-check mr-2"></i>
                                                Finalizar Venta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para cada item del carrito
const CarritoItem = ({ item, onUpdateCantidad, onUpdatePrecio, onRemove }) => {
    const [editingCantidad, setEditingCantidad] = React.useState(false);
    const [editingPrecio, setEditingPrecio] = React.useState(false);

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.producto.nombre}</h4>
                    <p className="text-sm text-gray-600">{item.producto.codigo} - {item.producto.presentacion}</p>
                    <p className="text-xs text-gray-500">Stock disponible: {item.producto.stock}</p>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar del carrito"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
                {/* Cantidad */}
                <div>
                    <label className="block text-gray-600 mb-1">Cantidad</label>
                    {editingCantidad ? (
                        <input
                            type="number"
                            min="1"
                            max={item.producto.stock}
                            value={item.cantidad}
                            onChange={(e) => onUpdateCantidad(item.id, parseInt(e.target.value))}
                            onBlur={() => setEditingCantidad(false)}
                            onKeyPress={(e) => e.key === 'Enter' && setEditingCantidad(false)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            autoFocus
                        />
                    ) : (
                        <div
                            onClick={() => setEditingCantidad(true)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center cursor-pointer hover:bg-white transition-colors"
                        >
                            {item.cantidad}
                        </div>
                    )}
                </div>

                {/* Precio unitario */}
                <div>
                    <label className="block text-gray-600 mb-1">Precio</label>
                    {editingPrecio ? (
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.precioUnitario}
                            onChange={(e) => onUpdatePrecio(item.id, parseFloat(e.target.value))}
                            onBlur={() => setEditingPrecio(false)}
                            onKeyPress={(e) => e.key === 'Enter' && setEditingPrecio(false)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            autoFocus
                        />
                    ) : (
                        <div
                            onClick={() => setEditingPrecio(true)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center cursor-pointer hover:bg-white transition-colors"
                        >
                            €{item.precioUnitario.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Subtotal */}
                <div>
                    <label className="block text-gray-600 mb-1">Subtotal</label>
                    <div className="w-full px-2 py-1 bg-gray-100 rounded text-center font-medium">
                        {helpers.formatearMoneda(item.subtotal)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exportar componente
window.VentaForm = VentaForm;