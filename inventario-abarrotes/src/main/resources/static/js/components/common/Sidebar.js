// js/components/common/Sidebar.js
// Componente de sidebar/navegación lateral

const Sidebar = ({ activeSection, setActiveSection }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: 'fas fa-chart-bar',
            roles: ['ADMIN', 'EMPLEADO', 'CLIENTE']
        },
        {
            id: 'productos',
            name: 'Productos',
            icon: 'fas fa-box',
            roles: ['ADMIN', 'EMPLEADO']
        },
        {
            id: 'usuarios',
            name: 'Usuarios',
            icon: 'fas fa-users',
            roles: ['ADMIN']
        },
        {
            id: 'proveedores',
            name: 'Proveedores',
            icon: 'fas fa-truck',
            roles: ['ADMIN', 'EMPLEADO']
        },
        {
            id: 'ventas',
            name: 'Ventas',
            icon: 'fas fa-shopping-cart',
            roles: ['ADMIN', 'EMPLEADO']
        },
        {
            id: 'reportes',
            name: 'Reportes',
            icon: 'fas fa-chart-line',
            roles: ['ADMIN', 'EMPLEADO']
        }
    ];

    // Filtrar elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.rol)
    );

    const handleMenuClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            logout();
        }
    };

    return (
        <div className="bg-white h-screen w-64 shadow-lg fixed left-0 top-0 z-30 flex flex-col">
            {/* Header del sidebar */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-store text-white"></i>
                    </div>
                    <div className="ml-3">
                        <h2 className="text-xl font-bold text-gray-900">Abarrotes</h2>
                        <p className="text-sm text-gray-600">Inventario</p>
                    </div>
                </div>
            </div>

            {/* Navegación principal */}
            <nav className="flex-1 mt-6 px-3">
                <ul className="space-y-1">
                    {filteredMenuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleMenuClick(item.id)}
                                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors duration-150 ${
                                    activeSection === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <i className={`${item.icon} mr-3 text-lg`}></i>
                                <span className="font-medium">{item.name}</span>

                                {/* Badge para notificaciones (ejemplo) */}
                                {item.id === 'productos' && (
                                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                        3
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sección de configuración */}
            <div className="px-3 py-4 border-t border-gray-200">
                <div className="space-y-1">
                    <button
                        onClick={() => handleMenuClick('perfil')}
                        className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                        <i className="fas fa-user-cog mr-3"></i>
                        <span className="text-sm font-medium">Configuración</span>
                    </button>

                    <button
                        onClick={() => handleMenuClick('ayuda')}
                        className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                        <i className="fas fa-question-circle mr-3"></i>
                        <span className="text-sm font-medium">Ayuda</span>
                    </button>
                </div>
            </div>

            {/* Información del usuario y logout */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-gray-600"></i>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.nombreCompleto || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-600">
                            {user?.rol || 'Rol'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
                >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

// Sidebar compacto para móviles
const MobileSidebar = ({ isOpen, onClose, activeSection, setActiveSection }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-bar' },
        { id: 'productos', name: 'Productos', icon: 'fas fa-box' },
        { id: 'usuarios', name: 'Usuarios', icon: 'fas fa-users' },
        { id: 'ventas', name: 'Ventas', icon: 'fas fa-shopping-cart' }
    ];

    const handleMenuClick = (sectionId) => {
        setActiveSection(sectionId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <i className="fas fa-store text-white text-sm"></i>
                            </div>
                            <span className="ml-2 text-lg font-bold text-gray-900">Abarrotes</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:text-gray-900"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 p-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className={`w-full flex items-center px-3 py-3 mb-2 text-left rounded-lg transition-colors ${
                                    activeSection === item.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <i className={`${item.icon} mr-3`}></i>
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center mb-3">
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <i className="fas fa-user text-gray-600 text-sm"></i>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.nombreCompleto}
                                </p>
                                <p className="text-xs text-gray-600">{user?.rol}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// Hook para controlar el sidebar móvil
const useMobileSidebar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(!isOpen);

    // Cerrar al cambiar de tamaño de pantalla
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isOpen, open, close, toggle };
};

// Exportar componentes
window.Sidebar = Sidebar;
window.MobileSidebar = MobileSidebar;
window.useMobileSidebar = useMobileSidebar;