import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Si no hay token, redirigir a login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si allowedRoles está definido y el rol no está permitido, redirigir a login
    if (allowedRoles && !allowedRoles.includes(rol)) {
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, renderiza el contenido protegido
    return children;
}
