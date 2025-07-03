import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Inventario from './components/Inventario/Inventario.jsx';
import Ventas from './components/Ventas/Ventas.jsx';
import Compras from './components/Compras/Compras.jsx';
import Clientes from './components/Clientes/Clientes.jsx';
import Proveedores from './components/Proveedores/Proveedores.jsx';
import Reportes from './components/Reportes/Reportes.jsx';
import Configuracion from './components/Configuracion/Configuracion.jsx';
import Fidelizacion from './components/Fidelizacion/Fidelizacion.jsx';
import PrivateRoute from './components/Auth/PrivateRoute.jsx';
import RecoverPassword from "@/components/Auth/RecoverPassword.jsx";
import Register from "@/components/Auth/Register.jsx";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/fidelizacion" element={<Fidelizacion />} />
        <Route path="/configuracion" element={<Configuracion />} />
            {/* --- Rutas Públicas (Cualquiera puede acceder) --- */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* CORRECCIÓN: Se cambió el path y se quitó PrivateRoute */}
            <Route path="/recover-password" element={<RecoverPassword />} />
    </Routes>
);

export default AppRoutes;