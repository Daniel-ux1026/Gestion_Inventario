import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiShoppingCart,
  FiUsers,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiArrowUpRight,
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiRepeat,
  FiCheckCircle,
} from "react-icons/fi";
import { Logo, Flower, ThemeToggle } from "./UI";
import { useTheme } from "./theme";
import { useStore } from "./StoreContext";
import useApi from "./useApi";

const navigation = [
  ["", "Resumen", FiGrid],
  ["inventario", "Inventario", FiPackage],
  ["ventas", "Ventas", FiBarChart2],
  ["pedidos", "Pedidos", FiShoppingBag],
  ["compras", "Compras", FiShoppingCart],
  ["proveedores", "Proveedores", FiTruck],
  ["clientes", "Clientes", FiUsers],
  ["reportes", "Reportes", FiBarChart2],
  ["movimientos", "Movimientos", FiRepeat],
];
function Notifications({ onClose }) {
  const { data, loading, error } = useApi("/admin/summary?days=7");
  return (
    <div className="notification-panel">
      <div className="notification-title">
        <strong>Lo que necesita tu atención</strong>
        <button
          className="icon-btn"
          aria-label="Cerrar alertas"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      {loading ? (
        <p>Consultando alertas…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Link
            to="/admin/pedidos?estado=PENDIENTE_VALIDACION"
            onClick={onClose}
          >
            <FiShoppingBag />
            <span>
              <strong>{data.pedidosPendientes} pedidos por validar</strong>
              <small>Revisa los pagos y confirma sus compras.</small>
            </span>
            <FiArrowUpRight />
          </Link>
          <Link to="/admin/inventario?stock=bajo" onClick={onClose}>
            <FiPackage />
            <span>
              <strong>{data.stockBajo.length} productos con stock bajo</strong>
              <small>Una buena oportunidad para reponer.</small>
            </span>
            <FiArrowUpRight />
          </Link>
        </>
      )}
    </div>
  );
}
export default function AdminLayout() {
  const { user, logout, demo } = useStore(),
    location = useLocation(),
    navigate = useNavigate();
  const [search, setSearch] = useState(""),
    [alerts, setAlerts] = useState(false),
    [menu, setMenu] = useState(false);
  const { theme } = useTheme();
  const label =
    navigation.find(
      ([path]) => path && location.pathname.startsWith("/admin/" + path),
    )?.[1] || "Resumen";
  return (
    <div className="admin-shell" data-theme={theme}>
      <a className="skip-link" href="#admin-contenido">
        Ir al contenido
      </a>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {menu && (
        <button
          className="sidebar-overlay"
          aria-label="Cerrar menú"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={"admin-sidebar " + (menu ? "open" : "")}>
        <Logo />
        <div className="workspace-badge">
          <span>
            <Flower />
          </span>
          <div>
            El Lirio de los Valles<small>Espacio de administración</small>
          </div>
          <FiCheckCircle />
        </div>
        <span className="nav-heading">TU NEGOCIO</span>
        <nav aria-label="Administración">
          {navigation.map(([path, name, Icon]) => (
            <NavLink
              key={path}
              end={path === ""}
              to={"/admin" + (path ? "/" + path : "")}
              onClick={() => setMenu(false)}
            >
              <Icon />
              <span>{name}</span>
              {name === "Resumen" && <span className="nav-live" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <Flower />
            <strong>Todo en su lugar.</strong>
            <p>
              Una vista clara para hacer
              <br />
              crecer tu negocio.
            </p>
            <Link to="/tienda">
              Ver mi tienda <FiArrowUpRight />
            </Link>
          </div>
          <NavLink className="settings-link" to="/admin/configuracion">
            <FiSettings /> Configuración
          </NavLink>
          <button
            className="sidebar-user"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Cerrar sesión"
          >
            <span className="avatar">{user.nombre[0]}</span>
            <span>
              {user.nombre}
              <small>Administrador</small>
            </span>
            <FiLogOut />
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <button
              className="icon-btn mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMenu(!menu)}
            >
              <FiMenu />
            </button>
            <span>Mi espacio</span>
            <i>/</i>
            <strong>{label}</strong>
          </div>
          <form
            className="search-input admin-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/admin/inventario?q=" + encodeURIComponent(search));
            }}
          >
            <FiSearch />
            <input
              aria-label="Buscar en inventario"
              placeholder="Buscar en tu inventario…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>↵</kbd>
          </form>
          <div className="topbar-actions">
            <ThemeToggle />
            <div className="notification-anchor">
              <button
                className="icon-btn"
                aria-label="Ver notificaciones"
                aria-expanded={alerts}
                onClick={() => setAlerts(!alerts)}
              >
                <FiBell />
                <i />
              </button>
              {alerts && <Notifications onClose={() => setAlerts(false)} />}
            </div>
            <span className="topbar-divider" />
            <Link
              className="avatar"
              to="/admin/configuracion"
              aria-label="Ver configuración"
            >
              {user.nombre[0]}
            </Link>
          </div>
        </header>
        <main id="admin-contenido" className="admin-content">
          <div className="workspace-status">
            <span>
              <i /> Tu negocio, conectado
            </span>
            {demo && (
              <span className="demo-chip">Demostración · datos de ejemplo</span>
            )}
            <span>
              {new Intl.DateTimeFormat("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "America/Lima",
              }).format(new Date())}
            </span>
          </div>
          <Outlet />
        </main>
        <footer className="admin-footer">
          <span>
            El Lirio de los Valles <span>·</span> Hecho para crecer contigo.
          </span>
          <span>
            <i /> Todos los cambios se guardan en el servidor
          </span>
        </footer>
      </div>
    </div>
  );
}
