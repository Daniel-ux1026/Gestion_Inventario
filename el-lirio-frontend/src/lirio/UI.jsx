import { useEffect, useId, useRef } from "react";
import {
  FiArrowUpRight,
  FiX,
  FiPlus,
  FiMinus,
  FiPackage,
  FiRefreshCw,
  FiHeart,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { imageUrl, money } from "./api";
import { useStore } from "./StoreContext";

export function Flower({ className = "" }) {
  return (
    <svg
      className={"flower " + className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 20C5 19 4 7 11 6c6-1 8 8 9 14ZM20 20C21 5 33 4 34 11c1 6-8 8-14 9ZM20 20c15 1 16 13 9 14-6 1-8-8-9-14ZM20 20C19 35 7 36 6 29c-1-6 8-8 14-9Z"
        fill="currentColor"
      />
      <circle cx="20" cy="20" r="3" fill="var(--paper)" />
    </svg>
  );
}
export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="El Lirio, inicio">
      <Flower />
      <span>
        lirio<span className="brand-dot">.</span>
        <small>ABARROTES & HOGAR</small>
      </span>
    </Link>
  );
}
export function Modal({
  open = true,
  onClose,
  title,
  children,
  className = "",
}) {
  const ref = useRef(null),
    id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={"modal-glass " + className}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-body">
        <div className="modal-heading">
          <h2 id={id}>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Empty({
  title = "Todavía no hay registros",
  text = "Los datos aparecerán aquí cuando empieces.",
  action,
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <FiPackage />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Loading() {
  return (
    <div className="skeleton-grid" role="status" aria-label="Cargando">
      <span className="sr-only">Cargando…</span>
      {[1, 2, 3, 4].map((i) => (
        <div className="skeleton" key={i} />
      ))}
    </div>
  );
}
export function ErrorBox({ message, retry }) {
  return (
    <div className="error-box" role="alert">
      <p>{message}</p>
      {retry && (
        <button className="btn secondary" onClick={retry}>
          <FiRefreshCw /> Reintentar
        </button>
      )}
    </div>
  );
}
export function Status({ value }) {
  const values = {
    APROBADO: ["success", "Aprobado"],
    PENDIENTE_VALIDACION: ["warning", "Por validar"],
    RECHAZADO: ["danger", "Rechazado"],
    PENDIENTE: ["warning", "Pendiente"],
    RECIBIDA: ["success", "Recibida"],
    CANCELADA: ["neutral", "Cancelada"],
  };
  const [color, label] = values[value] || ["neutral", value];
  return (
    <span className={"status " + color}>
      <i />
      {label}
    </span>
  );
}
export function Quantity({ value, onChange, max = 10000, name = "producto" }) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={"Quitar una unidad de " + name}
        onClick={() => onChange(value - 1)}
      >
        <FiMinus />
      </button>
      <output aria-label={"Cantidad de " + name}>{value}</output>
      <button
        type="button"
        disabled={value >= max}
        aria-label={"Añadir una unidad de " + name}
        onClick={() => onChange(value + 1)}
      >
        <FiPlus />
      </button>
    </div>
  );
}
export function ProductCard({ product: p }) {
  const { add, favorites, toggleFavorite, cart } = useStore();
  const inCart = cart.find((i) => i.id === p.id)?.qty || 0;
  return (
    <article className="product-card">
      <div className="product-visual">
        {p.descuento > 0 && <span className="discount">−{p.descuento}%</span>}
        <button
          className={
            "favorite icon-btn " + (favorites.includes(p.id) ? "selected" : "")
          }
          aria-label={
            (favorites.includes(p.id) ? "Quitar de" : "Añadir a") +
            " favoritos: " +
            p.nombre
          }
          aria-pressed={favorites.includes(p.id)}
          onClick={() => toggleFavorite(p.id)}
        >
          <FiHeart />
        </button>
        <Link to={"/producto/" + p.id} tabIndex={-1} aria-hidden="true">
          <img
            src={imageUrl(p.imagen)}
            alt=""
            width="210"
            height="210"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/product-placeholder.svg";
            }}
          />
        </Link>
        {p.stock === 0 && <span className="out-of-stock">Agotado</span>}
      </div>
      <div className="product-info">
        <span className="eyebrow">{p.categoria.nombre}</span>
        <Link to={"/producto/" + p.id}>
          <h3>{p.nombre}</h3>
        </Link>
        <p>{p.descripcion}</p>
        <div className="product-bottom">
          <div>
            <strong>{money(p.precio)}</strong>
            {p.descuento > 0 && <del>{money(p.precioOriginal)}</del>}
          </div>
          <button
            className="add-btn"
            onClick={() => add(p)}
            disabled={p.stock <= inCart}
            aria-label={"Añadir " + p.nombre + " a la bolsa"}
          >
            <FiPlus />
          </button>
        </div>
      </div>
    </article>
  );
}
export function SectionTitle({ eyebrow, title, children, link, to }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children}
      </div>
      {link && (
        <Link className="text-link" to={to}>
          {link} <FiArrowUpRight />
        </Link>
      )}
    </div>
  );
}
export function PageHeading({ eyebrow, title, text, children }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
