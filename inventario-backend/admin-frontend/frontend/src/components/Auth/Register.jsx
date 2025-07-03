// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService.js';
import './Register.css'; // CSS dedicado para esta vista

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const userToRegister = {
                ...formData,
                telefono: "",     // <- añade estos aunque estén vacíos
                direccion: "",
                activo: true,     // puedes enviar true por defecto
                rol: { idRol: 2 } // o el id de rol que corresponda (ej: 2 para CLIENTE)
            };

            await authService.register(userToRegister);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'No se pudo completar el registro.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="register-container">
            <div className="register-box">
                <form onSubmit={handleRegister}>
                    <h1>Crear Cuenta</h1>
                    <p>Únete para empezar a gestionar tu inventario.</p>
                    {error && <div className="register-alert">{error}</div>}

                    <div className="form-row">
                        <div className="input-group">
                            <label>Nombre</label>
                            <input type="text" name="nombre" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Apellido</label>
                            <input type="text" name="apellido" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Confirmar Contraseña</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>

                    <div className="register-login-link">
                        ¿Ya tienes una cuenta? <Link to="/">Inicia Sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;