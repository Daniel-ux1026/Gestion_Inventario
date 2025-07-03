import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Ventas = () => {
  const navigate = useNavigate();

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;

  const ventas = [
    { id: 1, doc: 'F-001', cliente: 'Ana', fecha: '2025-06-01', vendedor: 'Luis', total: 'S/.100', estado: 'Completado', pago: 'Efectivo' },
    { id: 2, doc: 'F-002', cliente: 'Juan', fecha: '2025-06-02', vendedor: 'Luis', total: 'S/.200', estado: 'Completado', pago: 'Crédito' },
    { id: 3, doc: 'F-003', cliente: 'Carla', fecha: '2025-06-03', vendedor: 'Luis', total: 'S/.150', estado: 'Pendiente', pago: 'Efectivo' },
    { id: 4, doc: 'F-004', cliente: 'Mario', fecha: '2025-06-04', vendedor: 'Luis', total: 'S/.300', estado: 'Completado', pago: 'Crédito' },
    { id: 5, doc: 'F-005', cliente: 'Lucía', fecha: '2025-06-05', vendedor: 'Luis', total: 'S/.120', estado: 'Completado', pago: 'Efectivo' },
    { id: 6, doc: 'F-006', cliente: 'Diana', fecha: '2025-06-06', vendedor: 'Luis', total: 'S/.180', estado: 'Pendiente', pago: 'Crédito' }
  ];

  const filtrarPorFecha = (ventas) => {
    if (!fechaInicio && !fechaFin) return ventas;
    return ventas.filter((v) => {
      const fechaVenta = new Date(v.fecha);
      return (!fechaInicio || fechaVenta >= fechaInicio) &&
             (!fechaFin || fechaVenta <= fechaFin);
    });
  };

  const ventasFiltradas = filtrarPorFecha(ventas);
  const totalPaginas = Math.ceil(ventasFiltradas.length / porPagina);
  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  // ⚠️ Detectar ventas por vencer (entre 3 y 4 días desde su fecha)
  const ventasVencimiento = ventasFiltradas.filter((v) => {
    if (v.estado.toLowerCase() === 'completado') return false;
    const fechaVenta = new Date(v.fecha);
    const hoy = new Date();
    const dias = Math.floor((hoy - fechaVenta) / (1000 * 60 * 60 * 24));
    return dias >= 3 && dias < 5;
  });

  // 🔊 Sonido de alerta si hay ventas por vencer
  useEffect(() => {
    if (ventasVencimiento.length > 0) {
      const audio = new Audio('/alerta.mp3');
      audio.play().catch((e) => console.log("Sonido bloqueado:", e));
    }
  }, [ventasVencimiento]);

  const getEstadoVencimiento = (venta) => {
    if (!venta.fecha) {
      return <span className="text-secondary"><i className="bi bi-question-circle"></i> No encontrado</span>;
    }

    const fechaVenta = new Date(venta.fecha);
    const hoy = new Date();
    const dias = Math.floor((hoy - fechaVenta) / (1000 * 60 * 60 * 24));

    if (venta.estado.toLowerCase() === 'completado') {
      return <span className="text-success"><i className="bi bi-check-circle"></i> Completado</span>;
    } else if (dias >= 5) {
      return <span className="text-danger"><i className="bi bi-x-circle"></i> Pendiente</span>;
    } else if (dias >= 3) {
      return <span className="text-warning"><i className="bi bi-exclamation-triangle"></i> Alerta</span>;
    } else {
      return <span className="text-primary"><i className="bi bi-clock"></i> En proceso</span>;
    }
  };

  const handleEditar = (id) => {
    navigate(`/ventas/editar/${id}`);
  };

  const eliminarVenta = (id) => {
    if (confirm("¿Eliminar venta?")) {
      alert("Venta eliminada ID: " + id);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Gestión de Ventas</h4>

      {/* Botón para volver al dashboard */}
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/dashboard')}>
        ← Volver al Dashboard
      </button>

      {/* Alerta visual si hay ventas próximas a vencer */}
      {ventasVencimiento.length > 0 && (
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Tienes {ventasVencimiento.length} venta(s) próximas a vencer.
        </div>
      )}

      {/* FILTROS DE FECHA */}
      <div className="d-flex gap-3 mb-4">
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          placeholderText="Desde"
          className="form-control"
        />
        <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          placeholderText="Hasta"
          className="form-control"
        />
        <button className="btn btn-primary" onClick={() => navigate("/ventas/nueva")}>+ Nueva venta</button>
      </div>

      {/* TABLA DE VENTAS */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Doc</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vendedor</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasPaginadas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.doc}</td>
                <td>{venta.cliente}</td>
                <td>{venta.fecha}</td>
                <td>{venta.vendedor}</td>
                <td>{venta.total}</td>
                <td>{getEstadoVencimiento(venta)}</td>
                <td>
                  <span className={`badge ${venta.pago === 'Crédito' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {venta.pago}
                  </span>
                </td>
                <td>
                  <i className="bi bi-pencil-square text-primary me-2" role="button" onClick={() => handleEditar(venta.id)}></i>
                  <i className="bi bi-trash text-danger" role="button" onClick={() => eliminarVenta(venta.id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Ventas;
