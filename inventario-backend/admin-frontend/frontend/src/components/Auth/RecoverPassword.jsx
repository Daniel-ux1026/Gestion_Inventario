import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService.js';
import './AuthStyles.css'; // Un CSS genérico para estas vistas

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await authService.requestPasswordRecovery(email);
            setMessage('Si existe una cuenta con ese correo, recibirás un enlace para recuperar tu contraseña.');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Error al procesar la solicitud. Inténtalo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <form onSubmit={handleRequest}>
                    <h1>Recuperar Contraseña</h1>
                    <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

                    {message && <div className="auth-alert-success">{message}</div>}
                    {error && <div className="auth-alert-error">{error}</div>}

                    {!message && (
                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {!message && (
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    )}

                    <div className="auth-link">
                        <Link to="/">Volver a Inicio de Sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecoverPassword;