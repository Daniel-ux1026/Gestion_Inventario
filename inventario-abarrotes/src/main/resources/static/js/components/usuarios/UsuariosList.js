// js/components/usuarios/UsuariosList.js
// Lista de usuarios

const UsuariosList = () => {
    const [usuarios, setUsuarios] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const result = await usuarioService.getAll();

            if (result.success) {
                setUsuarios(result.data);
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            showNotification('Error al cargar usuarios', 'error');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(CONSTANTS.MENSAJES.CONFIRMAR_ELIMINACION)) {
            try {
                const result = await usuarioService.delete(id);
                if (result.success) {
                    showNotification('Usuario eliminado correctamente', 'success');
                    loadUsuarios();
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Error al eliminar usuario', 'error');
            }
        }
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.dni.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="p-6">
                <SimpleHeader title="Usuarios" subtitle="Gestión de usuarios del sistema" />
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
                    title="Usuarios"
                    subtitle={`${filteredUsuarios.length} usuarios encontrados`}
                />
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nuevo Usuario
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
                                placeholder="Buscar por nombre, correo o DNI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 ml-4">
                        Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-xl card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DNI
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
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
                        {filteredUsuarios.map((usuario) => (
                            <tr key={usuario.idUsuario} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <i className="fas fa-user text-gray-600"></i>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {usuario.nombre} {usuario.apellido}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {usuario.idUsuario}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {usuario.dni}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {usuario.telefono}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {usuario.correo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            CONSTANTS_UTILS.getColorByRol(usuario.rol?.nombre)
                                        }`}>
                                            {usuario.rol?.nombre}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            CONSTANTS_UTILS.getColorByEstado(usuario.estado)
                                        }`}>
                                            {CONSTANTS_UTILS.getEstadoTexto(usuario.estado)}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(usuario)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Editar"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.idUsuario)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            title="Eliminar"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <button
                                            className="text-gray-600 hover:text-gray-900 transition-colors"
                                            title="Ver perfil"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredUsuarios.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-users text-gray-400 text-4xl mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No se encontraron usuarios
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm
                                ? 'Intenta ajustar los términos de búsqueda'
                                : 'Comienza agregando tu primer usuario'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Agregar Usuario
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de usuario */}
            {showModal && (
                <UsuarioForm
                    usuario={editingUser}
                    onClose={() => {
                        setShowModal(false);
                        setEditingUser(null);
                    }}
                    onSave={() => {
                        setShowModal(false);
                        setEditingUser(null);
                        loadUsuarios();
                    }}
                />
            )}
        </div>
    );
};

// Exportar componente
window.UsuariosList = UsuariosList;