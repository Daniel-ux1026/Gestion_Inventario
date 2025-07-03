import React from 'react';
import Volver from '../Common/Volver';

const Proveedores = () => {
  return (
    <div className="container mt-4">
      <Volver />
      <h4 className="mb-4">Gestión de Proveedores</h4>

      {/* Métricas */}
      <div className="row mb-4 text-center">
        <div className="col-md-3">
          <div className="border rounded p-3">
            <div>👷‍♂️</div>
            <h5>Proveedores totales</h5>
            <p className="fs-4">100</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3">
            <div>✅</div>
            <h5>Proveedores activos</h5>
            <p className="fs-4">20</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3">
            <div>⏱️</div>
            <h5>Tiempo promedio de entrega</h5>
            <p className="fs-4">4.2 días</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3">
            <div>📦</div>
            <h5>Órdenes pendientes</h5>
            <p className="fs-4">8</p>
          </div>
        </div>
      </div>

      {/* Directorio */}
      <div className="mb-4">
        <h5>Directorio de Proveedores</h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="🔍 Buscar por cliente o # de documento"
          />
          <button className="btn btn-primary">+ Nueva proveedor</button>
        </div>
        <div className="d-flex gap-4 flex-wrap">
          {[
            {
              name: "Distribuidora Lima S.A.C.",
              contact: "Carlos Mendoza",
              phone: "+51 987 654 321",
              email: "ventas@dlima.com.pe",
            },
            {
              name: "Productos del Sur E.I.R.L.",
              contact: "María Gonzales",
              phone: "+51 923 456 789",
              email: "mgonzales@spsur.com",
            },
            {
              name: "Importaciones Mendoza S.A.",
              contact: "Roberto Mendoza",
              phone: "+51 912 345 678",
              email: "info@importmendoza.pe",
            },
          ].map((prov, i) => (
            <div className="border p-3 rounded shadow-sm" key={i} style={{ width: '300px' }}>
              <strong>{prov.name}</strong>
              <p className="mb-1">Contacto: {prov.contact}</p>
              <p className="mb-1">Teléfono: {prov.phone}</p>
              <p className="mb-1">Email: {prov.email}</p>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-outline-primary btn-sm">Ver detalle</button>
                <button className="btn btn-outline-success btn-sm">Nueva orden</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Órdenes Recientes */}
      <div>
        <h5 className="mb-3">Órdenes de Compra Recientes</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>N° Orden</th>
              <th>Proveedor</th>
              <th>Fecha de Orden</th>
              <th>Fecha de Entrega</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#OC-2025-042</td>
              <td>Distribuidora Lima S.A.C.</td>
              <td>10/04/2025</td>
              <td>15/04/2025</td>
              <td>S/. 3,450.00</td>
              <td>Pendiente</td>
              <td><i className="bi bi-pencil-square text-primary"></i></td>
            </tr>
            <tr>
              <td>#OC-2025-041</td>
              <td>Productos del Sur E.I.R.L.</td>
              <td>08/04/2025</td>
              <td>12/04/2025</td>
              <td>S/. 2,180.00</td>
              <td>Recibido</td>
              <td><i className="bi bi-pencil-square text-primary"></i></td>
            </tr>
            <tr>
              <td>#OC-2025-040</td>
              <td>Importaciones Mendoza S.A.</td>
              <td>05/04/2025</td>
              <td>10/04/2025</td>
              <td>S/. 1,250.00</td>
              <td>Parcial</td>
              <td><i className="bi bi-pencil-square text-primary"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
