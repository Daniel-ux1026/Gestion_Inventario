import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (usuario && password) {
      localStorage.setItem('auth', 'true');
      navigate('/dashboard');
    } else {
      alert('Por favor, complete ambos campos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="avatar" className="avatar" />

        <div className="input-group">
          <label>Usuario</label>
          <div className="input-with-icon">
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
            />
            <span role="img" aria-label="user">🧑‍💼</span>
          </div>
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <div className="input-with-icon">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
            <span role="img" aria-label="lock">🔐</span>
          </div>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;


