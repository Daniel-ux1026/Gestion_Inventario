import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Fidelizacion = () => {
  const [campanias, setCampanias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nombreCampania, setNombreCampania] = useState('');

  // Abrir el modal para nueva campaña
  const abrirModal = () => {
    setNombreCampania('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setNombreCampania('');
  };

  // Guardar nueva campaña
  const guardarCampania = () => {
    if (!nombreCampania.trim()) {
      alert('Debes ingresar el nombre de la campaña.');
      return;
    }
    const nuevaCampania = {
      id: Date.now(),
      nombre: nombreCampania,
    };
    setCampanias([...campanias, nuevaCampania]);
    cerrarModal();
  };

  const eliminarCampania = (id) => {
    if (window.confirm('¿Deseas eliminar esta campaña?')) {
      setCampanias(campanias.filter(c => c.id !== id));
    }
  };

  return (
      <div className="container mt-4">
        <h4 className="mb-4">Fidelización</h4>

        {/* Métricas */}
        <div className="row mb-4 text-center">
          <div className="col-md-3">
            <div className="border rounded p-3">
              <div>🎉</div>
              <h6 className="text-uppercase">Clientes Totales</h6>
              <p className="fs-4">548</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded p-3">
              <div>🌟</div>
              <h6 className="text-uppercase">Clientes Premium</h6>
              <p className="fs-4">87</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded p-3">
              <div>💰</div>
              <h6 className="text-uppercase">Valor Promedio</h6>
              <p className="fs-4">S/. 125.50</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded p-3">
              <div>🔁</div>
              <h6 className="text-uppercase">Tasa de Retención</h6>
              <p className="fs-4">78%</p>
            </div>
          </div>
        </div>

        {/* Campañas Activas */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Campañas activas</span>
            <button className="btn btn-primary" onClick={abrirModal}>
              + Nueva
            </button>
          </div>
          <div className="card-body">
            {campanias.length === 0 ? (
                <p>No hay campañas activas actualmente.</p>
            ) : (
                <ul className="list-group">
                  {campanias.map((campania) => (
                      <li
                          key={campania.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {campania.nombre}
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarCampania(campania.id)}
                        >
                          Eliminar
                        </button>
                      </li>
                  ))}
                </ul>
            )}
          </div>
        </div>

        {/* Modal para agregar campaña */}
        <Modal show={showModal} onHide={cerrarModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Campaña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Nombre de la campaña</Form.Label>
                <Form.Control
                    type="text"
                    value={nombreCampania}
                    onChange={e => setNombreCampania(e.target.value)}
                    autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarCampania}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default Fidelizacion;
