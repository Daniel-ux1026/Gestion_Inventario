import { useState } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get("token");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setMensaje("Contraseña actualizada con éxito. Ahora puedes iniciar sesión.");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setMensaje(err.message);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h4 className="text-center mb-3">Reestablecer Contraseña</h4>
                <form onSubmit={handleReset}>
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-dark w-100">Actualizar contraseña</button>
                </form>
                {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;
