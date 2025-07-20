import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import './AdminLayout.css';

const menuItems = [
    { label: "Inicio", icon: "bi-house-door", path: "/admin/dashboard" },
    { label: "Validar Pagos", icon: "bi-cash-coin", path: "/admin/validar-pagos" },
    { label: "Ventas", icon: "bi-receipt", path: "/admin/ventas" },
    { label: "Inventario", icon: "bi-box-seam", path: "/admin/inventario" },
    { label: "Compras", icon: "bi-bag-check", path: "/admin/compras" },
    { label: "Reportes", icon: "bi-graph-up", path: "/admin/reportes" },
    { label: "Clientes", icon: "bi-people", path: "/admin/clientes" },
    { label: "Fidelización", icon: "bi-stars", path: "/admin/fidelizacion" },
    { label: "Proveedores", icon: "bi-truck", path: "/admin/proveedores" },
    { label: "Configuración", icon: "bi-gear", path: "/admin/configuracion" }
];

export default function AdminLayout() {
    const location = useLocation();
    return (
        <div className="admin-layout d-flex">
            {/* Sidebar */}
            <aside className="admin-sidebar p-3 bg-dark text-white">
                <div className="sidebar-title mb-4 text-center fw-bold">Lirio de los Valles</div>
                <ul className="sidebar-menu list-unstyled">
                    {menuItems.map(item => (
                        <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
                            <Link className="text-white d-flex align-items-center mb-2" to={item.path}>
                                <i className={`bi ${item.icon} me-2`}></i>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
            {/* Main */}
            <main className="admin-main flex-grow-1 bg-light p-3">
                <Outlet />
            </main>
        </div>
    );
}
