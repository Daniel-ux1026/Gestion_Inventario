// js/app.js
// Aplicación principal que conecta todos los componentes

const { useState, useEffect } = React;

// Componente principal de la aplicación
const App = () => {
    const { user, loading } = useAuth();
    const { availableSections, defaultSection } = useRoleBasedNavigation();
    const [activeSection, setActiveSection] = useState('dashboard');

    // Configurar sección por defecto basada en el rol del usuario
    useEffect(() => {
        if (user && defaultSection) {
            setActiveSection(defaultSection);
        }
    }, [user, defaultSection]);

    // Mostrar loader mientras se valida la autenticación
    if (loading) {
        return <LoadingSpinner message="Verificando autenticación..." />;
    }

    // Si no hay usuario autenticado, mostrar login
    if (!user) {
        return <Login />;
    }

    // Función para renderizar la sección activa
    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'productos':
                return <ProductosList />;
            case 'usuarios':
                return (
                    <ProtectedSection requiredRole={CONSTANTS.ROLES.ADMIN}>
                        <UsuariosList />
                    </ProtectedSection>
                );
            case 'proveedores':
                return (
                    <ProtectedSection requiredRole={CONSTANTS.ROLES.ADMIN}>
                        <ProveedoresList />
                    </ProtectedSection>
                );
            case 'ventas':
                return (
                    <ProtectedSection
                        requiredRole={CONSTANTS.ROLES.EMPLEADO}
                        fallback={
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">Mis Compras</h1>
                                <VentasList clienteOnly={true} />
                            </div>
                        }
                    >
                        <VentasList />
                    </ProtectedSection>
                );
            case 'reportes':
                return (
                    <ProtectedSection requiredRole={CONSTANTS.ROLES.EMPLEADO}>
                        <ReportesList />
                    </ProtectedSection>
                );
            case 'perfil':
                return <PerfilUsuario />;
            case 'configuracion':
                return (
                    <ProtectedSection requiredRole={CONSTANTS.ROLES.ADMIN}>
                        <Configuracion />
                    </ProtectedSection>
                );
            case 'ayuda':
                return <AyudaSoporte />;
            default:
                return <Dashboard />;
        }
    };

    // Verificar si el usuario puede acceder a la sección actual
    const canAccessCurrentSection = availableSections.some(section => section.id === activeSection);

    // Si no puede acceder, redirigir al dashboard o sección por defecto
    useEffect(() => {
        if (!canAccessCurrentSection && availableSections.length > 0) {
            setActiveSection(availableSections[0].id);
        }
    }, [canAccessCurrentSection, availableSections]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Contenido principal */}
            <main className="flex-1 ml-64 overflow-y-auto">
                <ErrorBoundary>
                    {renderSection()}
                </ErrorBoundary>
            </main>

            {/* Notificaciones globales */}
            <NotificationContainer />
        </div>
    );
};

// Componente de error boundary para capturar errores
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                        <i className="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
                        <h2 className="text-xl font-bold text-red-900 mb-2">
                            Algo salió mal
                        </h2>
                        <p className="text-red-700 mb-4">
                            Se produjo un error inesperado. Por favor, recarga la página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <i className="fas fa-redo mr-2"></i>
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Componente placeholder para secciones no implementadas
const PlaceholderSection = ({ title, description, icon }) => {
    return (
        <div className="p-6">
            <div className="text-center py-16">
                <i className={`${icon} text-gray-400 text-6xl mb-6`}></i>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                        <i className="fas fa-info-circle mr-2"></i>
                        Próximamente
                    </h3>
                    <p className="text-blue-800 text-sm">
                        Esta sección está en desarrollo y estará disponible en futuras actualizaciones.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Componentes placeholder para secciones no implementadas
const ProveedoresList = () => (
    <PlaceholderSection
        title="Proveedores"
        description="Gestión de proveedores y compras del establecimiento"
        icon="fas fa-truck"
    />
);

const ReportesList = () => (
    <PlaceholderSection
        title="Reportes"
        description="Análisis y reportes detallados de ventas e inventario"
        icon="fas fa-chart-line"
    />
);

const PerfilUsuario = () => (
    <PlaceholderSection
        title="Perfil de Usuario"
        description="Configura tu información personal y preferencias"
        icon="fas fa-user-cog"
    />
);

const Configuracion = () => (
    <PlaceholderSection
        title="Configuración"
        description="Configuración general del sistema y parámetros"
        icon="fas fa-cogs"
    />
);

const AyudaSoporte = () => (
    <div className="p-6">
        <SimpleHeader
            title="Ayuda y Soporte"
            subtitle="Encuentra respuestas a tus preguntas"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ */}
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="text-center">
                    <i className="fas fa-question-circle text-blue-600 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Preguntas Frecuentes
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Encuentra respuestas a las preguntas más comunes
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Ver FAQ
                    </button>
                </div>
            </div>

            {/* Manual */}
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="text-center">
                    <i className="fas fa-book text-green-600 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Manual de Usuario
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Guía completa de uso del sistema
                    </p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Descargar Manual
                    </button>
                </div>
            </div>

            {/* Contacto */}
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="text-center">
                    <i className="fas fa-headset text-purple-600 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Soporte Técnico
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Contacta con nuestro equipo de soporte
                    </p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        Contactar Soporte
                    </button>
                </div>
            </div>
        </div>

        {/* Información del sistema */}
        <div className="mt-8 bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                Información del Sistema
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="text-gray-600">Versión:</span>
                    <div className="font-medium text-gray-900">{CONSTANTS.APP.VERSION}</div>
                </div>
                <div>
                    <span className="text-gray-600">Nombre:</span>
                    <div className="font-medium text-gray-900">{CONSTANTS.APP.NOMBRE}</div>
                </div>
                <div>
                    <span className="text-gray-600">Desarrollado por:</span>
                    <div className="font-medium text-gray-900">{CONSTANTS.APP.AUTOR}</div>
                </div>
                <div>
                    <span className="text-gray-600">Última actualización:</span>
                    <div className="font-medium text-gray-900">
                        {helpers.formatearFecha(new Date(), 'DD/MM/YYYY')}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Contenedor de notificaciones
const NotificationContainer = () => {
    // Este sería el lugar para implementar un sistema de notificaciones toast
    // Por ahora es un placeholder
    return null;
};

// Función para inicializar la aplicación
const initializeApp = () => {
    // Configuraciones iniciales
    console.log('🚀 Iniciando Sistema de Inventario - Abarrotes');
    console.log('📊 Versión:', CONSTANTS.APP.VERSION);

    // Verificar compatibilidad del navegador
    if (!window.localStorage) {
        alert('Tu navegador no soporta localStorage. Algunas funciones pueden no funcionar correctamente.');
    }

    // Configurar manejador de errores globales
    window.addEventListener('error', (event) => {
        console.error('Error global capturado:', event.error);
    });

    // Configurar manejador de promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesa rechazada no manejada:', event.reason);
    });
};

// Renderizar la aplicación
const renderApp = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));

    root.render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    renderApp();
});

// Exportar componentes principales para uso global
window.App = App;
window.ErrorBoundary = ErrorBoundary;
window.PlaceholderSection = PlaceholderSection;