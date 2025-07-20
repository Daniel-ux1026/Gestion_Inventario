import React, { useState } from 'react';

const datosIniciales = {
  empresa: "Inversiones El Lirio de los Valles",
  ruc: "20605487123",
  telefono: "+51 987 654 321",
  direccion: "Av. Las Palmeras 456",
  email: "contacto@liriodelosvalles.com",
  moneda: "Sol Peruano",
  zona: "América/Latina",
  idioma: "Español",
  fechaFormato: "AAAA/MM/DD",
  boleta: true,
  correo: true,
  stock: true,
  backup: true,
};

const Configuracion = () => {
  const [data, setData] = useState(datosIniciales);
  const [edit, setEdit] = useState(false);
  const [modal, setModal] = useState({ open: false, msg: "" });

  // Cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar cambios
  const guardar = () => {
    setEdit(false);
    setModal({ open: true, msg: "✅ Cambios guardados correctamente" });
    // Aquí llamarías a tu API para guardar (fetch/axios)
  };

  // Cancelar
  const cancelar = () => {
    setData(datosIniciales);
    setEdit(false);
    setModal({ open: true, msg: "⚠️ Cambios descartados." });
  };

  return (
      <div className="container mt-4">
        <h4 className="mb-4">Configuración General</h4>

        {/* INFORMACIÓN DE EMPRESA */}
        <div className="mb-4">
          <h5>Información de la Empresa</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Nombre de la Empresa</label>
              <input type="text" className="form-control" name="empresa"
                     value={data.empresa}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>RUC</label>
              <input type="text" className="form-control" name="ruc"
                     value={data.ruc}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>Teléfono</label>
              <input type="text" className="form-control" name="telefono"
                     value={data.telefono}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label>Dirección</label>
              <input type="text" className="form-control" name="direccion"
                     value={data.direccion}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label>Correo Electrónico</label>
              <input type="email" className="form-control" name="email"
                     value={data.email}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SISTEMA */}
        <div className="mb-4">
          <h5>Configuración del Sistema</h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label>Moneda</label>
              <input type="text" className="form-control" name="moneda"
                     value={data.moneda}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>Zona Horaria</label>
              <input type="text" className="form-control" name="zona"
                     value={data.zona}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>Idioma</label>
              <input type="text" className="form-control" name="idioma"
                     value={data.idioma}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>Formato de Fecha</label>
              <input type="text" className="form-control" name="fechaFormato"
                     value={data.fechaFormato}
                     disabled={!edit}
                     onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* OPCIONES */}
        <div className="mb-4">
          <h5>Opciones de facturación y alertas</h5>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="boleta"
                   checked={data.boleta} disabled={!edit} onChange={handleChange}
            />
            <label className="form-check-label">Generar boletas automáticamente al completar venta</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="correo"
                   checked={data.correo} disabled={!edit} onChange={handleChange}
            />
            <label className="form-check-label">Enviar comprobantes por correo electrónico</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="stock"
                   checked={data.stock} disabled={!edit} onChange={handleChange}
            />
            <label className="form-check-label">Alertar cuando el stock esté por debajo del mínimo</label>
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" name="backup"
                   checked={data.backup} disabled={!edit} onChange={handleChange}
            />
            <label className="form-check-label">Realizar respaldos automáticos diarios</label>
          </div>
        </div>

        {/* BOTONES */}
        <div className="d-flex justify-content-end">
          {!edit ? (
              <button className="btn btn-warning" onClick={() => setEdit(true)}>Editar</button>
          ) : (
              <>
                <button className="btn btn-outline-secondary me-2" onClick={cancelar}>Cancelar</button>
                <button className="btn btn-primary" onClick={guardar}>Guardar cambios</button>
              </>
          )}
        </div>

        {/* MODAL BONITO */}
        {modal.open && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.25)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body text-center py-4">
                    <div className="fs-4 mb-3">{modal.msg}</div>
                    <button className="btn btn-primary" onClick={() => setModal({ open: false, msg: "" })}>OK</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Configuracion;
