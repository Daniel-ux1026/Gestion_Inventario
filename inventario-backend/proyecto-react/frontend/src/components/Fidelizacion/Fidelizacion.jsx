import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerClientes, guardarClientes } from '../../services/clientesService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Fidelizacion = () => {
  const [clientes, setClientes] = useState([]);
  const [campañas, setCampañas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreCampaña, setNombreCampaña] = useState('');

  const [clientesTotales, setClientesTotales] = useState(0);
  const [clientesFieles, setClientesFieles] = useState(0);
  const [ticketPromedio, setTicketPromedio] = useState(0);
  const [retencion, setRetencion] = useState(0);

  useEffect(() => {
    const lista = obtenerClientes();
    setClientes(lista);
    setCampañasExtraidas(lista);
    actualizarMétricas(lista);
  }, []);

  const setCampañasExtraidas = (clientes) => {
    const todas = clientes.flatMap(c => c.campañas || []);
    const únicas = [...new Set(todas)];
    setCampañas(únicas);
  };

  const actualizarMétricas = (clientes) => {
    const total = clientes.length;
    const fieles = clientes.filter(c => (c.campañas?.length || 0) >= 3).length;
    const promedio = 125.5; // fijo por ahora

    setClientesTotales(total);
    setClientesFieles(fieles);
    setTicketPromedio(promedio);
    setRetencion(total > 0 ? Math.round((fieles / total) * 100) : 0);
  };

  const abrirModal = () => {
    setNombreCampaña('');
    setMostrarModal(true);
  };

  const guardarCampaña = () => {
    if (!nombreCampaña.trim()) return;

    const nuevosClientes = clientes.map(c => {
      const yaTiene = (c.campañas || []).includes(nombreCampaña);
      return {
        ...c,
        campañas: yaTiene ? c.campañas : [...(c.campañas || []), nombreCampaña]
      };
    });

    guardarClientes(nuevosClientes);
    setClientes(nuevosClientes);
    setCampañasExtraidas(nuevosClientes);
    actualizarMétricas(nuevosClientes);
    setMostrarModal(false);
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Fidelización</h3>

      <div className="row text-center mb-4">
        <Indicador titulo="CLIENTES TOTALES" valor={clientesTotales} emoji="🎉" />
        <Indicador titulo="CLIENTES FIELES" valor={clientesFieles} emoji="🤝" />
        <Indicador titulo="TICKET PROMEDIO" valor={`S/. ${ticketPromedio.toFixed(2)}`} emoji="🛒" />
        <Indicador titulo="TASA DE RETENCIÓN" valor={`${retencion}%`} emoji="🔁" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Campañas activas</h5>
        <Button variant="primary" onClick={abrirModal}>+ Nueva</Button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr><th>Nombre</th></tr>
          </thead>
          <tbody>
            {campañas.length === 0 ? (
              <tr><td className="text-center">No hay campañas activas.</td></tr>
            ) : (
              campañas.map((nombre, i) => (
                <tr key={i}><td>{nombre}</td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Campaña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de la campaña</Form.Label>
              <Form.Control
                type="text"
                value={nombreCampaña}
                onChange={(e) => setNombreCampaña(e.target.value)}
                placeholder="Ej. Lealtad Oro 2025"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCampaña}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const Indicador = ({ titulo, valor, emoji }) => (
  <div className="col">
    <div className="border p-3 rounded">
      <span role="img" aria-label="icono">{emoji}</span>
      <h6 className="mt-2">{titulo}</h6>
      <h4>{valor}</h4>
    </div>
  </div>
);

export default Fidelizacion;
