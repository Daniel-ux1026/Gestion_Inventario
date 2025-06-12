import React, { useState } from 'react';
import Volver from '../Common/Volver';

const Fidelizacion = () => {
  const [campanias, setCampanias] = useState([]);

  const agregarCampania = () => {
    const nombre = prompt('Nombre de la campaña:');
    if (nombre) {
      const nuevaCampania = {
        id: Date.now(),
        nombre,
      };
      setCampanias([...campanias, nuevaCampania]);
    }
  };

  const eliminarCampania = (id) => {
    if (window.confirm('¿Deseas eliminar esta campaña?')) {
      setCampanias(campanias.filter(c => c.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <Volver />
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
          <button className="btn btn-primary" onClick={agregarCampania}>
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
    </div>
  );
};

export default Fidelizacion;

