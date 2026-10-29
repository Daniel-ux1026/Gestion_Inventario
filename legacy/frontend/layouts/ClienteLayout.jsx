import Navbar from "../pages/cliente/components/Navbar.jsx";
import Footer from "../pages/cliente/components/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function ClienteLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
                <Outlet />  {/* <--- AQUI VA! */}
            </main>
            <Footer />
            {/* Botón flotante WhatsApp */}
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
        </div>
    );
}
