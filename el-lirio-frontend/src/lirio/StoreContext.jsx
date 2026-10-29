import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, cents } from "./api";

const Context = createContext(null);
function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState({
    nombre: "El Lirio de los Valles",
    telefono: "948656772",
  });
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    const items = readStored("lirio.cart", []);
    return Array.isArray(items)
      ? items
          .filter(
            (i) =>
              Number.isInteger(i.id) && Number.isInteger(i.qty) && i.qty > 0,
          )
          .slice(0, 100)
      : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const ids = readStored("lirio.favorites", []);
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = useCallback(
    (message, type = "success") => setToast({ message, type, id: Date.now() }),
    [],
  );
  const refresh = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [p, b, h] = await Promise.all([
        api("/catalog"),
        api("/business"),
        api("/health"),
      ]);
      setProducts(p);
      setBusiness(b);
      setDemo(h.demo);
    } catch {
      setError(
        "No pudimos conectar con la tienda. Comprueba que el servidor esté encendido e inténtalo otra vez.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    const logout = () => {
      setUser(null);
      sessionStorage.removeItem("lirio.token");
    };
    window.addEventListener("lirio:logout", logout);
    if (sessionStorage.getItem("lirio.token"))
      api("/auth/me")
        .then(setUser)
        .catch(logout)
        .finally(() => setAuthReady(true));
    else setAuthReady(true);
    return () => window.removeEventListener("lirio:logout", logout);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("lirio.cart", JSON.stringify(cart));
    } catch {
      /* Cart remains available for this session. */
    }
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("lirio.favorites", JSON.stringify(favorites));
    } catch {
      /* Favorites remain in memory. */
    }
  }, [favorites]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  const signIn = (data) => {
    sessionStorage.setItem("lirio.token", data.token);
    setUser(data.user);
  };
  const logout = () => {
    sessionStorage.removeItem("lirio.token");
    setUser(null);
    notify("Sesión cerrada");
  };
  const add = (product, quantity = 1) => {
    const current = cart.find((i) => i.id === product.id)?.qty || 0;
    if (product.stock <= current || current + quantity > product.stock) {
      notify("No hay más unidades disponibles", "error");
      return;
    }
    setCart((items) =>
      items.some((i) => i.id === product.id)
        ? items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + quantity } : i,
          )
        : [...items, { id: product.id, qty: quantity }],
    );
    notify(product.nombre + " añadido a tu bolsa");
  };
  const setQuantity = (id, qty) => {
    const product = products.find((p) => p.id === id);
    if (qty <= 0) {
      setCart((items) => items.filter((i) => i.id !== id));
      return;
    }
    if (!product || qty > product.stock) {
      notify("La cantidad supera el stock disponible", "error");
      return;
    }
    setCart((items) => items.map((i) => (i.id === id ? { ...i, qty } : i)));
  };
  const cartItems = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((i) => i.product);
  const totalCents = cartItems.reduce(
    (sum, i) => sum + cents(i.product.precio) * i.qty,
    0,
  );
  const toggleFavorite = (id) =>
    setFavorites((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  return (
    <Context.Provider
      value={{
        user,
        authReady,
        signIn,
        logout,
        products,
        business,
        setBusiness,
        demo,
        loading,
        error,
        refresh,
        cart,
        cartItems,
        totalCents,
        cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
        add,
        setQuantity,
        clearCart: () => setCart([]),
        favorites,
        toggleFavorite,
        cartOpen,
        setCartOpen,
        notify,
      }}
    >
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <div key={toast.id} className={"toast-message " + toast.type}>
            <span>{toast.type === "error" ? "!" : "✓"}</span>
            {toast.message}
            <button
              aria-label="Cerrar notificación"
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
