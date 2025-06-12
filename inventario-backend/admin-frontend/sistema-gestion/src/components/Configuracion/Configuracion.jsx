import React from 'react';
import Volver from '../Common/Volver';

const Configuracion = () => {
  return (
    <div className="container mt-4">
      <Volver />
      <h4 className="mb-4">General</h4>

      {/* Información de la Empresa */}
      <div className="mb-4">
        <h5>Información de la Empresa</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Nombre de la Empresa</label>
            <input type="text" className="form-control" value="Inversiones El Lirio de los Valles" readOnly />
          </div>
          <div className="col-md-3 mb-3">
            <label>RUC</label>
            <input type="text" className="form-control" value="20605487123" readOnly />
          </div>
          <div className="col-md-3 mb-3">
            <label>Teléfono</label>
            <input type="text" className="form-control" value="+51 987 654 321" readOnly />
          </div>
          <div className="col-md-12 mb-3">
            <label>Dirección</label>
            <input type="text" className="form-control" value="Av. Las Palmeras 456" readOnly />
          </div>
          <div className="col-md-12 mb-3">
            <label>Correo Electrónico</label>
            <input type="email" className="form-control" value="contacto@liriodelosvalles.com" readOnly />
          </div>
        </div>
      </div>

      {/* Configuración del Sistema */}
      <div className="mb-4">
        <h5>Configuración del Sistema</h5>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label>Moneda</label>
            <input type="text" className="form-control" value="Sol Peruano" readOnly />
          </div>
          <div className="col-md-3 mb-3">
            <label>Zona Horaria</label>
            <input type="text" className="form-control" value="América/Latina" readOnly />
          </div>
          <div className="col-md-3 mb-3">
            <label>Idioma</label>
            <input type="text" className="form-control" value="Español" readOnly />
          </div>
          <div className="col-md-3 mb-3">
            <label>Formato de Fecha</label>
            <input type="text" className="form-control" value="AAA/MM/DD" readOnly />
          </div>
        </div>
      </div>

      {/* Opciones de Facturación */}
      <div className="mb-4">
        <h5>Opciones de facturación</h5>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" checked readOnly />
          <label className="form-check-label">Generar boletas automáticamente al completar venta</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" checked readOnly />
          <label className="form-check-label">Enviar comprobantes por correo electrónico</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" checked readOnly />
          <label className="form-check-label">Alertar cuando el stock esté por debajo del mínimo</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" checked readOnly />
          <label className="form-check-label">Realizar respaldos automáticos diarios</label>
        </div>
      </div>

      {/* Botones */}
      <div className="d-flex justify-content-end">
        <button className="btn btn-outline-secondary me-2">Cancelar</button>
        <button className="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  );
};

export default Configuracion;
