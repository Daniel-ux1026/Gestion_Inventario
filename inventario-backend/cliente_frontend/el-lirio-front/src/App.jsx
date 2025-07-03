import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Checkout from "./pages/Checkout";
import Ofertas from "./pages/Ofertas";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DetalleOferta from "./pages/DetalleOferta";
import Recuperar from "./pages/Recuperar";
import ResetPassword from "./pages/ResetPassword";
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
            src="/whatsapp.png"
            alt="WhatsApp"
            style={{ width: "60px", height: "60px" }}
          />
        </a>
      </BrowserRouter>
    </div>
  );
}

export default App;
