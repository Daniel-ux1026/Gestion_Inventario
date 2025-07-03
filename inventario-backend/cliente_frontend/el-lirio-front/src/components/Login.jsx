import { useState } from "react";
import { Link , useNavigate} from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
        }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data); // <-- pon esto para debuggear

      if (!response.ok || !data.usuario) {
        throw new Error(data.message || "Usuario o contraseña incorrectos");
      }

      alert("¡Bienvenido, " + data.usuario.nombre + "!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/")
      // Redirige o cierra modal, etc.
    } catch (err) {
      alert(err.message);
    }
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
