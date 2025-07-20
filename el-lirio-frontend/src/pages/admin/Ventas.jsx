import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Modal simple para agregar/editar ventas
function VentaModal({ show, onClose, onSave, venta }) {
  const [form, setForm] = useState(
      venta || { doc: '', cliente: '', fecha: '', vendedor: '', total: '', estado: 'Pendiente', pago: 'Efectivo' }
  );

  useEffect(() => {
    if (venta) setForm(venta);
    else setForm({ doc: '', cliente: '', fecha: '', vendedor: '', total: '', estado: 'Pendiente', pago: 'Efectivo' });
  }, [venta, show]);

  if (!show) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDate = date => {
    setForm({ ...form, fecha: date.toISOString().split('T')[0] });
  };

  return (
      <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <div className="modal-header">
              <h5 className="modal-title">{venta ? "Editar Venta" : "Registrar Venta"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body row g-3">
              <div className="col-6">
                <label>Documento</label>
                <input className="form-control" name="doc" value={form.doc} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label>Cliente</label>
                <input className="form-control" name="cliente" value={form.cliente} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label>Fecha</label>
                <DatePicker
                    className="form-control"
                    selected={form.fecha ? new Date(form.fecha) : null}
                    onChange={date => handleDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Fecha"
                    required
                />
              </div>
              <div className="col-6">
                <label>Vendedor</label>
                <input className="form-control" name="vendedor" value={form.vendedor} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label>Total</label>
                <input className="form-control" name="total" value={form.total} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label>Pago</label>
                <select className="form-select" name="pago" value={form.pago} onChange={handleChange}>
                  <option>Efectivo</option>
                  <option>Crédito</option>
                </select>
              </div>
              <div className="col-6">
                <label>Estado</label>
                <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                  <option>Pendiente</option>
                  <option>Completado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary">{venta ? "Guardar cambios" : "Registrar"}</button>
            </div>
          </form>
        </div>
      </div>
  );
}

const Ventas = () => {
  // Demo data
  const [ventas, setVentas] = useState([
    { id: 1, doc: 'F-001', cliente: 'Ana', fecha: '2025-06-01', vendedor: 'Luis', total: 'S/.100', estado: 'Completado', pago: 'Efectivo' },
    { id: 2, doc: 'F-002', cliente: 'Juan', fecha: '2025-06-02', vendedor: 'Luis', total: 'S/.200', estado: 'Completado', pago: 'Crédito' },
    { id: 3, doc: 'F-003', cliente: 'Carla', fecha: '2025-06-03', vendedor: 'Luis', total: 'S/.150', estado: 'Pendiente', pago: 'Efectivo' },
    { id: 4, doc: 'F-004', cliente: 'Mario', fecha: '2025-06-04', vendedor: 'Luis', total: 'S/.300', estado: 'Completado', pago: 'Crédito' },
    { id: 5, doc: 'F-005', cliente: 'Lucía', fecha: '2025-06-05', vendedor: 'Luis', total: 'S/.120', estado: 'Completado', pago: 'Efectivo' },
    { id: 6, doc: 'F-006', cliente: 'Diana', fecha: '2025-06-06', vendedor: 'Luis', total: 'S/.180', estado: 'Pendiente', pago: 'Crédito' }
  ]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editarVenta, setEditarVenta] = useState(null);

  // Filtrado por fecha
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

  // Sonido de alerta si hay ventas próximas a vencer
  useEffect(() => {
    const ventasVencimiento = ventasFiltradas.filter((v) => {
      if (v.estado.toLowerCase() === 'completado') return false;
      const fechaVenta = new Date(v.fecha);
      const hoy = new Date();
      const dias = Math.floor((hoy - fechaVenta) / (1000 * 60 * 60 * 24));
      return dias >= 3 && dias < 5;
    });
    if (ventasVencimiento.length > 0) {
      // const audio = new Audio('/alerta.mp3');
      // audio.play();
      // Puedes descomentar lo de arriba si tienes alerta.mp3 en /public
    }
  }, [ventasFiltradas]);

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

  const handleEditar = (venta) => {
    setEditarVenta(venta);
    setModalOpen(true);
  };

  const eliminarVenta = (id) => {
    if (window.confirm("¿Eliminar venta?")) {
      setVentas(ventas.filter(v => v.id !== id));
    }
  };

  // Guardar nueva venta o edición
  const guardarVenta = (venta) => {
    if (venta.id) {
      // Editar
      setVentas(prev => prev.map(v => v.id === venta.id ? venta : v));
    } else {
      // Crear nueva
      setVentas(prev => [
        ...prev,
        { ...venta, id: Date.now() }
      ]);
    }
    setModalOpen(false);
    setEditarVenta(null);
  };

  return (
      <div className="container mt-4">
        {/* TARJETAS DE RESUMEN */}
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="card-title mb-1 text-secondary">Ventas totales</h6>
                <div className="fs-3 fw-bold">{ventas.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="card-title mb-1 text-secondary">Pendientes</h6>
                <div className="fs-3 text-warning fw-bold">
                  {ventas.filter(v => v.estado === 'Pendiente').length}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h6 className="card-title mb-1 text-secondary">Completadas</h6>
                <div className="fs-3 text-success fw-bold">
                  {ventas.filter(v => v.estado === 'Completado').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="row mb-3 g-2 align-items-end">
          <div className="col-sm-3">
            <label>Desde</label>
            <DatePicker
                selected={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                placeholderText="Fecha inicio"
                className="form-control"
            />
          </div>
          <div className="col-sm-3">
            <label>Hasta</label>
            <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                placeholderText="Fecha fin"
                className="form-control"
            />
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-primary px-4 shadow-sm" onClick={() => { setEditarVenta(null); setModalOpen(true); }}>
              <i className="bi bi-plus-circle me-2"></i> Nueva Venta
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
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
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditar(venta)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarVenta(venta.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
              ))}
              {ventasPaginadas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-secondary py-4">
                      No hay ventas registradas en este rango.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN */}
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

        {/* MODAL */}
        <VentaModal
            show={modalOpen}
            onClose={() => { setModalOpen(false); setEditarVenta(null); }}
            onSave={guardarVenta}
            venta={editarVenta}
        />
      </div>
  );
};

export default Ventas;
