import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí va tu lógica de autenticación con backend
    alert(`Intentando iniciar sesión con ${correo}`);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-end">
            <Link to="/recuperar" className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-decoration-none">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
