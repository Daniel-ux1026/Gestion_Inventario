// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = usuario?.rol?.nombreRol;

    // Si no hay usuario o el rol no está permitido
    if (!usuario || !allowedRoles.includes(rol)) {
        return <Navigate to="/login" />;
    }

    // Si el rol está permitido, renderiza el hijo
    return children;
};

export default PrivateRoute;
