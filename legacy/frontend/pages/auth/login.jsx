import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const { token, usuario } = res.data; // <-- tu backend retorna usuario

            // Guarda token y usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            // Obtén rol de la respuesta del backend
            const rol = usuario.rol?.nombreRol || "CLIENTE";

            // Redirige según el rol
            if (rol === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Error de autenticación o problema con el servidor.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="login-box" style={{ maxWidth: 400, width: "100%", padding: 32, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
                <form onSubmit={handleLogin}>
                    <h1 className="mb-4" style={{ textAlign: "center" }}>Iniciar Sesión</h1>
                    {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="usuario@email.com"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                    <div className="d-flex justify-content-between">
                        <Link to="/recuperar" className="small">¿Olvidaste tu contraseña?</Link>
                        <Link to="/register" className="small">Crear cuenta</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
