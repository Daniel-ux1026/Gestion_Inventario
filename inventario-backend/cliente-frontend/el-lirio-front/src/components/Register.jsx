import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Cuenta creada con ${correo}`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Crear Cuenta</h3>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-4"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success w-100">
            Crear Cuenta
          </button>
        </form>
        <p className="mt-4 text-center">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
