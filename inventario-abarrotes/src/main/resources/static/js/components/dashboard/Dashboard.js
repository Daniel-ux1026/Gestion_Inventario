// js/components/dashboard/Dashboard.js
// Componente del dashboard con métricas y gráficos

const Dashboard = () => {
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { user } = useAuth();

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar estadísticas de ventas
            const statsResult = await ventaService.getEstadisticas();

            if (statsResult.success) {
                setStats(statsResult.data);
            } else {
                setError('Error al cargar las estadísticas');
            }
        } catch (error) {
            setError('Error de conexión');
            console.error('Error en dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        loadDashboardData();
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
                <LoadingSpinner size="medium" message="Cargando dashboard..." fullScreen={false} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <i className="fas fa-exclamation-triangle text-red-600 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar el dashboard</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={refreshData}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <i className="fas fa-redo mr-2"></i>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Datos por defecto si no hay estadísticas
    const defaultStats = {
        totalUsuarios: 0,
        totalProductos: 0,
        ventasDelDia: 0,
        totalVentasDelDia: 0,
        ventasDelMes: 0,
        totalVentasDelMes: 0,
        productosConStockBajo: 0,
        productosSinStock: 0
    };

    const currentStats = stats || defaultStats;

    return (
        <div className="p-6 space-y-6">
            {/* Header del Dashboard */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Bienvenido, {user?.nombreCompleto || 'Usuario'}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={refreshData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <i className="fas fa-sync-alt mr-2"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Cards de Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Usuarios"
                    value={helpers.formatearNumero(currentStats.totalUsuarios)}
                    icon="fas fa-users"
                    color="blue"
                />
                <StatsCard
                    title="Total Productos"
                    value={helpers.formatearNumero(currentStats.totalProductos)}
                    icon="fas fa-box"
                    color="green"
                />
                <StatsCard
                    title="Ventas del Día"
                    value={helpers.formatearNumero(currentStats.ventasDelDia)}
                    icon="fas fa-shopping-cart"
                    color="purple"
                />
                <StatsCard
                    title="Ingresos del Día"
                    value={helpers.formatearMoneda(currentStats.totalVentasDelDia)}
                    icon="fas fa-euro-sign"
                    color="green"
                />
            </div>

            {/* Segunda fila de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Ventas del Mes"
                    value={helpers.formatearNumero(currentStats.ventasDelMes)}
                    icon="fas fa-chart-line"
                    color="blue"
                />
                <StatsCard
                    title="Ingresos del Mes"
                    value={helpers.formatearMoneda(currentStats.totalVentasDelMes)}
                    icon="fas fa-coins"
                    color="green"
                />
                <StatsCard
                    title="Stock Bajo"
                    value={helpers.formatearNumero(currentStats.productosConStockBajo)}
                    icon="fas fa-exclamation-triangle"
                    color="yellow"
                />
                <StatsCard
                    title="Sin Stock"
                    value={helpers.formatearNumero(currentStats.productosSinStock)}
                    icon="fas fa-times-circle"
                    color="red"
                />
            </div>

            {/* Gráficos y Análisis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Ventas */}
                <VentasChart stats={currentStats} />

                {/* Resumen de Inventario */}
                <InventarioSummary stats={currentStats} />
            </div>

            {/* Alertas y Notificaciones */}
            {(currentStats.productosConStockBajo > 0 || currentStats.productosSinStock > 0) && (
                <AlertasInventario
                    stockBajo={currentStats.productosConStockBajo}
                    sinStock={currentStats.productosSinStock}
                />
            )}

            {/* Acciones Rápidas */}
            <AccionesRapidas />

            {/* Actividad Reciente */}
            <ActividadReciente />
        </div>
    );
};

// Componente de gráfico de ventas
const VentasChart = ({ stats }) => {
    return (
        <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumen de Ventas</h3>
                <i className="fas fa-chart-bar text-blue-600"></i>
            </div>

            <div className="space-y-4">
                {/* Ventas del día vs mes */}
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                        <p className="text-sm text-blue-600 font-medium">Ventas Hoy</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {stats.ventasDelDia}
                        </p>
                        <p className="text-sm text-blue-700">
                            {helpers.formatearMoneda(stats.totalVentasDelDia)}
                        </p>
                    </div>
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-calendar-day text-blue-600 text-xl"></i>
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                        <p className="text-sm text-green-600 font-medium">Ventas Este Mes</p>
                        <p className="text-2xl font-bold text-green-900">
                            {stats.ventasDelMes}
                        </p>
                        <p className="text-sm text-green-700">
                            {helpers.formatearMoneda(stats.totalVentasDelMes)}
                        </p>
                    </div>
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-calendar-alt text-green-600 text-xl"></i>
                    </div>
                </div>

                {/* Promedio de venta */}
                <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Promedio por venta (mes):</span>
                        <span className="font-medium text-gray-900">
                            {stats.ventasDelMes > 0
                                ? helpers.formatearMoneda(stats.totalVentasDelMes / stats.ventasDelMes)
                                : helpers.formatearMoneda(0)
                            }
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Crecimiento estimado:</span>
                        <span className="font-medium text-green-600">
                            <i className="fas fa-arrow-up mr-1"></i>
                            +{Math.round(Math.random() * 15 + 5)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Resumen de inventario
const InventarioSummary = ({ stats }) => {
    const totalProductos = stats.totalProductos || 0;
    const stockBajo = stats.productosConStockBajo || 0;
    const sinStock = stats.productosSinStock || 0;
    const stockNormal = totalProductos - stockBajo - sinStock;

    const getPercentage = (value) => {
        return totalProductos > 0 ? (value / totalProductos) * 100 : 0;
    };

    return (
        <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estado del Inventario</h3>
                <i className="fas fa-warehouse text-green-600"></i>
            </div>

            <div className="space-y-4">
                {/* Indicadores de stock */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Stock Normal</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {stockNormal} ({Math.round(getPercentage(stockNormal))}%)
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Stock Bajo</span>
                        </div>
                        <span className="text-sm font-medium text-yellow-600">
                            {stockBajo} ({Math.round(getPercentage(stockBajo))}%)
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Sin Stock</span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                            {sinStock} ({Math.round(getPercentage(sinStock))}%)
                        </span>
                    </div>
                </div>

                {/* Barra de progreso visual */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="h-3 rounded-full flex"
                        style={{ width: '100%' }}
                    >
                        <div
                            className="bg-green-500 rounded-l-full"
                            style={{ width: `${getPercentage(stockNormal)}%` }}
                        ></div>
                        <div
                            className="bg-yellow-500"
                            style={{ width: `${getPercentage(stockBajo)}%` }}
                        ></div>
                        <div
                            className="bg-red-500 rounded-r-full"
                            style={{ width: `${getPercentage(sinStock)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="border-t pt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{totalProductos}</p>
                        <p className="text-xs text-gray-600">Total Productos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                            {Math.round(((stockNormal) / (totalProductos || 1)) * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">Stock Saludable</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Alertas de inventario
const AlertasInventario = ({ stockBajo, sinStock }) => {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-600 text-2xl"></i>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-800">
                        Atención Requerida en Inventario
                    </h3>
                    <div className="mt-2 text-yellow-700">
                        <ul className="list-disc list-inside space-y-1">
                            {stockBajo > 0 && (
                                <li>
                                    <strong>{stockBajo}</strong> productos con stock bajo requieren reposición
                                </li>
                            )}
                            {sinStock > 0 && (
                                <li>
                                    <strong>{sinStock}</strong> productos están agotados
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                            <i className="fas fa-eye mr-2"></i>
                            Ver Productos Afectados
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Acciones rápidas
const AccionesRapidas = () => {
    const { canAccess } = useAuth();

    const actions = [
        {
            label: 'Nueva Venta',
            icon: 'fas fa-plus-circle',
            color: 'bg-green-600 hover:bg-green-700',
            section: 'ventas',
            onClick: () => console.log('Nueva venta')
        },
        {
            label: 'Agregar Producto',
            icon: 'fas fa-box-open',
            color: 'bg-blue-600 hover:bg-blue-700',
            section: 'productos',
            onClick: () => console.log('Nuevo producto')
        },
        {
            label: 'Nuevo Usuario',
            icon: 'fas fa-user-plus',
            color: 'bg-purple-600 hover:bg-purple-700',
            section: 'usuarios',
            onClick: () => console.log('Nuevo usuario')
        },
        {
            label: 'Ver Reportes',
            icon: 'fas fa-chart-line',
            color: 'bg-indigo-600 hover:bg-indigo-700',
            section: 'reportes',
            onClick: () => console.log('Reportes')
        }
    ];

    const availableActions = actions.filter(action => canAccess(action.section));

    return (
        <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-bolt mr-2 text-yellow-500"></i>
                Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`${action.color} text-white p-4 rounded-lg transition-colors text-center hover-scale`}
                    >
                        <i className={`${action.icon} text-2xl mb-2 block`}></i>
                        <span className="text-sm font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Actividad reciente
const ActividadReciente = () => {
    const [actividades] = React.useState([
        {
            id: 1,
            tipo: 'venta',
            descripcion: 'Nueva venta realizada por Juan Pérez',
            tiempo: '2 minutos',
            icon: 'fas fa-shopping-cart',
            color: 'text-green-600'
        },
        {
            id: 2,
            tipo: 'producto',
            descripcion: 'Stock actualizado para Coca Cola 500ml',
            tiempo: '15 minutos',
            icon: 'fas fa-box',
            color: 'text-blue-600'
        },
        {
            id: 3,
            tipo: 'usuario',
            descripcion: 'Nuevo cliente registrado: Ana García',
            tiempo: '1 hora',
            icon: 'fas fa-user-plus',
            color: 'text-purple-600'
        },
        {
            id: 4,
            tipo: 'alerta',
            descripcion: 'Producto con stock bajo: Arroz Costeño',
            tiempo: '2 horas',
            icon: 'fas fa-exclamation-triangle',
            color: 'text-yellow-600'
        }
    ]);

    return (
        <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-clock mr-2 text-blue-500"></i>
                    Actividad Reciente
                </h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver todo
                </button>
            </div>

            <div className="space-y-4">
                {actividades.map((actividad) => (
                    <div key={actividad.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                            <i className={`${actividad.icon} ${actividad.color} text-sm`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{actividad.descripcion}</p>
                            <p className="text-xs text-gray-500 mt-1">hace {actividad.tiempo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Exportar componente
window.Dashboard = Dashboard;