import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const LoginModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    alert("Inicio de sesión simulado");
    onClose();
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom">
        <div className="modal-content p-4 rounded shadow">
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={onClose}
          ></button>

          <h4 className="text-center mb-3">Inicia sesión</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100">
              Iniciar sesión
            </button>
          </form>

          <p className="mt-3 text-center small">
            ¿No tienes cuenta? <span className="text-primary" role="button">Crear cuenta</span>
          </p>
        </div>
      </div>

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }

        .modal-dialog-custom {
          width: 100%;
          max-width: 400px;
          background-color: white;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
