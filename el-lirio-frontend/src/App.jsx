import { BrowserRouter, Routes, Route } from "react-router-dom";

import Footer from "./pages/cliente/components/Footer.jsx";
import Navbar from "./pages/cliente/components/Navbar.jsx";
import DetalleProducto from "./pages/cliente/DetalleProducto.jsx";
import Home from "./pages/cliente/Home.jsx"
import Checkout from "./pages/cliente/Checkout.jsx";
import Ofertas from "./pages/cliente/Ofertas.jsx";
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import DetalleOferta from "./pages/cliente/DetalleOferta.jsx";
import Recuperar from "./pages/auth/Recuperar.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Dashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                {/* Navbar persistente */}
                <Navbar />

                {/* Contenido principal con expansión vertical */}
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/producto/:id" element={<DetalleProducto />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/ofertas" element={<Ofertas />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/dashboard" element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/detalle-oferta/:id" element={<DetalleOferta />} />
                        <Route path="/recuperar" element={<Recuperar />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                </main>

                {/* Footer persistente */}
                <Footer />

                {/* Botón flotante de WhatsApp */}
                <a
                    href="https://wa.me/51969291701?text=Hola%2C%20deseo%20más%20información%20sobre%20un%20producto"
                    className="position-fixed bottom-0 end-0 m-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ zIndex: 9999 }}
                >
                    <img
                        src="../src/assets/img/whatsapp.png"
                        alt="WhatsApp"
                        style={{ width: "60px", height: "60px" }}
                    />
                </a>
            </BrowserRouter>
        </div>
    );
}

export default App;