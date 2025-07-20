import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClienteLayout from "./layouts/ClienteLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// COMPONENTES CLIENTE
import DetalleProducto from "./pages/cliente/DetalleProducto.jsx";
import Home from "./pages/cliente/Home.jsx";
import Checkout from "./pages/cliente/Checkout.jsx";
import Ofertas from "./pages/cliente/Ofertas.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import DetalleOferta from "./pages/cliente/DetalleOferta.jsx";
import Recuperar from "./pages/auth/Recuperar.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import MisPedidos from "./pages/cliente/MisPedidos.jsx";
// COMPONENTES ADMIN
import Dashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import ValidarPagos from "./pages/admin/ValidarPagos.jsx";
import Ventas from "./pages/admin/Ventas.jsx";
import Inventario from "./pages/admin/Inventario.jsx";
import Compras from "./pages/admin/Compras.jsx";
import Reportes from "./pages/admin/Reportes.jsx";
import Clientes from "./pages/admin/Clientes.jsx";
import Fidelizacion from "./pages/admin/Fidelizacion.jsx";
import Proveedores from "./pages/admin/Proveedores.jsx";
import Configuracion from "./pages/admin/Configuracion.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* CLIENTE */}
                <Route path="/" element={<ClienteLayout />}>
                    <Route index element={<Home />} />
                    <Route path="producto/:id" element={<DetalleProducto />} />
                    <Route path="/detalle-oferta/:id" element={<DetalleOferta />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="ofertas" element={<Ofertas />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="recuperar" element={<Recuperar />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="/mis-pedidos" element={<MisPedidos />} />
                </Route>

                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={["ADMIN"]}>
                            <AdminLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="validar-pagos" element={<ValidarPagos />} />
                    <Route path="ventas" element={<Ventas />} />
                    <Route path="inventario" element={<Inventario />} />
                    <Route path="compras" element={<Compras />} />
                    <Route path="reportes" element={<Reportes />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="fidelizacion" element={<Fidelizacion />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="configuracion" element={<Configuracion />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
