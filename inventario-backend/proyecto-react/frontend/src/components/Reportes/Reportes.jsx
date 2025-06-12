import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Reportes = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const aplicarFiltro = () => {
    setMensajeToast(`🔍 Filtro aplicado: ${fechaInicio} a ${fechaFin}`);
    setMostrarToast(true);
  };

  const generarReporte = (nombre) => {
    setMensajeToast(`📊 Generando "${nombre}" desde ${fechaInicio} hasta ${fechaFin}`);
    setMostrarToast(true);
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-outline-secondary mb-3">
        ← Volver al Dashboard
      </Link>

      <h3 className="mb-4">Reportes</h3>

      <div className="row mb-4">
        <div className="col-md-3">
          <Form.Label>Fecha Inicio:</Form.Label>
          <Form.Control
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <Form.Label>Fecha Fin:</Form.Label>
          <Form.Control
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <Button variant="primary" onClick={aplicarFiltro}>Aplicar</Button>
        </div>
      </div>

      <div className="row g-3">
        {[
          'Reporte de Ventas',
          'Estado de Inventario',
          'Análisis de Clientes',
          'Órdenes de Compra',
          'Estado Financiero',
          'Rendimiento del Personal',
          'Kardex'
        ].map((titulo, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="border rounded p-3 h-100">
              <h6>{titulo}</h6>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                {getDescripcion(titulo)}
              </p>
              <Button variant="primary" onClick={() => generarReporte(titulo)}>Generar</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast de notificación */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Sistema de Reportes</strong>
          </Toast.Header>
          <Toast.Body>{mensajeToast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

// Descripciones personalizadas para cada reporte
const getDescripcion = (titulo) => {
  switch (titulo) {
    case 'Reporte de Ventas':
      return 'Análisis detallado de ventas por periodo, categoría, vendedor y más.';
    case 'Estado de Inventario':
      return 'Análisis de stock, productos en riesgo, rotación y valorización.';
    case 'Análisis de Clientes':
      return 'Segmentación, compras recurrentes, valor promedio de ticket.';
    case 'Órdenes de Compra':
      return 'Detalles de compras, proveedores, costos y comparativos.';
    case 'Estado Financiero':
      return 'Resumen de ingresos, egresos, ganancia bruta y márgenes.';
    case 'Rendimiento del Personal':
      return 'Ventas por vendedor, eficiencia y análisis de productividad.';
    case 'Kardex':
      return 'Movimientos de entrada y salida de productos organizados por fecha y tipo.';
    default:
      return '';
  }
};

export default Reportes;
