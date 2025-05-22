import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Componentes/Login";
import DashboardAdmin from "./Componentes/DashboardAdmin";

import Productos from "./Componentes/Productos";
import ProtectedRoute from "./Componentes/ProtectedRoute";
import Home from "./Componentes/Home";

function App() {  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            {/* Ruta protegida para cliente */}
            <Route path="/dashboard-cliente" element={<ProtectedRoute allowedRoles={["CLIENTE"]}><Home /></ProtectedRoute>}/>
            <Route path="/productos" element={<ProtectedRoute allowed={["ADMIN", "CLIENTE"]}><Productos /></ProtectedRoute>} />
            <Route path="/home" element={<Home />} />

            {/* Define otras rutas aquí, como la ruta raíz "/" */}
            <Route path="/" element={<Login />} /> {/* Ejemplo: redirigir a login por defecto */}
        </Routes>
    </BrowserRouter>
);

}

export default App;
