import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Recuperar = () => {
  const [correo, setCorreo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enlace, setEnlace] = useState(""); // Nuevo

  const handleRecuperar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Si el backend retorna el token en el response:
      if (data.token) {
        setEnlace(`http://localhost:5173/reset-password?token=${data.token}`);
      } else {
        setEnlace(""); // o mostrar un mensaje
      }
      setMostrarModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCorreo("");
    setEnlace("");
  };

  return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
          <h4 className="text-center mb-3">Recuperar Contraseña</h4>
          <form onSubmit={handleRecuperar}>
            <input
                type="email"
                className="form-control mb-3"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
            />
            <button type="submit" className="btn btn-dark w-100">Enviar enlace</button>
          </form>
        </div>

        <Modal show={mostrarModal} onHide={cerrarModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Recuperación enviada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Mostrar el enlace en el modal */}
            {enlace ? (
                <div>
                  <p>Enlace de recuperación generado:</p>
                  <a href={enlace} target="_blank" rel="noopener noreferrer">
                    {enlace}
                  </a>
                  <p>Cópialo y pégalo en el navegador si no se abre automáticamente.</p>
                </div>
            ) : (
                <span>Enlace de recuperación enviado a: <strong>{correo}</strong></span>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={cerrarModal}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default Recuperar;
