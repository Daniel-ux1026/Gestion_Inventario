import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiPlus,
  FiEye,
  FiCheck,
  FiX,
  FiImage,
  FiArrowLeft,
  FiShoppingBag,
  FiSearch,
} from "react-icons/fi";
import {
  api,
  date,
  money,
  imageUrl,
  exportCsv,
  receiptUrl,
  cents,
} from "./api";
import useApi from "./useApi";
import { useStore } from "./StoreContext";
import {
  PageHeading,
  Modal,
  Loading,
  ErrorBox,
  Empty,
  Status,
  Quantity,
} from "./UI";
import { Search, Pagination } from "./AdminUI";
import { OrderDetails } from "./Shop";

function ReviewOrder({ order: o, onClose, onSaved }) {
  const { notify, refresh } = useStore(),
    [confirm, setConfirm] = useState(""),
    [checked, setChecked] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState("");
  useEffect(
    () => () => {
      if (receipt) URL.revokeObjectURL(receipt);
    },
    [receipt],
  );
  async function image() {
    setError("");
    try {
      setReceipt(await receiptUrl(o.id));
    } catch (e) {
      setError(e.message);
    }
  }
  async function transition() {
    setBusy(true);
    setError("");
    try {
      await api("/admin/orders/" + o.id + "/" + confirm, { method: "POST" });
      notify(
        confirm === "approve"
          ? "Pago confirmado. Pedido aprobado."
          : "Pedido rechazado y stock devuelto.",
      );
      refresh();
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={"Pedido " + o.numero}
      onClose={onClose}
      className="wide-modal"
    >
      <OrderDetails order={o} />
      <p className="small muted">{o.email}</p>
      {o.tieneComprobante && (
        <button className="btn secondary full" onClick={image}>
          <FiImage /> Ver comprobante de pago
        </button>
      )}
      {receipt && (
        <img
          className="admin-receipt"
          alt={"Comprobante de " + o.numero}
          src={receipt}
        />
      )}
      {o.estado === "PENDIENTE_VALIDACION" &&
        (!confirm ? (
          <div className="form-actions">
            <button className="btn danger" onClick={() => setConfirm("reject")}>
              <FiX /> Rechazar pedido
            </button>
            <button
              className="btn primary"
              onClick={() => setConfirm("approve")}
            >
              <FiCheck /> Aprobar pago
            </button>
          </div>
        ) : (
          <div className="confirmation-box">
            <strong>
              {confirm === "approve"
                ? "Confirma la recepción del pago"
                : "Rechazar este pedido"}
            </strong>
            <p>
              {confirm === "approve"
                ? "Verifica el efectivo recibido o la operación en tu cuenta. Una imagen de comprobante por sí sola no confirma un abono."
                : "Las unidades reservadas volverán al inventario. Si hubo un abono, coordina su devolución con el cliente."}
            </p>
            <label className="check-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              {confirm === "approve"
                ? "He verificado la recepción del pago completo."
                : "Confirmo el rechazo y la devolución del stock."}
            </label>
            <div className="form-actions">
              <button
                className="btn secondary"
                onClick={() => {
                  setConfirm("");
                  setChecked(false);
                }}
                disabled={busy}
              >
                Volver
              </button>
              <button
                className={
                  "btn " + (confirm === "approve" ? "primary" : "danger")
                }
                onClick={transition}
                disabled={busy || !checked}
              >
                {busy
                  ? "Guardando…"
                  : "Confirmar " +
                    (confirm === "approve" ? "aprobación" : "rechazo")}
              </button>
            </div>
          </div>
        ))}
      {error && <ErrorBox message={error} />}
    </Modal>
  );
}
export default function Orders({ sales = false }) {
  const { data, loading, error, refresh } = useApi("/admin/orders"),
    [params, setParams] = useSearchParams(),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState(null);
  const q = params.get("q") || "",
    status = sales ? "APROBADO" : params.get("estado") || "";
  const deepLink = data?.find((o) => o.id === Number(params.get("id")));
  const detail = selected || deepLink;
  function filter(k, v) {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    next.delete("id");
    setParams(next, { replace: true });
    setPage(1);
  }
  function close() {
    setSelected(null);
    if (params.has("id")) filter("id", "");
  }
  const shown = (data || []).filter(
    (o) =>
      (!status || o.estado === status) &&
      (o.numero + " " + o.nombre + " " + o.email)
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(shown.length / 10)));
  return (
    <>
      <PageHeading
        eyebrow={
          sales ? "CADA COMPRA, UNA HISTORIA" : "LA TIENDA EN MOVIMIENTO"
        }
        title={sales ? "Ventas que suman." : "Pedidos, al día."}
        text={
          sales
            ? "Consulta tus operaciones aprobadas y registra ventas en mostrador."
            : "Valida los pagos y prepara la siguiente buena experiencia."
        }
      >
        <button
          className="btn secondary"
          disabled={!data}
          onClick={() =>
            exportCsv("lirio-" + (sales ? "ventas" : "pedidos"), [
              [
                "Pedido",
                "Fecha",
                "Cliente",
                "Correo",
                "Pago",
                "Estado",
                "Total PEN",
              ],
              ...shown.map((o) => [
                o.numero,
                o.fecha,
                o.nombre,
                o.email,
                o.metodoPago,
                o.estado,
                o.total,
              ]),
            ])
          }
        >
          <FiDownload /> Exportar
        </button>
        <Link className="btn primary" to="/admin/ventas/nueva">
          <FiPlus /> Nueva venta
        </Link>
      </PageHeading>
      <div className="mini-stats">
        <span>
          <b>
            {sales
              ? money(shown.reduce((sum, o) => sum + cents(o.total), 0) / 100)
              : data?.length || 0}
          </b>{" "}
          {sales ? "en ventas aprobadas" : "pedidos registrados"}
        </span>
        <span>
          <b>
            {data?.filter((o) => o.estado === "PENDIENTE_VALIDACION").length ||
              0}
          </b>{" "}
          por validar
        </span>
        <span>
          <b>{data?.filter((o) => o.estado === "APROBADO").length || 0}</b>{" "}
          aprobados
        </span>
      </div>
      <section className="glass panel table-panel">
        <div className="table-toolbar">
          <Search
            value={q}
            onChange={(v) => filter("q", v)}
            placeholder="Buscar por pedido, cliente o correo…"
          />
          {!sales && (
            <select
              aria-label="Filtrar estado del pedido"
              value={status}
              onChange={(e) => filter("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE_VALIDACION">Por validar</option>
              <option value="APROBADO">Aprobados</option>
              <option value="RECHAZADO">Rechazados</option>
            </select>
          )}
          <button className="btn secondary" onClick={refresh}>
            Actualizar
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : !shown.length ? (
          <Empty
            title={
              sales ? "Todavía no hay ventas aquí" : "Todo despejado por aquí"
            }
            text="Los registros que coincidan con tus filtros aparecerán en esta lista."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Pago</th>
                    <th>Estado</th>
                    <th className="right">Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.slice((safePage - 1) * 10, safePage * 10).map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.numero}</strong>
                        <small>
                          {o.items.reduce((s, i) => s + i.cantidad, 0)}{" "}
                          productos
                        </small>
                      </td>
                      <td>
                        <strong>{o.nombre}</strong>
                        <small>{o.email}</small>
                      </td>
                      <td className="muted">{date(o.fecha, true)}</td>
                      <td>
                        <span className="payment-tag">{o.metodoPago}</span>
                      </td>
                      <td>
                        <Status value={o.estado} />
                      </td>
                      <td className="right">
                        <strong>{money(o.total)}</strong>
                      </td>
                      <td>
                        <button
                          className="icon-btn"
                          aria-label={"Ver " + o.numero}
                          onClick={() => setSelected(o)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={safePage}
              onChange={setPage}
              total={shown.length}
            />
          </>
        )}
      </section>
      {detail && (
        <ReviewOrder
          key={detail.id}
          order={detail}
          onClose={close}
          onSaved={() => {
            close();
            refresh();
          }}
        />
      )}
    </>
  );
}
export function PointOfSale() {
  const { products, loading, error, refresh, notify } = useStore(),
    [q, setQ] = useState(""),
    [items, setItems] = useState([]),
    [method, setMethod] = useState("EFECTIVO"),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState(""),
    [confirm, setConfirm] = useState(false);
  const navigate = useNavigate(),
    key = useRef(crypto.randomUUID());
  const shown = products.filter(
    (p) => p.stock > 0 && p.nombre.toLowerCase().includes(q.toLowerCase()),
  );
  const selected = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((i) => i.product);
  const total = selected.reduce(
    (s, i) => s + cents(i.product.precio) * i.qty,
    0,
  );
  function quantity(p, qty) {
    if (qty < 1) setItems((v) => v.filter((i) => i.id !== p.id));
    else if (qty <= p.stock)
      setItems((v) =>
        v.some((i) => i.id === p.id)
          ? v.map((i) => (i.id === p.id ? { ...i, qty } : i))
          : [...v, { id: p.id, qty }],
      );
    else notify("Stock insuficiente", "error");
    key.current = crypto.randomUUID();
  }
  async function save(e) {
    e.preventDefault();
    if (!selected.length) return;
    setBusy(true);
    setFailure("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const result = await api("/admin/sales", {
        method: "POST",
        body: {
          nombre: fields.nombre,
          telefono: fields.telefono,
          direccion: "Venta en mostrador",
          metodoPago: method,
          items: selected.map((i) => ({ productoId: i.id, cantidad: i.qty })),
          clave: key.current,
          totalEsperado: total / 100,
        },
      });
      notify("Venta " + result.numero + " registrada");
      refresh();
      navigate("/admin/ventas?id=" + result.id);
    } catch (e) {
      setFailure(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link className="text-link" to="/admin/ventas">
        <FiArrowLeft /> Volver a ventas
      </Link>
      <PageHeading
        eyebrow="ATENCIÓN EN MOSTRADOR"
        title="Una venta más sencilla."
        text="Selecciona los productos y confirma el pago recibido."
      />
      <div className="pos-grid">
        <section className="glass panel">
          <Search
            value={q}
            onChange={setQ}
            placeholder="Buscar un producto para vender…"
          />
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorBox message={error} retry={refresh} />
          ) : (
            <div className="pos-products">
              {shown.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    quantity(
                      p,
                      (items.find((i) => i.id === p.id)?.qty || 0) + 1,
                    )
                  }
                >
                  <img src={imageUrl(p.imagen)} alt="" />
                  <strong>{p.nombre}</strong>
                  <span>{money(p.precio)}</span>
                  <small>{p.stock} disponibles</small>
                  <i>
                    <FiPlus />
                  </i>
                </button>
              ))}
            </div>
          )}
        </section>
        <form className="glass panel pos-summary" onSubmit={save}>
          <h2>
            <FiShoppingBag /> Venta en mostrador
          </h2>
          {selected.length ? (
            <div className="pos-items">
              {selected.map((i) => (
                <div key={i.id}>
                  <strong>{i.product.nombre}</strong>
                  <span>{money((cents(i.product.precio) * i.qty) / 100)}</span>
                  <Quantity
                    value={i.qty}
                    max={i.product.stock}
                    name={i.product.nombre}
                    onChange={(q) => quantity(i.product, q)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Añade el primer producto"
              text="Toca un producto del catálogo."
            />
          )}
          <div className="cart-total">
            <span>Total a cobrar</span>
            <strong>{money(total / 100)}</strong>
          </div>
          <label>
            Nombre del cliente
            <input
              name="nombre"
              required
              maxLength="200"
              defaultValue="Cliente de tienda"
            />
          </label>
          <label>
            Teléfono de contacto
            <input
              name="telefono"
              type="tel"
              required
              pattern="[0-9+ ()-]{7,20}"
              placeholder="9XX XXX XXX"
            />
          </label>
          <label>
            Pago recibido por
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                key.current = crypto.randomUUID();
              }}
            >
              {["EFECTIVO", "YAPE", "PLIN", "TRANSFERENCIA"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              required
            />
            He recibido y verificado el pago completo.
          </label>
          <p className="small muted">
            La operación queda registrada en tu cuenta de administrador. Los
            importes son registros operativos.
          </p>
          {failure && <ErrorBox message={failure} />}
          <button
            className="btn primary full"
            disabled={busy || !selected.length || !confirm}
          >
            {busy ? "Registrando…" : "Confirmar venta"} <FiCheck />
          </button>
        </form>
      </div>
    </>
  );
}
