// js/components/auth/Login.js
// Componente de login

const Login = () => {
    const { login, loading, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);

    // Usar el hook de validación personalizado
    const {
        data: formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        isValid
    } = useFormValidation(
        { correo: '', contrasenia: '' },
        validationSchemas.login
    );

    const [submitLoading, setSubmitLoading] = React.useState(false);

    // Limpiar errores al cambiar los campos
    React.useEffect(() => {
        if (error) {
            clearError();
        }
    }, [formData.correo, formData.contrasenia]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitLoading(true);

        try {
            const result = await login(formData.correo, formData.contrasenia);

            if (!result.success) {
                // El error ya se maneja en el contexto
                console.error('Error de login:', result.message);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(name, value);
    };

    const handleInputBlur = (e) => {
        const { name } = e.target;
        handleBlur(name);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl card-shadow p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-store text-2xl text-blue-600"></i>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Abarrotes</h2>
                        <p className="text-gray-600 mt-2">Sistema de Inventario</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error general */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Campo de correo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.correo && errors.correo
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="usuario@ejemplo.com"
                                    autoComplete="email"
                                />
                                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                            {touched.correo && errors.correo && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <i className="fas fa-exclamation-triangle mr-1"></i>
                                    {errors.correo}
                                </p>
                            )}
                        </div>

                        {/* Campo de contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="contrasenia"
                                    value={formData.contrasenia}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-4 py-3 pl-10 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.contrasenia && errors.contrasenia
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {touched.contrasenia && errors.contrasenia && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <i className="fas fa-exclamation-triangle mr-1"></i>
                                    {errors.contrasenia}
                                </p>
                            )}
                        </div>

                        {/* Recordar sesión */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordar sesión</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={submitLoading || loading || !isValid}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {(submitLoading || loading) ? (
                                <span className="flex items-center justify-center">
                                    <ButtonSpinner />
                                    <span className="ml-2">Iniciando sesión...</span>
                                </span>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Sistema desarrollado para gestión de inventario
                        </p>
                        <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
                            <span>v1.0.0</span>
                            <span>•</span>
                            <button className="hover:text-gray-700">Soporte</button>
                            <span>•</span>
                            <button className="hover:text-gray-700">Ayuda</button>
                        </div>
                    </div>
                </div>

                {/* Información de usuarios demo */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Usuarios de prueba
                    </h3>
                    <div className="text-xs text-blue-800 space-y-1">
                        <div><strong>Admin:</strong> admin@abarrotes.com / admin123</div>
                        <div><strong>Empleado:</strong> juan.perez@abarrotes.com / admin123</div>
                        <div><strong>Cliente:</strong> carlos.mendoza@gmail.com / admin123</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exportar componente
window.Login = Login;