import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useStore } from "./lirio/StoreContext";
import {
  ShopLayout,
  Home,
  Catalog,
  ProductDetail,
  MyOrders,
  Account,
} from "./lirio/Shop";
import Auth from "./lirio/Auth";
import Checkout from "./lirio/Checkout";
import { Loading, Empty } from "./lirio/UI";
const AdminLayout = lazy(() => import("./lirio/AdminLayout"));
const Dashboard = lazy(() => import("./lirio/Dashboard"));
const Inventory = lazy(() => import("./lirio/Inventory"));
const Orders = lazy(() => import("./lirio/Orders"));
const PointOfSale = lazy(() =>
  import("./lirio/Orders").then((m) => ({ default: m.PointOfSale })),
);
const Purchases = lazy(() => import("./lirio/Purchases"));
const Suppliers = lazy(() =>
  import("./lirio/Operations").then((m) => ({ default: m.Suppliers })),
);
const Customers = lazy(() =>
  import("./lirio/Operations").then((m) => ({ default: m.Customers })),
);
const Movements = lazy(() =>
  import("./lirio/Operations").then((m) => ({ default: m.Movements })),
);
const Business = lazy(() =>
  import("./lirio/Operations").then((m) => ({ default: m.Business })),
);

function Protected({ admin = false, children }) {
  const { user, authReady } = useStore(),
    location = useLocation();
  if (!authReady) return <Loading />;
  if (!user)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  if (admin && user.rol !== "ADMIN")
    return (
      <div className="store-container">
        <Empty
          title="Este espacio es para administradores"
          text="Tu cuenta de cliente puede seguir comprando en la tienda."
          action={
            <Link className="btn primary" to="/tienda">
              Volver a la tienda
            </Link>
          }
        />
      </div>
    );
  return children;
}
function NavigationEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = pathname.startsWith("/admin")
      ? "El Lirio · Administración"
      : "El Lirio · Abarrotes & hogar";
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <NavigationEffects />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="tienda" element={<Catalog />} />
            <Route path="ofertas" element={<Catalog offers />} />
            <Route path="producto/:id" element={<ProductDetail />} />
            <Route
              path="checkout"
              element={
                <Protected>
                  <Checkout />
                </Protected>
              }
            />
            <Route
              path="pedidos"
              element={
                <Protected>
                  <MyOrders />
                </Protected>
              }
            />
            <Route
              path="cuenta"
              element={
                <Protected>
                  <Account />
                </Protected>
              }
            />
            <Route
              path="*"
              element={
                <div className="store-container">
                  <Empty
                    title="Parece que este pasillo no existe"
                    text="Volvamos a algo que sí conoces."
                    action={
                      <Link className="btn primary" to="/">
                        Volver al inicio
                      </Link>
                    }
                  />
                </div>
              }
            />
          </Route>
          <Route path="login" element={<Auth key="login" />} />
          <Route
            path="registro"
            element={<Auth key="register" mode="register" />}
          />
          <Route
            path="recuperar"
            element={<Auth key="recover" mode="recover" />}
          />
          <Route
            path="reset-password"
            element={<Auth key="reset" mode="reset" />}
          />
          <Route
            path="admin"
            element={
              <Protected admin>
                <AdminLayout />
              </Protected>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="ventas" element={<Orders sales />} />
            <Route path="ventas/nueva" element={<PointOfSale />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="compras" element={<Purchases />} />
            <Route path="proveedores" element={<Suppliers />} />
            <Route path="clientes" element={<Customers />} />
            <Route path="movimientos" element={<Movements />} />
            <Route path="reportes" element={<Dashboard reports />} />
            <Route path="configuracion" element={<Business />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
