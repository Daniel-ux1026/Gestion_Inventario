import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiShoppingBag,
  FiShield,
  FiPhone,
  FiUpload,
  FiMapPin,
} from "react-icons/fi";
import { api, money, imageUrl } from "./api";
import { useStore } from "./StoreContext";
import { ErrorBox, Empty, PageHeading } from "./UI";

export default function Checkout() {
  const { user, cart, cartItems, totalCents, clearCart, refresh, business } =
    useStore();
  const [method, setMethod] = useState("EFECTIVO"),
    [file, setFile] = useState(null),
    [preview, setPreview] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [order, setOrder] = useState(null);
  const key = useRef(crypto.randomUUID()),
    fingerprint =
      cartItems.map((i) => i.id + ":" + i.qty).join("|") + "|" + method;
  useEffect(() => {
    key.current = crypto.randomUUID();
  }, [fingerprint]);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (
      cartItems.length !== cart.length ||
      cartItems.some((i) => i.qty > i.product.stock)
    ) {
      setError(
        "Hay productos sin stock suficiente. Actualiza tu bolsa antes de continuar.",
      );
      setBusy(false);
      return;
    }
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const data = {
      nombre: fields.nombre,
      telefono: fields.telefono,
      direccion: "Recojo en tienda" + (fields.nota ? " · " + fields.nota : ""),
      metodoPago: method,
      items: cartItems.map((i) => ({ productoId: i.id, cantidad: i.qty })),
      clave: key.current,
      totalEsperado: totalCents / 100,
    };
    const body = new FormData();
    body.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
    if (file) body.append("receipt", file);
    try {
      const result = await api("/orders", { method: "POST", body });
      setOrder(result);
      clearCart();
      refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (order)
    return (
      <div className="store-container checkout-success">
        <span className="success-orbit">
          <FiCheck />
        </span>
        <span className="eyebrow">GRACIAS POR ELEGIR EL LIRIO</span>
        <h1>
          Tu pedido ya está
          <br />
          <em>en buenas manos.</em>
        </h1>
        <p>
          Registramos tu pedido <strong>{order.numero}</strong> por{" "}
          <strong>{money(order.total)}</strong>.<br />
          La tienda revisará el pago y coordinará contigo el recojo.
        </p>
        <div className="success-details">
          <span>
            Estado<strong>Pendiente de validación</strong>
          </span>
          <span>
            Forma de pago<strong>{order.metodoPago}</strong>
          </span>
        </div>
        <Link className="btn primary" to="/pedidos">
          Ver mis pedidos <FiArrowRight />
        </Link>
        <Link className="text-link" to="/tienda">
          Seguir explorando
        </Link>
      </div>
    );
  if (!cartItems.length)
    return (
      <div className="store-container">
        <Empty
          title="Primero, algo para tu bolsa"
          text="Añade tus productos favoritos para registrar un pedido."
          action={
            <Link className="btn primary" to="/tienda">
              Explorar productos
            </Link>
          }
        />
      </div>
    );
  return (
    <div className="store-container checkout-page">
      <Link className="text-link" to="/tienda">
        <FiArrowLeft /> Seguir comprando
      </Link>
      <PageHeading
        eyebrow="EL ÚLTIMO PASO"
        title="Hagámoslo tuyo."
        text="Revisa tu compra y cuéntanos cómo prefieres pagar."
      />
      <form className="checkout-grid" onSubmit={submit}>
        <div className="checkout-fields">
          <section className="glass form-panel">
            <h2>
              <span className="step-number">01</span> Tus datos
            </h2>
            <div className="form-grid">
              <label>
                Nombre y apellido
                <input
                  name="nombre"
                  required
                  maxLength="200"
                  autoComplete="name"
                  defaultValue={user.nombre + " " + user.apellido}
                />
              </label>
              <label>
                Teléfono de contacto
                <input
                  type="tel"
                  name="telefono"
                  required
                  autoComplete="tel"
                  pattern="[0-9+ ()-]{7,20}"
                  maxLength="20"
                  defaultValue={user.telefono || ""}
                />
              </label>
            </div>
            <label>
              Nota para la tienda <span className="muted">(opcional)</span>
              <textarea
                name="nota"
                maxLength="270"
                placeholder="Algo que debamos saber sobre tu pedido"
                rows="2"
              />
            </label>
            <div className="delivery-info">
              <FiMapPin />
              <div>
                <strong>Recojo en tienda</strong>
                <p>
                  {business.direccion ||
                    "La tienda confirmará contigo el punto y horario de recojo."}
                </p>
                <span>
                  Para otra modalidad, coordina antes de realizar el pago.
                </span>
              </div>
            </div>
          </section>
          <section className="glass form-panel">
            <h2>
              <span className="step-number">02</span> Tu forma de pago
            </h2>
            <div className="payment-options">
              {["EFECTIVO", "YAPE", "PLIN", "TRANSFERENCIA"].map((m) => (
                <label key={m} className={method === m ? "selected" : ""}>
                  <input
                    type="radio"
                    name="metodo"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  <span>
                    {m === "EFECTIVO"
                      ? "Efectivo"
                      : m === "TRANSFERENCIA"
                        ? "Transferencia"
                        : m[0] + m.slice(1).toLowerCase()}
                  </span>
                  {method === m && <FiCheck />}
                </label>
              ))}
            </div>
            {method === "EFECTIVO" ? (
              <div className="notice">
                <strong>Paga al recoger tu pedido.</strong>
                <p>
                  El administrador confirmará la recepción del efectivo. No
                  necesitas subir un comprobante.
                </p>
              </div>
            ) : (
              <>
                <div className="notice">
                  <strong>Confirma los datos de pago con la tienda.</strong>
                  <p>
                    Antes de transferir, llama al{" "}
                    <a href="tel:+51948656772">948656772</a> para verificar el
                    número o la cuenta y el titular. Luego adjunta el
                    comprobante para su validación.
                  </p>
                </div>
                <label className="upload-label">
                  <FiUpload />
                  <strong>{file ? file.name : "Adjunta tu comprobante"}</strong>
                  <span>Imagen PNG o JPEG · hasta 3 MB</span>
                  <input
                    required
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (
                        f &&
                        (!["image/png", "image/jpeg"].includes(f.type) ||
                          f.size > 3 * 1024 * 1024)
                      ) {
                        setError("Elige una imagen PNG o JPEG de hasta 3 MB");
                        e.target.value = "";
                        setFile(null);
                      } else {
                        setFile(f || null);
                        setError("");
                      }
                    }}
                  />
                </label>
                {preview && (
                  <img
                    className="receipt-preview"
                    src={preview}
                    alt="Vista previa del comprobante seleccionado"
                  />
                )}
              </>
            )}
          </section>
        </div>
        <aside className="glass checkout-summary">
          <h2>
            <FiShoppingBag /> Tu compra
          </h2>
          <div className="checkout-items">
            {cartItems.map(({ product: p, qty }) => (
              <div key={p.id}>
                <img src={imageUrl(p.imagen)} alt="" />
                <span>
                  <strong>{p.nombre}</strong>
                  <small>
                    {qty} × {money(p.precio)}
                  </small>
                </span>
                <b>{money((Math.round(p.precio * 100) * qty) / 100)}</b>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Productos</span>
            <span>{money(totalCents / 100)}</span>
          </div>
          <div className="summary-row">
            <span>Recojo en tienda</span>
            <span>Sin cargo</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>{money(totalCents / 100)}</strong>
          </div>
          {error && <ErrorBox message={error} />}
          <button className="btn primary full" disabled={busy}>
            {busy ? "Registrando pedido…" : "Confirmar mi pedido"}{" "}
            <FiArrowRight />
          </button>
          <p className="secure-note">
            <FiShield /> Tu pago digital se valida manualmente. Nunca compartas
            contraseñas ni códigos.
          </p>
          <a className="text-link" href="tel:+51948656772">
            <FiPhone /> ¿Necesitas ayuda?
          </a>
        </aside>
      </form>
    </div>
  );
}
