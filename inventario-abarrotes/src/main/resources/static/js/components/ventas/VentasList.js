// js/components/ventas/VentasList.js
// Lista de ventas

const VentasList = () => {
    const [ventas, setVentas] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        loadVentas();
    }, []);

    const loadVentas = async () => {
        try {
            setLoading(true);
            const result = await ventaService.getAll();

            if (result.success) {
                setVentas(result.data);
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al cargar ventas', 'error');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnular = async (id) => {
        if (window.confirm(CONSTANTS.MENSAJES.CONFIRMAR_ANULACION)) {
            try {
                const result = await ventaService.anular(id);
                if (result.success) {
                    showNotification('Venta anulada correctamente', 'success');
                    loadVentas();
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Error al anular venta', 'error');
            }
        }
    };

    const filteredVentas = ventas.filter(venta =>
        venta.cliente?.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.usuario?.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.idVenta.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="p-6">
                <SimpleHeader title="Ventas" subtitle="Gestión de ventas del establecimiento" />
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
                    title="Ventas"
                    subtitle={`${filteredVentas.length} ventas registradas`}
                />
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nueva Venta
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Buscar por cliente, vendedor o ID de venta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                        <button
                            onClick={() => helpers.descargarCSV(filteredVentas, 'ventas.csv')}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                            <i className="fas fa-download mr-1"></i>
                            Exportar
                        </button>
                        <button
                            onClick={loadVentas}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            <i className="fas fa-sync-alt mr-1"></i>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="bg-white rounded-xl card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID Venta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vendedor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredVentas.map((venta) => (
                            <VentaRow
                                key={venta.idVenta}
                                venta={venta}
                                onAnular={handleAnular}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredVentas.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-shopping-cart text-gray-400 text-4xl mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron ventas
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm
                                ? 'Intenta ajustar los términos de búsqueda'
                                : 'Comienza creando tu primera venta'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Nueva Venta
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de nueva venta */}
            {showModal && (
                <VentaForm
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false);
                        loadVentas();
                    }}
                />
            )}
        </div>
    );
};

// Componente de fila de venta
const VentaRow = ({ venta, onAnular }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{venta.idVenta}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {venta.cliente?.nombreCompleto || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {venta.cliente?.correo || 'Sin correo'}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {venta.usuario?.nombreCompleto || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {helpers.formatearFecha(venta.fecha, 'DD/MM/YYYY HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {venta.detalles?.length || 0} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {helpers.formatearMoneda(venta.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        venta.estado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        <i className={`fas ${venta.estado ? 'fa-check' : 'fa-ban'} mr-1`}></i>
                        {venta.estado ? 'Completada' : 'Anulada'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalles"
                        >
                            <i className={`fas ${showDetails ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        {venta.estado && (
                            <button
                                onClick={() => onAnular(venta.idVenta)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Anular venta"
                            >
                                <i className="fas fa-ban"></i>
                            </button>
                        )}
                        <button
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Imprimir"
                        >
                            <i className="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>

            {/* Fila de detalles expandible */}
            {showDetails && (
                <tr>
                    <td colSpan="8" className="px-6 py-4 bg-gray-50">
                        <VentaDetails venta={venta} />
                    </td>
                </tr>
            )}
        </>
    );
};

// Componente de detalles de venta
const VentaDetails = ({ venta }) => {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
                <i className="fas fa-list mr-2 text-blue-600"></i>
                Detalles de la Venta #{venta.idVenta}
            </h4>

            {venta.detalles && venta.detalles.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                Producto
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                Cantidad
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                Precio Unit.
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                                Subtotal
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {venta.detalles.map((detalle, index) => (
                            <tr key={index}>
                                <td className="py-2 text-sm">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {detalle.producto?.nombre || 'Producto no disponible'}
                                        </div>
                                        <div className="text-gray-500">
                                            {detalle.producto?.codigo} - {detalle.producto?.presentacion}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 text-sm text-gray-900">
                                    {detalle.cantidad}
                                </td>
                                <td className="py-2 text-sm text-gray-900">
                                    {helpers.formatearMoneda(detalle.precioUnitario)}
                                </td>
                                <td className="py-2 text-sm font-medium text-gray-900">
                                    {helpers.formatearMoneda(detalle.subtotal)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr className="border-t-2 border-gray-300">
                            <td colSpan="3" className="py-2 text-sm font-medium text-gray-900 text-right">
                                Total:
                            </td>
                            <td className="py-2 text-sm font-bold text-green-600">
                                {helpers.formatearMoneda(venta.total)}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    <i className="fas fa-inbox text-2xl mb-2"></i>
                    <p>No hay detalles disponibles para esta venta</p>
                </div>
            )}
        </div>
    );
};

// Exportar componente
window.VentasList = VentasList;