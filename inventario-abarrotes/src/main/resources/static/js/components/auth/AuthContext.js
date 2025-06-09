// js/components/auth/AuthContext.js
// Context para manejo de autenticación

const { createContext, useContext, useState, useEffect } = React;

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

// Proveedor de autenticación
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        validateToken();
    }, []);

    // Verificar periódicamente si el token sigue siendo válido
    useEffect(() => {
        const interval = setInterval(() => {
            if (authService.isAuthenticated()) {
                validateToken();
            }
        }, CONSTANTS.TIMEOUTS.SESSION_CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    /**
     * Validar token actual
     */
    const validateToken = async () => {
        const token = authService.getToken();
        if (token) {
            const result = await authService.validateToken();
            if (result.success) {
                setUser(result.data);
                authService.setCurrentUser(result.data);
            } else {
                logout();
            }
        }
        setLoading(false);
    };

    /**
     * Iniciar sesión
     */
    const login = async (correo, contrasenia) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.login(correo, contrasenia);

            if (result.success) {
                const { token, ...userData } = result.data;
                localStorage.setItem('token', token);
                setUser(userData);
                authService.setCurrentUser(userData);
                return { success: true };
            } else {
                setError(result.message);
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'Error inesperado al iniciar sesión';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cerrar sesión
     */
    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    /**
     * Limpiar errores
     */
    const clearError = () => {
        setError(null);
    };

    /**
     * Verificar si el usuario tiene permisos
     */
    const hasPermission = (requiredRole) => {
        if (!user || !user.rol) return false;

        // Admin tiene acceso a todo
        if (user.rol === CONSTANTS.ROLES.ADMIN) return true;

        // Verificar rol específico
        return user.rol === requiredRole;
    };

    /**
     * Verificar si el usuario puede acceder a una sección
     */
    const canAccess = (section) => {
        if (!user) return false;

        const permissions = {
            dashboard: [CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLEADO, CONSTANTS.ROLES.CLIENTE],
            productos: [CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLEADO],
            usuarios: [CONSTANTS.ROLES.ADMIN],
            proveedores: [CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLEADO],
            ventas: [CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLEADO],
            reportes: [CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLEADO]
        };

        return permissions[section]?.includes(user.rol) || false;
    };

    /**
     * Actualizar información del usuario
     */
    const updateUser = (updatedUser) => {
        setUser(prev => ({ ...prev, ...updatedUser }));
        authService.setCurrentUser({ ...user, ...updatedUser });
    };

    // Valor del contexto
    const value = {
        // Estado
        user,
        loading,
        error,

        // Funciones de autenticación
        login,
        logout,
        validateToken,
        clearError,
        updateUser,

        // Funciones de permisos
        hasPermission,
        canAccess,

        // Helpers de rol
        isAdmin: () => hasPermission(CONSTANTS.ROLES.ADMIN),
        isEmpleado: () => hasPermission(CONSTANTS.ROLES.EMPLEADO),
        isCliente: () => hasPermission(CONSTANTS.ROLES.CLIENTE),

        // Estado de autenticación
        isAuthenticated: () => !!user,
        isLoading: loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// HOC para proteger rutas
const withAuth = (WrappedComponent, requiredRole = null) => {
    return (props) => {
        const { user, loading, hasPermission } = useAuth();

        if (loading) {
            return <LoadingSpinner message="Verificando autenticación..." />;
        }

        if (!user) {
            return <Login />;
        }

        if (requiredRole && !hasPermission(requiredRole)) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <i className="fas fa-lock text-6xl text-gray-400 mb-4"></i>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Acceso Denegado
                        </h2>
                        <p className="text-gray-600">
                            No tienes permisos para acceder a esta sección.
                        </p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

// Componente para proteger secciones específicas
const ProtectedSection = ({ children, requiredRole, fallback = null }) => {
    const { hasPermission } = useAuth();

    if (requiredRole && !hasPermission(requiredRole)) {
        return fallback || (
            <div className="text-center py-8">
                <i className="fas fa-lock text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-600">No tienes permisos para ver esta sección.</p>
            </div>
        );
    }

    return children;
};

// Hook para manejar la navegación basada en roles
const useRoleBasedNavigation = () => {
    const { user, canAccess } = useAuth();

    const getAvailableSections = () => {
        const allSections = [
            { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-bar' },
            { id: 'productos', name: 'Productos', icon: 'fas fa-box' },
            { id: 'usuarios', name: 'Usuarios', icon: 'fas fa-users' },
            { id: 'proveedores', name: 'Proveedores', icon: 'fas fa-truck' },
            { id: 'ventas', name: 'Ventas', icon: 'fas fa-shopping-cart' },
            { id: 'reportes', name: 'Reportes', icon: 'fas fa-chart-line' }
        ];

        return allSections.filter(section => canAccess(section.id));
    };

    const getDefaultSection = () => {
        if (!user) return 'dashboard';

        const availableSections = getAvailableSections();
        return availableSections.length > 0 ? availableSections[0].id : 'dashboard';
    };

    return {
        availableSections: getAvailableSections(),
        defaultSection: getDefaultSection()
    };
};

// Exportar para uso global
window.AuthContext = AuthContext;
window.useAuth = useAuth;
window.AuthProvider = AuthProvider;
window.withAuth = withAuth;
window.ProtectedSection = ProtectedSection;
window.useRoleBasedNavigation = useRoleBasedNavigation;