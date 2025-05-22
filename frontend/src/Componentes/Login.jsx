import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8080/backend_war/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams({username: usuario, password}),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("rol", data.rol);

                if (data.rol === "ADMIN") {
                    navigate("/dashboard-admin");
                } else if (data.rol === "CLIENTE") {
                    navigate("/dashboard-cliente");
                } else {
                    setError("Rol de usuario no reconocido.");
                }
            } else {
                setError(data.message || "Usuario o contraseña incorrectos");
            }
        } catch (err) {
            setError("Error al conectar con el servidor. Intente más tarde.");
        }
    };

    return (<div
        className="container mt-5"
        style={{
            maxWidth: "400px",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#a1a1b0",
        }}
    >
        {/* Icono grande de usuario */}
        <div className="text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor"
                 className="bi bi-person-circle" viewBox="0 0 16 16">

                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
        </div>

        <form onSubmit={handleLogin}>
            <div className="mb-3 input-group">
          <span className="input-group-text">
            <i className="bi bi-person-fill"></i>
          </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4 input-group">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 btn-lg"
                    style={{backgroundColor: "#5D3FD3", borderColor: "#5D3FD3"}}>
                Entrar
            </button>
        </form>
    </div>);
}
