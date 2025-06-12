import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Ventas from './components/Ventas/Ventas.jsx';
import NuevaVenta from './components/Ventas/NuevaVenta.jsx';
import Reportes from './components/Reportes/Reportes.jsx';
import Fidelizacion from './components/Fidelizacion/Fidelizacion.jsx';
import Proveedores from './components/Proveedores/Proveedores.jsx';
import Configuracion from './components/Configuracion/Configuracion.jsx';
import Login from './components/Login/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Inventario from './components/Inventario/Inventario.jsx';
import Clientes from './components/Clientes/Clientes.jsx';
import Compras from './components/Compras/Compras.jsx';
import PrivateRoute from './components/Auth/PrivateRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/inventario" element={<PrivateRoute><Inventario /></PrivateRoute>} />
    <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
    <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
    
    {/* VENTAS */}
    <Route path="/ventas" element={<PrivateRoute><Ventas /></PrivateRoute>} />
    <Route path="/ventas/nueva" element={<PrivateRoute><NuevaVenta /></PrivateRoute>} />
    
    <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
    <Route path="/fidelizacion" element={<PrivateRoute><Fidelizacion /></PrivateRoute>} />
    <Route path="/proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} />
    <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
  </Routes>
);

export default AppRoutes;
