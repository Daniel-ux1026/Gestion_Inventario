import React, { useState } from 'react';

const estadosCompra = ["Recibido", "Pendiente"];

const Compras = () => {
  const [compras, setCompras] = useState([
    {
      proveedor: 'Distribuidora Lima S.A.C.',
      producto: 'Arroz Extra Costeño',
      monto: 2180.0,
      fecha: '2025-04-12',
      estado: 'Recibido',
    },
  ]);
  const [modal, setModal] = useState({ open: false, index: null, data: null });

  // Abre el modal para agregar o editar
  const abrirModal = (index = null) => {
    if (index !== null) {
      setModal({
        open: true,
        index,
        data: { ...compras[index] }
      });
    } else {
      setModal({
        open: true,
        index: null,
        data: { proveedor: "", producto: "", monto: "", fecha: "", estado: "Pendiente" }
      });
    }
  };

  // Cerrar modal
  const cerrarModal = () => setModal({ open: false, index: null, data: null });

  // Guardar compra
  const guardarCompra = () => {
    const { proveedor, producto, monto, fecha, estado } = modal.data;
    if (!proveedor || !producto || isNaN(parseFloat(monto)) || !fecha || !estado) {
      alert("Completa todos los campos correctamente.");
      return;
    }
    const nuevaCompra = { proveedor, producto, monto: parseFloat(monto), fecha, estado };
    if (modal.index !== null) {
      const actualizadas = [...compras];
      actualizadas[modal.index] = nuevaCompra;
      setCompras(actualizadas);
    } else {
      setCompras([...compras, nuevaCompra]);
    }
    cerrarModal();
  };

  // Eliminar compra
  const eliminarCompra = (index) => {
    if (window.confirm('¿Eliminar esta compra?')) {
      setCompras(compras.filter((_, i) => i !== index));
    }
  };

  return (
      <div className="container mt-4">
        <h2 className="mb-3">Gestión de Compras</h2>
        <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>Registrar Compra</button>
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
            <tr>
              <th>Proveedor</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th style={{ width: 150 }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {compras.map((compra, index) => (
                <tr key={index}>
                  <td>{compra.proveedor}</td>
                  <td>{compra.producto}</td>
                  <td>S/. {compra.monto.toFixed(2)}</td>
                  <td>{compra.fecha}</td>
                  <td>
                    <span className={`badge bg-${compra.estado === 'Recibido' ? 'success' : 'secondary'}`}>{compra.estado}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => abrirModal(index)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarCompra(index)}>Eliminar</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Modal de agregar/editar */}
        {modal.open && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{modal.index !== null ? "Editar Compra" : "Registrar Compra"}</h5>
                    <button type="button" className="btn-close" onClick={cerrarModal}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">Proveedor</label>
                      <input type="text" className="form-control"
                             value={modal.data.proveedor}
                             onChange={e => setModal({ ...modal, data: { ...modal.data, proveedor: e.target.value } })} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Producto</label>
                      <input type="text" className="form-control"
                             value={modal.data.producto}
                             onChange={e => setModal({ ...modal, data: { ...modal.data, producto: e.target.value } })} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Monto</label>
                      <input type="number" min={0} className="form-control"
                             value={modal.data.monto}
                             onChange={e => setModal({ ...modal, data: { ...modal.data, monto: e.target.value } })} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Fecha</label>
                      <input type="date" className="form-control"
                             value={modal.data.fecha}
                             onChange={e => setModal({ ...modal, data: { ...modal.data, fecha: e.target.value } })} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Estado</label>
                      <select className="form-select"
                              value={modal.data.estado}
                              onChange={e => setModal({ ...modal, data: { ...modal.data, estado: e.target.value } })}>
                        {estadosCompra.map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                    <button className="btn btn-primary" onClick={guardarCompra}>
                      {modal.index !== null ? "Guardar Cambios" : "Registrar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

      </div>
  );
};

export default Compras;
