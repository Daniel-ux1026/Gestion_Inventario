import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode"; // Importación correcta para Vite

const Register = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        rol: "CLIENTE",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Detecta si hay token y si es admin
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const user = jwt_decode.default(token); // ← ¡OJO! usa .default
                const rol = user.rol || (user.authorities && user.authorities[0].authority) || user.role;
                setIsAdmin(rol === "ADMIN");
                if (rol === "ADMIN") {
                    setFormData((prev) => ({ ...prev, rol: "CLIENTE" }));
                }
            }
        } catch (err) {
            setIsAdmin(false);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);

        try {
            let url, options;
            if (isAdmin) {
                // Admin crea usuario
                const token = localStorage.getItem("token");
                url = "http://localhost:8080/api/admin/usuarios";
                options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...formData, activo: true }),
                };
            } else {
                // Registro cliente normal
                url = "http://localhost:8080/api/usuarios/registro";
                options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        apellido: formData.apellido,
                        email: formData.email,
                        password: formData.password,
                        telefono: formData.telefono,
                        direccion: formData.direccion,
                        activo: true,
                    }),
                };
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                let errorMessage = "No se pudo crear la cuenta";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (err) {}
                throw new Error(errorMessage);
            }

            await response.json();
            alert(isAdmin ? "¡Usuario creado exitosamente!" : "¡Cuenta creada exitosamente!");

            // Redirige después del registro
            if (isAdmin) {
                navigate("/admin/usuarios");
            } else {
                navigate("/login");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="register-box card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <form onSubmit={handleRegister}>
                    <h3 className="mb-4 text-center">
                        {isAdmin ? "Crear Usuario (Admin)" : "Crear Cuenta"}
                    </h3>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <input
                        type="text"
                        className="form-control mb-3"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        autoComplete="given-name"
                    />

                    <input
                        type="text"
                        className="form-control mb-3"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        autoComplete="family-name"
                    />

                    <input
                        type="email"
                        className="form-control mb-3"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />

                    <input
                        type="tel"
                        className="form-control mb-3"
                        name="telefono"
                        placeholder="Teléfono (opcional)"
                        value={formData.telefono}
                        onChange={handleChange}
                        autoComplete="tel"
                    />

                    <input
                        type="text"
                        className="form-control mb-3"
                        name="direccion"
                        placeholder="Dirección (opcional)"
                        value={formData.direccion}
                        onChange={handleChange}
                        autoComplete="address-line1"
                    />

                    {/* Solo el admin puede elegir rol */}
                    {isAdmin && (
                        <div className="mb-3">
                            <label>Rol</label>
                            <select
                                className="form-select"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                required
                            >
                                <option value="CLIENTE">Cliente</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                    )}

                    <input
                        type="password"
                        className="form-control mb-3"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />

                    <input
                        type="password"
                        className="form-control mb-4"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />

                    <button
                        type="submit"
                        className="btn btn-success w-100"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : isAdmin ? "Crear Usuario" : "Crear Cuenta"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {isAdmin ? (
                        <Link to="/admin/usuarios">← Volver a lista de usuarios</Link>
                    ) : (
                        <>
                            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
