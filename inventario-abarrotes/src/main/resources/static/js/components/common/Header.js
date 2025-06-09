// js/components/common/Header.js
// Componente de header/navegación superior

const Header = ({ title, subtitle, actions = [] }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Título y subtítulo */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>

                {/* Acciones del header */}
                <div className="flex items-center space-x-4">
                    {/* Acciones personalizadas */}
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                action.variant === 'primary'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : action.variant === 'secondary'
                                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {action.icon && <i className={`${action.icon} mr-2`}></i>}
                            {action.label}
                        </button>
                    ))}

                    {/* Notificaciones */}
                    <div className="relative">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                            <i className="fas fa-bell text-lg"></i>
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    {/* Información del usuario */}
                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.nombreCompleto || 'Usuario'}
                            </p>
                            <p className="text-xs text-gray-600">
                                {user?.rol || 'Rol'}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <i className="fas fa-user text-gray-600"></i>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Header simple sin acciones
const SimpleHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
                <p className="text-gray-600 mt-2">{subtitle}</p>
            )}
        </div>
    );
};

// Breadcrumb component
const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <i className="fas fa-chevron-right text-gray-400 text-xs mx-2"></i>
                        )}
                        {item.href ? (
                            <a
                                href={item.href}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-sm text-gray-500 font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

// Stats cards para el header
const StatsCard = ({ title, value, icon, color = 'blue', trend = null }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-1">
                            <i className={`fas fa-arrow-${trend.direction} text-xs mr-1 ${
                                trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}></i>
                            <span className={`text-xs font-medium ${
                                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend.percentage}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <i className={`${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
};

// Quick actions component
const QuickActions = ({ actions = [] }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="flex items-center justify-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <i className={`${action.icon} mr-2`}></i>
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Exportar componentes
window.Header = Header;
window.SimpleHeader = SimpleHeader;
window.Breadcrumb = Breadcrumb;
window.StatsCard = StatsCard;
window.QuickActions = QuickActions;