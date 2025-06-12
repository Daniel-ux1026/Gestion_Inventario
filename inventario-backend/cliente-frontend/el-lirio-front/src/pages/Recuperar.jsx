import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Recuperar = () => {
  const [correo, setCorreo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleRecuperar = (e) => {
    e.preventDefault();
    setMostrarModal(true); // abre modal
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCorreo(""); // limpia campo si deseas
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

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recuperación enviada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enlace de recuperación enviado a: <strong>{correo}</strong>
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
