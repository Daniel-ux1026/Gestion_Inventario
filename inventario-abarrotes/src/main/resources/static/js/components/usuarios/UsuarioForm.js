// js/components/usuarios/UsuarioForm.js
// Formulario completo para crear/editar usuarios

const UsuarioForm = ({ usuario, onClose, onSave }) => {
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [roles] = React.useState([
        { idRol: 1, nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
        { idRol: 2, nombre: 'EMPLEADO', descripcion: 'Empleado con acceso a ventas' },
        { idRol: 3, nombre: 'CLIENTE', descripcion: 'Cliente del establecimiento' }
    ]);

    // Usar hook de validación
    const {
        data: formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        validateField
    } = useFormValidation(
        {
            nombre: '',
            apellido: '',
            dni: '',
            telefono: '',
            correo: '',
            contrasenia: '',
            rol: { idRol: '' }
        },
        usuario ? validationSchemas.usuarioEditar : validationSchemas.usuario
    );

    React.useEffect(() => {
        if (usuario) {
            // Cargar datos del usuario a editar
            Object.keys(formData).forEach(key => {
                if (key === 'rol') {
                    handleChange(key, { idRol: usuario.rol?.idRol || '' });
                } else if (key === 'contrasenia') {
                    // No cargar la contraseña actual
                    handleChange(key, '');
                } else {
                    handleChange(key, usuario[key] || '');
                }
            });
        }
    }, [usuario]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, corrige los errores en el formulario', 'warning');
            return;
        }

        setLoading(true);

        try {
            const dataToSend = { ...formData };

            // Si es edición y no hay contraseña, no enviarla
            if (usuario && !dataToSend.contrasenia) {
                delete dataToSend.contrasenia;
            }

            let result;
            if (usuario) {
                result = await usuarioService.update(usuario.idUsuario, dataToSend);
            } else {
                result = await usuarioService.create(dataToSend);
            }

            if (result.success) {
                showNotification(
                    `Usuario ${usuario ? 'actualizado' : 'creado'} correctamente`,
                    'success'
                );
                onSave();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al guardar el usuario', 'error');
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Validación en tiempo real para DNI y correo
    const handleDniChange = async (e) => {
        const { name, value } = e.target;
        handleInputChange(e);

        // Validar DNI único solo si tiene 8 dígitos
        if (value.length === 8 && (!usuario || usuario.dni !== value)) {
            try {
                const result = await usuarioService.existeDni(value);
                if (result.success && result.exists) {
                    // Agregar error personalizado
                    validateField(name, value);
                }
            } catch (error) {
                console.error('Error validando DNI:', error);
            }
        }
    };

    const handleCorreoChange = async (e) => {
        const { name, value } = e.target;
        handleInputChange(e);

        // Validar correo único
        if (value && validators.email(value).valid && (!usuario || usuario.correo !== value)) {
            try {
                const result = await usuarioService.existeCorreo(value);
                if (result.success && result.exists) {
                    // El correo ya existe
                    validateField(name, value);
                }
            } catch (error) {
                console.error('Error validando correo:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            <i className="fas fa-user mr-2 text-blue-600"></i>
                            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    {usuario && (
                        <p className="text-sm text-gray-600 mt-1">
                            Editando: {usuario.nombre} {usuario.apellido} ({usuario.correo})
                        </p>
                    )}
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Personal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            <i className="fas fa-user-circle mr-2 text-blue-600"></i>
                            Información Personal
                        </h3>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
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
                                    placeholder="Juan"
                                    maxLength="30"
                                />
                                {touched.nombre && errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-1"></i>
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.apellido && errors.apellido
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Pérez"
                                    maxLength="50"
                                />
                                {touched.apellido && errors.apellido && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-1"></i>
                                        {errors.apellido}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DNI y Teléfono */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    DNI *
                                </label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleDniChange}
                                    onBlur={handleInputBlur}
                                    maxLength="8"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.dni && errors.dni
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="12345678"
                                />
                                {touched.dni && errors.dni && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-1"></i>
                                        {errors.dni}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Documento de identidad (8 dígitos)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    maxLength="9"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.telefono && errors.telefono
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="987654321"
                                />
                                {touched.telefono && errors.telefono && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <i className="fas fa-exclamation-triangle mr-1"></i>
                                        {errors.telefono}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Número celular (9 dígitos)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información de Cuenta */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            <i className="fas fa-key mr-2 text-green-600"></i>
                            Información de Cuenta
                        </h3>

                        {/* Correo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico *
                            </label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleCorreoChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.correo && errors.correo
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            {touched.correo && errors.correo && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <i className="fas fa-exclamation-triangle mr-1"></i>
                                    {errors.correo}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                            </label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="contrasenia"
                                    value={formData.contrasenia}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        touched.contrasenia && errors.contrasenia
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
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
                            {usuario ? (
                                <p className="mt-1 text-sm text-gray-500">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Deja en blanco para mantener la contraseña actual
                                </p>
                            ) : (
                                <p className="mt-1 text-sm text-gray-500">
                                    Mínimo 6 caracteres
                                </p>
                            )}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rol del Usuario *
                            </label>
                            <select
                                name="rol.idRol"
                                value={formData.rol.idRol}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar rol</option>
                                {roles.map(rol => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.nombre} - {rol.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Información del rol seleccionado */}
                        {formData.rol.idRol && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    <i className="fas fa-shield-alt mr-2"></i>
                                    Permisos del Rol {roles.find(r => r.idRol == formData.rol.idRol)?.nombre}
                                </h4>
                                <div className="text-sm text-blue-800">
                                    {formData.rol.idRol == 1 && (
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Acceso completo al sistema</li>
                                            <li>Gestión de usuarios y roles</li>
                                            <li>Gestión de productos e inventario</li>
                                            <li>Procesamiento y gestión de ventas</li>
                                            <li>Acceso a todos los reportes</li>
                                            <li>Configuración del sistema</li>
                                        </ul>
                                    )}
                                    {formData.rol.idRol == 2 && (
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Gestión de productos e inventario</li>
                                            <li>Procesamiento de ventas</li>
                                            <li>Acceso a reportes de ventas</li>
                                            <li>Dashboard operativo</li>
                                            <li>Sin acceso a gestión de usuarios</li>
                                        </ul>
                                    )}
                                    {formData.rol.idRol == 3 && (
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Acceso limitado al dashboard</li>
                                            <li>Visualización de sus compras</li>
                                            <li>Actualización de perfil personal</li>
                                            <li>Sin acceso a funciones administrativas</li>
                                        </ul>
                                    )}
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
                            <i className="fas fa-times mr-2"></i>
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
                                    <i className={`fas ${usuario ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                                    {usuario ? 'Actualizar' : 'Crear'} Usuario
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
window.UsuarioForm = UsuarioForm;