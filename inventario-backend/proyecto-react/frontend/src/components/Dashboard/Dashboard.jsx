import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const originalTitle = "Sistema de Gestión - Admin";

  const [productos, setProductos] = useState([
    { code: "PRD-2458", name: "Yogurt Gloria Natural 1L", stock: 12, date: "2025-05-13", status: "Crítico" },
    { code: "PRD-2567", name: "Leche Evaporada Gloria 400g", stock: 24, date: "2025-05-22", status: "Por vencer" },
    { code: "PRD-1967", name: "Pan de molde Bimbo Blanco", stock: 8, date: "2025-05-15", status: "Crítico" }
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = originalTitle;
    const handleVisibilityChange = () => {
      document.title = document.hidden ? "Vuelve Administrator :(" : originalTitle;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, []);

  const menuItems = [
    { label: "Inicio", path: "/dashboard" },
    { label: "Ventas", path: "/ventas" },
    { label: "Inventario", path: "/inventario" },
    { label: "Compras", path: "/compras" },
    { label: "Reportes", path: "/reportes" },
    { label: "Clientes", path: "/clientes" },
    { label: "Fidelización", path: "/fidelizacion" },
    { label: "Proveedores", path: "/proveedores" },
    { label: "Configuración", path: "/configuracion" }
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  const handleDelete = (code) => {
    setProductos(prev => prev.filter(p => p.code !== code));
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    setProductos(prev =>
      prev.map(p => p.code === editingProduct.code ? editingProduct : p)
    );
    setEditingProduct(null);
  };

  return (
    <div className="container-fluid">
      {/* Header móvil */}
      <div className="mobile-header d-md-none d-flex justify-content-between align-items-center px-3 py-2 bg-dark text-white">
        <button className="btn btn-dark" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <span className="fw-bold">Lirio de los Valles</span>
      </div>

      <div className="row flex-nowrap min-vh-100">

        {/* Sidebar */}
        <aside className={`sidebar bg-dark text-white p-3 col-md-3 col-xl-2 ${sidebarOpen ? 'show' : 'd-none d-md-block'}`}>
          <h4 className="text-center mb-4 d-none d-md-block">Lirio de los Valles</h4>
          <ul className="nav flex-column">
            {menuItems.map((item, idx) => (
              <li className="nav-item mb-2" key={idx}>
                <Link className="nav-link text-white" to={item.path} onClick={() => setSidebarOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="col py-4 bg-light">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <h3>Bienvenido al Sistema de Gestión</h3>
            <button className="btn btn-primary" onClick={handleLogout}>Cerrar Sesión</button>
          </div>

          {/* Summary Cards */}
          <div className="row mb-4">
            {[{ title: "Ventas del día", value: "S/. 3,589.50" },
              { title: "Productos por vencer", value: "15" },
              { title: "Stock bajo", value: "8" }].map((item, idx) => (
              <div className="col-12 col-sm-6 col-md-4 mb-3" key={idx}>
                <div className="card text-center h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text fs-4">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="mb-4 d-flex flex-wrap gap-2">
            <button className="btn btn-success" onClick={() => navigate("/ventas")}>Registrar Venta</button>
            <button className="btn btn-info text-white" onClick={() => navigate("/inventario")}>Actualizar Inventario</button>
            <button className="btn btn-warning" onClick={() => navigate("/reportes")}>Ver Reportes</button>
          </div>

          {/* Tabla */}
          <div className="card">
            <div className="card-header bg-primary text-white">Productos Próximos a Vencer</div>
            <div className="card-body table-responsive p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Fecha Vencimiento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.code}</td>
                      <td>{p.name}</td>
                      <td>{p.stock}</td>
                      <td>{p.date}</td>
                      <td>
                        <span className={`badge ${p.status === 'Crítico' ? 'bg-danger' : 'bg-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-pencil-square text-primary me-2" role="button" onClick={() => handleEdit(p)}></i>
                        <i className="bi bi-trash text-danger" role="button" onClick={() => handleDelete(p.code)}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button type="button" className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Nombre</label>
                  <input className="form-control" name="name" value={editingProduct.name} onChange={handleEditChange} />
                </div>
                <div className="mb-2">
                  <label>Stock</label>
                  <input type="number" className="form-control" name="stock" value={editingProduct.stock} onChange={handleEditChange} />
                </div>
                <div className="mb-2">
                  <label>Fecha de Vencimiento</label>
                  <input type="date" className="form-control" name="date" value={editingProduct.date} onChange={handleEditChange} />
                </div>
                <div className="mb-2">
                  <label>Estado</label>
                  <select className="form-control" name="status" value={editingProduct.status} onChange={handleEditChange}>
                    <option value="Crítico">Crítico</option>
                    <option value="Por vencer">Por vencer</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleEditSave}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
