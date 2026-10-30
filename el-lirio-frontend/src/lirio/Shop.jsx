import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  FiSearch,
  FiShoppingBag,
  FiArrowRight,
  FiArrowUpRight,
  FiPhone,
  FiUser,
  FiCheck,
  FiHeart,
  FiShield,
  FiPackage,
  FiMessageCircle,
  FiGrid,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import {
  Flower,
  Logo,
  ThemeToggle,
  Modal,
  Quantity,
  Empty,
  ErrorBox,
  Loading,
  ProductCard,
  SectionTitle,
  PageHeading,
  Status,
} from "./UI";
import { useStore } from "./StoreContext";
import { useTheme } from "./theme";
import HomeCategories from "./HomeCategories";
import { api, CHAT_URL, money, imageUrl, date } from "./api";

export function ShopLayout() {
  const { theme } = useTheme();
  const { user, business, cartCount, cartOpen, setCartOpen, demo, logout } =
    useStore();
  const navigate = useNavigate(),
    [search, setSearch] = useState(""),
    [chat, setChat] = useState(false),
    [menu, setMenu] = useState(false);
  return (
    <div className="shop-shell">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="store-header">
        <Logo />
        <nav aria-label="Navegación principal" className="store-nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/tienda">La tienda</NavLink>
          <NavLink to="/ofertas">
            Ofertas <span className="nav-dot" />
          </NavLink>
        </nav>
        <div className="store-header-actions">
          <form
            className="search-input header-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/tienda?q=" + encodeURIComponent(search));
            }}
          >
            <FiSearch />
            <input
              aria-label="Buscar en la tienda"
              placeholder="¿Qué estás buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <ThemeToggle />
          <div className="user-menu">
            <button
              className="icon-btn"
              aria-label="Mi cuenta"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <FiUser />
            </button>
            {menu && (
              <div className="dropdown">
                <Link
                  onClick={() => setMenu(false)}
                  to={user ? "/cuenta" : "/login"}
                >
                  {user ? "Hola, " + user.nombre : "Iniciar sesión"}
                </Link>
                <Link onClick={() => setMenu(false)} to="/pedidos">
                  Mis pedidos
                </Link>
                {user?.rol === "ADMIN" && (
                  <Link onClick={() => setMenu(false)} to="/admin">
                    Administración
                  </Link>
                )}
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setMenu(false);
                    }}
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={"Abrir bolsa con " + cartCount + " productos"}
          >
            <FiShoppingBag />
            <span className="bag-text">Mi bolsa</span>
            <b>{cartCount}</b>
          </button>
        </div>
      </header>
      {demo && (
        <div className="demo-label">
          <span /> Entorno de demostración · productos, precios y pedidos de
          ejemplo
        </div>
      )}
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="store-footer">
        <div>
          <Logo />
          <p>
            Lo de siempre, con una mejor experiencia.
            <br />
            Abarrotes para tu mesa y tu hogar.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORA</span>
          <Link to="/tienda">Todos los productos</Link>
          <Link to="/ofertas">Ofertas de la tienda</Link>
          <Link to="/pedidos">Mis pedidos</Link>
        </div>
        <div>
          <span className="eyebrow">ESTAMOS CERCA</span>
          <a href={"tel:+51" + business.telefono.replace(/\D/g, "")}>
            <FiPhone /> {business.telefono}
          </a>
          <button className="footer-chat" onClick={() => setChat(true)}>
            Hablar con el asistente <FiArrowUpRight />
          </button>
          {business.direccion && <span>{business.direccion}</span>}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.nombre}
          </span>
          <Link to="/admin">
            Acceso de administración <FiArrowUpRight />
          </Link>
          <span>
            Hecho para lo cotidiano <Flower />
          </span>
        </div>
      </footer>
      <button
        className="chat-fab"
        onClick={() => setChat(true)}
        aria-label="Abrir asistente de El Lirio"
      >
        <FiMessageCircle />
        <span>¿Te ayudamos?</span>
        <i />
      </button>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
      {chat && (
        <Modal
          onClose={() => setChat(false)}
          title="Tu asistente Lirio"
          className="chat-modal"
        >
          <p className="muted">
            Preguntas rápidas, productos y contacto con la tienda.
          </p>
          <iframe
            title="Asistente de El Lirio en Streamlit"
            src={CHAT_URL + "/?embed=true&embed_options=" + theme + "_theme&lirio_theme=" + theme}
          />
          <p className="small muted">
            Si el asistente no carga,{" "}
            <a href={CHAT_URL} target="_blank" rel="noreferrer">
              ábrelo en otra pestaña
            </a>{" "}
            o llama al <a href="tel:+51948656772">948656772</a>.
          </p>
        </Modal>
      )}
    </div>
  );
}
export function Cart({ open, onClose }) {
  const { cartItems, totalCents, setQuantity, cart, clearCart } = useStore();
  const missing = cart.length - cartItems.length;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tu bolsa"
      className="cart-drawer"
    >
      <p className="muted">Un poco de todo lo que necesitas.</p>
      {missing > 0 && (
        <div className="notice">
          Algunos productos ya no están disponibles.{" "}
          <button onClick={clearCart}>Vaciar bolsa</button>
        </div>
      )}
      {!cartItems.length ? (
        <Empty
          title="Tu bolsa espera algo rico"
          text="Explora la tienda y añade tus favoritos."
          action={
            <Link className="btn primary" onClick={onClose} to="/tienda">
              Explorar la tienda <FiArrowRight />
            </Link>
          }
        />
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map(({ product: p, qty }) => (
              <div key={p.id} className="cart-item">
                <img src={imageUrl(p.imagen)} alt="" width="72" height="80" />
                <div className="cart-item-info">
                  <strong>{p.nombre}</strong>
                  <span>{money(p.precio)} / unidad</span>
                  <Quantity
                    value={qty}
                    max={p.stock}
                    name={p.nombre}
                    onChange={(v) => setQuantity(p.id, v)}
                  />
                  {qty > p.stock && (
                    <span className="field-error">
                      Actualiza la cantidad. Stock: {p.stock}
                    </span>
                  )}
                </div>
                <div>
                  <strong>
                    {money((Math.round(p.precio * 100) * qty) / 100)}
                  </strong>
                  <button
                    className="remove-item"
                    aria-label={"Eliminar " + p.nombre}
                    onClick={() => setQuantity(p.id, 0)}
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total de productos</span>
            <strong>{money(totalCents / 100)}</strong>
          </div>
          <p className="small muted">
            Recojo en tienda. Coordina cualquier otra modalidad antes de pagar.
          </p>
          <Link className="btn primary full" to="/checkout" onClick={onClose}>
            Continuar con mi pedido <FiArrowRight />
          </Link>
          <button className="text-button full" onClick={onClose}>
            Seguir comprando
          </button>
        </>
      )}
    </Modal>
  );
}
export function Home() {
  const { products, loading, error, refresh } = useStore();
  const hero = products.slice(0, 4);
  return (
    <div className="store-container">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-tag">
            <span /> TU TIENDA DE TODOS LOS DÍAS
          </span>
          <h1>
            Lo bueno de
            <br />
            sentirse <em>en casa.</em>
          </h1>
          <p>
            Llena tu despensa de favoritos.
            <br />
            Nosotros ponemos el cuidado en cada detalle.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/tienda">
              Hacer mi compra <FiArrowUpRight />
            </Link>
            <Link className="text-link" to="/ofertas">
              Descubrir ofertas <FiArrowRight />
            </Link>
          </div>
          <div className="hero-note">
            <span>
              <FiCheck />
            </span>{" "}
            Una compra sencilla. Así de fácil.
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="hero-pedestal" />
          <div className="hero-flower">
            <Flower />
          </div>
          {hero.map((p, i) => (
            <div className={"hero-product hero-product-" + i} key={p.id}>
              <img src={imageUrl(p.imagen)} alt="" width="190" height="230" />
            </div>
          ))}
          <div className="floating-label label-top">
            <span>
              <FiHeart />
            </span>
            <div>
              Los favoritos
              <br />
              <strong>de tu hogar.</strong>
            </div>
          </div>
          <div className="floating-label label-bottom">
            <span>
              <FiShoppingBag />
            </span>
            <div>
              Tu despensa,
              <br />
              <strong>a un clic de distancia.</strong>
            </div>
          </div>
          <span className="art-caption">SELECCIONADO CON CARIÑO</span>
        </div>
      </section>
      <div className="trust-bar">
        <div>
          <FiPackage />
          <span>
            Todo para tu despensa<small>Marcas que ya conoces</small>
          </span>
        </div>
        <div>
          <FiShield />
          <span>
            Tú eliges cómo pagar
            <small>Efectivo, Yape, Plin o transferencia</small>
          </span>
        </div>
        <div>
          <FiPhone />
          <span>
            Atención cercana<small>Una persona cuando la necesitas</small>
          </span>
        </div>
      </div>
      <HomeCategories />
      <section>
        <SectionTitle
          eyebrow="SIEMPRE UNA BUENA ELECCIÓN"
          title="Favoritos de la despensa"
          link="Ver todos los productos"
          to="/tienda"
        />
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : (
          <div className="product-grid">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <section className="contact-banner">
        <div>
          <span className="eyebrow">UNA TIENDA, PERSONAS REALES</span>
          <h2>Estamos para ayudarte.</h2>
          <p>¿Una consulta sobre tu compra? Hablemos.</p>
        </div>
        <a className="btn light" href="tel:+51948656772">
          <FiPhone /> Llámanos al 948 656 772 <FiArrowUpRight />
        </a>
        <Flower />
      </section>
    </div>
  );
}
export function Catalog({ offers = false }) {
  const { products, loading, error, refresh, favorites } = useStore();
  const [params, setParams] = useSearchParams(),
    [sort, setSort] = useState("featured");
  const q = params.get("q") || "",
    category = params.get("categoria") || "Todos",
    onlyFavorites = params.get("favoritos") === "1";
  const categories = [
    "Todos",
    ...new Set(products.map((p) => p.categoria.nombre)),
  ];
  function filter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  let shown = products.filter(
    (p) =>
      (!offers || p.descuento > 0) &&
      (category === "Todos" || p.categoria.nombre === category) &&
      (!onlyFavorites || favorites.includes(p.id)) &&
      (p.nombre + " " + p.descripcion + " " + p.marca.nombre)
        .toLocaleLowerCase()
        .includes(q.toLocaleLowerCase()),
  );
  if (sort === "price-up")
    shown = [...shown].sort((a, b) => a.precio - b.precio);
  if (sort === "price-down")
    shown = [...shown].sort((a, b) => b.precio - a.precio);
  if (sort === "name")
    shown = [...shown].sort((a, b) => a.nombre.localeCompare(b.nombre));
  return (
    <div className="store-container catalog-page">
      <div className="catalog-intro">
        <span className="eyebrow">
          {offers
            ? "BUENO PARA TU DESPENSA. MEJOR PARA TU BOLSILLO."
            : "TU DESPENSA EMPIEZA AQUÍ"}
        </span>
        <h1>
          {offers ? (
            <>
              Pequeños precios.
              <br />
              <em>Grandes favoritos.</em>
            </>
          ) : (
            <>
              Todo lo que necesitas,
              <br />
              <em>en un solo lugar.</em>
            </>
          )}
        </h1>
        <p>
          {offers
            ? "Descuentos aplicados al precio final, sin sorpresas."
            : "Elige tus productos y arma una compra a tu medida."}
        </p>
        <Flower />
      </div>
      <div className="catalog-tools">
        <div className="search-input">
          <FiSearch />
          <input
            placeholder="Busca arroz, café, aceite…"
            aria-label="Buscar productos"
            value={q}
            onChange={(e) => filter("q", e.target.value)}
          />
          {q && (
            <button
              className="icon-btn"
              aria-label="Limpiar búsqueda"
              onClick={() => filter("q", "")}
            >
              <FiX />
            </button>
          )}
        </div>
        <button
          className={"btn secondary " + (onlyFavorites ? "active" : "")}
          aria-pressed={onlyFavorites}
          onClick={() => filter("favoritos", onlyFavorites ? "" : "1")}
        >
          <FiHeart /> Mis favoritos
        </button>
        <label className="sort-label">
          Ordenar{" "}
          <select
            aria-label="Ordenar productos"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Recomendados</option>
            <option value="price-up">Menor precio</option>
            <option value="price-down">Mayor precio</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </label>
      </div>
      <div className="category-tabs" aria-label="Categorías">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => filter("categoria", c === "Todos" ? "" : c)}
          >
            {c === "Todos" && <FiGrid />}
            {c}
          </button>
        ))}
      </div>
      <div className="results-line">
        <span>{shown.length} productos para ti</span>
        <span>Precios en soles (PEN)</span>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={refresh} />
      ) : shown.length ? (
        <div className="product-grid">
          {shown.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      ) : (
        <Empty
          title="No encontramos productos"
          text="Prueba otra búsqueda o cambia de categoría."
          action={
            <button className="btn secondary" onClick={() => setParams({})}>
              Restablecer filtros
            </button>
          }
        />
      )}
    </div>
  );
}
export function ProductDetail() {
  const { id } = useParams(),
    { products, add, loading, error, refresh, favorites, toggleFavorite } =
      useStore(),
    [qty, setQty] = useState(1);
  const p = products.find((p) => p.id === Number(id));
  if (loading)
    return (
      <div className="store-container">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="store-container">
        <ErrorBox message={error} retry={refresh} />
      </div>
    );
  if (!p)
    return (
      <div className="store-container">
        <Empty
          title="Producto no disponible"
          action={
            <Link className="btn primary" to="/tienda">
              Volver a la tienda
            </Link>
          }
        />
      </div>
    );
  return (
    <div className="store-container detail-page">
      <Link className="text-link" to="/tienda">
        ← Volver a la tienda
      </Link>
      <div className="product-detail">
        <div className="detail-image">
          {p.descuento > 0 && <span className="discount">−{p.descuento}%</span>}
          <img src={imageUrl(p.imagen)} alt={p.nombre} />
        </div>
        <div className="detail-info">
          <span className="eyebrow">
            {p.categoria.nombre} / {p.codigo}
          </span>
          <h1>{p.nombre}</h1>
          <p>{p.descripcion}</p>
          <div className="detail-price">
            <strong>{money(p.precio)}</strong>
            {p.descuento > 0 && <del>{money(p.precioOriginal)}</del>}
          </div>
          <span className={"stock-line " + (p.stock ? "" : "danger")}>
            <i />
            {p.stock
              ? p.stock + " unidades disponibles"
              : "Temporalmente agotado"}
          </span>
          <div className="detail-actions">
            <Quantity
              name={p.nombre}
              value={qty}
              max={p.stock}
              onChange={(q) => setQty(Math.max(1, q))}
            />
            <button
              className="btn primary"
              disabled={!p.stock}
              onClick={() => add(p, qty)}
            >
              <FiShoppingBag /> Añadir a mi bolsa
            </button>
            <button
              className={
                "icon-btn " + (favorites.includes(p.id) ? "selected" : "")
              }
              aria-label="Guardar favorito"
              aria-pressed={favorites.includes(p.id)}
              onClick={() => toggleFavorite(p.id)}
            >
              <FiHeart />
            </button>
          </div>
          <div className="detail-note">
            <FiShield />
            <span>
              El total se confirma al registrar tu pedido. Los pagos digitales
              son revisados por la tienda.
            </span>
          </div>
        </div>
      </div>
      <SectionTitle title="También para tu despensa" />
      <div className="product-grid">
        {products
          .filter((v) => v.id !== p.id && v.categoria.id === p.categoria.id)
          .slice(0, 4)
          .map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
    </div>
  );
}
export function MyOrders() {
  const [orders, setOrders] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [detail, setDetail] = useState(null);
  const load = () => {
    setLoading(true);
    setError("");
    api("/orders")
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="store-container orders-page">
      <PageHeading
        eyebrow="TU CUENTA"
        title="Mis pedidos"
        text="Cada compra, con todos sus detalles."
      >
        <button className="btn secondary" onClick={load}>
          Actualizar
        </button>
      </PageHeading>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={load} />
      ) : !orders.length ? (
        <Empty
          title="Aquí empieza tu próxima compra"
          text="Todavía no tienes pedidos registrados."
          action={
            <Link className="btn primary" to="/tienda">
              Visitar la tienda
            </Link>
          }
        />
      ) : (
        <div className="order-cards">
          {orders.map((o) => (
            <button
              className="order-card"
              key={o.id}
              onClick={() => setDetail(o)}
            >
              <div>
                <strong>{o.numero}</strong>
                <Status value={o.estado} />
              </div>
              <p>
                {date(o.fecha, true)} ·{" "}
                {o.items.reduce((n, i) => n + i.cantidad, 0)} productos
              </p>
              <div className="order-thumbs">
                {o.items.slice(0, 4).map((i) => (
                  <img
                    key={i.productoId}
                    src={imageUrl(i.imagen)}
                    alt={i.nombre}
                  />
                ))}
              </div>
              <div>
                <strong>{money(o.total)}</strong>
                <span>
                  Ver detalle <FiArrowUpRight />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      {detail && (
        <Modal
          title={"Pedido " + detail.numero}
          onClose={() => setDetail(null)}
        >
          <OrderDetails order={detail} />
        </Modal>
      )}
    </div>
  );
}
export function OrderDetails({ order: o }) {
  return (
    <>
      <div className="order-summary-head">
        <Status value={o.estado} />
        <span>{date(o.fecha, true)}</span>
      </div>
      <p>
        <strong>{o.nombre}</strong>
        <br />
        {o.direccion || "Recojo en tienda"}
        <br />
        {o.telefono}
      </p>
      <div className="order-lines">
        {o.items.map((i) => (
          <div key={i.productoId}>
            <img src={imageUrl(i.imagen)} alt="" />
            <span>
              {i.nombre}
              <small>
                {i.cantidad} × {money(i.precio)}
              </small>
            </span>
            <strong>{money(i.subtotal)}</strong>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <span>Total · {o.metodoPago}</span>
        <strong>{money(o.total)}</strong>
      </div>
      {o.estado === "PENDIENTE_VALIDACION" && (
        <div className="notice">
          Tu stock está reservado. La tienda confirmará el pago y la preparación
          de tu pedido.
        </div>
      )}
      {o.estado === "RECHAZADO" && (
        <div className="notice">
          Pedido rechazado. Si ya realizaste un pago, coordina su revisión o
          devolución llamando al 948656772.
        </div>
      )}
    </>
  );
}
export function Account() {
  const { user, signIn, notify } = useStore(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const updated = await api("/auth/me", { method: "PUT", body: data });
      signIn({ token: sessionStorage.getItem("lirio.token"), user: updated });
      notify("Tu perfil se ha actualizado");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="store-container account-page">
      <PageHeading
        eyebrow="A TU MANERA"
        title="Mi cuenta"
        text="Tus datos, siempre a mano."
      />
      <form className="glass form-panel" onSubmit={save}>
        <div className="avatar large">{user.nombre[0]}</div>
        <p className="muted">{user.email}</p>
        <div className="form-grid">
          <label>
            Nombre
            <input
              name="nombre"
              defaultValue={user.nombre}
              required
              maxLength="100"
            />
          </label>
          <label>
            Apellido
            <input
              name="apellido"
              defaultValue={user.apellido}
              required
              maxLength="100"
            />
          </label>
          <label>
            Teléfono
            <input
              name="telefono"
              defaultValue={user.telefono || ""}
              type="tel"
              pattern="[0-9+ ()-]{7,20}"
            />
          </label>
          <label>
            Dirección de referencia
            <input
              name="direccion"
              defaultValue={user.direccion || ""}
              maxLength="300"
            />
          </label>
        </div>
        {error && <ErrorBox message={error} />}
        <button className="btn primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar mis datos"} <FiCheck />
        </button>
      </form>
    </div>
  );
}
