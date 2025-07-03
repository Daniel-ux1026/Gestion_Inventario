// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService'; // Ajusta la ruta si es necesario
import './Login.css';

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
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error de autenticación o problema con el servidor.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="login-box">
          <form onSubmit={handleLogin}>
            <h1>Acceso al Sistema del Administrador</h1>
            {error && <div className="login-alert">{error}</div>}

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                  required
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            <div className="login-links">
              <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
              <Link to="/register">Crear una cuenta</Link>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;