import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiDownload,
  FiCheck,
  FiX,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import useApi from "./useApi";
import { api, money, date, cents, exportCsv } from "./api";
import { useStore } from "./StoreContext";
import { PageHeading, Modal, Loading, Empty, ErrorBox, Status } from "./UI";
import { Search, FormActions, Pagination } from "./AdminUI";

function PurchaseEditor({ supplierId, onClose, onSaved }) {
  const { data: refs, error: refError } = useApi("/admin/references"),
    { data: products, error: productError } = useApi("/admin/products"),
    { notify } = useStore();
  const [items, setItems] = useState([
      { productoId: "", cantidad: 1, costo: "" },
    ]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function change(index, key, value) {
    setItems((list) =>
      list.map((l, i) =>
        i === index
          ? {
              ...l,
              [key]: value,
              ...(key === "productoId"
                ? {
                    costo:
                      products?.find((p) => p.id === Number(value))?.costo ||
                      "",
                  }
                : {}),
            }
          : l,
      ),
    );
  }
  const total = items.reduce(
    (s, i) => s + cents(i.costo) * Number(i.cantidad),
    0,
  );
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/admin/purchases", {
        method: "POST",
        body: {
          proveedorId: Number(fields.proveedorId),
          observaciones: fields.observaciones,
          items: items.map((i) => ({
            productoId: Number(i.productoId),
            cantidad: Number(i.cantidad),
            costo: Number(i.costo),
          })),
        },
      });
      notify("Compra registrada. Recíbela para ingresar el stock.");
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Registrar una compra"
      onClose={onClose}
      className="wide-modal"
    >
      <form onSubmit={save}>
        {refError || productError ? (
          <ErrorBox message={refError || productError} />
        ) : (
          <>
            <label>
              Proveedor
              <select
                name="proveedorId"
                defaultValue={supplierId || ""}
                required
              >
                <option value="">Selecciona un proveedor</option>
                {refs?.proveedores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="purchase-lines">
              {items.map((l, i) => (
                <div key={i} className="purchase-line">
                  <label>
                    Producto
                    <select
                      value={l.productoId}
                      onChange={(e) => change(i, "productoId", e.target.value)}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {products
                        ?.filter((p) => p.activo)
                        .map((p) => (
                          <option
                            disabled={items.some(
                              (x, n) =>
                                n !== i && Number(x.productoId) === p.id,
                            )}
                            key={p.id}
                            value={p.id}
                          >
                            {p.nombre}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Unidades
                    <input
                      type="number"
                      required
                      min="1"
                      max="10000"
                      step="1"
                      value={l.cantidad}
                      onChange={(e) => change(i, "cantidad", e.target.value)}
                    />
                  </label>
                  <label>
                    Costo unitario
                    <input
                      type="number"
                      required
                      min="0.01"
                      max="99999999.99"
                      step="0.01"
                      value={l.costo}
                      onChange={(e) => change(i, "costo", e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={"Quitar línea " + (i + 1)}
                    disabled={items.length === 1}
                    onClick={() => setItems((v) => v.filter((_, n) => n !== i))}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn secondary"
              disabled={items.length >= 100}
              onClick={() =>
                setItems((v) => [
                  ...v,
                  { productoId: "", cantidad: 1, costo: "" },
                ])
              }
            >
              <FiPlus /> Añadir producto
            </button>
            <label>
              Observaciones
              <textarea name="observaciones" maxLength="500" rows="2" />
            </label>
            <div className="cart-total">
              <span>Total de la compra</span>
              <strong>{money(total / 100)}</strong>
            </div>
            <p className="notice">
              El stock solo aumenta al confirmar la recepción. Este registro no
              confirma un pago al proveedor.
            </p>
            {error && <ErrorBox message={error} />}
            <FormActions
              busy={busy}
              onCancel={onClose}
              label="Registrar compra"
            />
          </>
        )}
      </form>
    </Modal>
  );
}
export default function Purchases() {
  const { data, loading, error, refresh } = useApi("/admin/purchases"),
    { notify, refresh: refreshStore } = useStore(),
    [params, setParams] = useSearchParams();
  const [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState("");
  const shown = (data || []).filter(
    (c) =>
      (!status || c.estado === status) &&
      (c.numero + " " + c.proveedor.nombre)
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(shown.length / 10)));
  async function action(type, c) {
    setBusy(true);
    setFailure("");
    try {
      await api("/admin/purchases/" + c.id + "/" + type, { method: "POST" });
      notify(
        type === "receive"
          ? "Compra recibida. Stock actualizado."
          : "Compra cancelada",
      );
      setModal(null);
      refresh();
      refreshStore();
    } catch (e) {
      setFailure(e.message);
    } finally {
      setBusy(false);
    }
  }
  function close() {
    setModal(null);
    if (params.has("proveedor")) setParams({}, { replace: true });
  }
  return (
    <>
      <PageHeading
        eyebrow="UNA DESPENSA SIEMPRE LISTA"
        title="Abastecer para crecer."
        text="Registra compras y confirma la mercadería que llega a tu tienda."
      >
        <button
          className="btn secondary"
          disabled={!data}
          onClick={() =>
            exportCsv("lirio-compras", [
              ["Orden", "Proveedor", "Fecha", "Estado", "Total PEN"],
              ...shown.map((c) => [
                c.numero,
                c.proveedor.nombre,
                c.fecha,
                c.estado,
                c.total,
              ]),
            ])
          }
        >
          <FiDownload /> Exportar
        </button>
        <button
          className="btn primary"
          onClick={() => setModal({ type: "new" })}
        >
          <FiPlus /> Nueva compra
        </button>
      </PageHeading>
      <section className="glass panel table-panel">
        <div className="table-toolbar">
          <Search
            value={q}
            onChange={(v) => {
              setQ(v);
              setPage(1);
            }}
            placeholder="Buscar orden o proveedor…"
          />
          <select
            aria-label="Estado de la compra"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="RECIBIDA">Recibidas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : !shown.length ? (
          <Empty
            title="Tu próxima reposición empieza aquí"
            text="Registra la compra y confírmala cuando llegue la mercadería."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Orden de compra</th>
                    <th>Proveedor</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="right">Total</th>
                    <th className="right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.slice((safePage - 1) * 10, safePage * 10).map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.numero}</strong>
                        <small>{c.items.length} productos diferentes</small>
                      </td>
                      <td>{c.proveedor.nombre}</td>
                      <td>{date(c.fecha + "T12:00:00")}</td>
                      <td>
                        <Status value={c.estado} />
                      </td>
                      <td className="right">
                        <strong>{money(c.total)}</strong>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-btn"
                            aria-label={"Ver compra " + c.numero}
                            onClick={() => {
                              setFailure("");
                              setModal({ type: "view", purchase: c });
                            }}
                          >
                            <FiEye />
                          </button>
                        </div>
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
      {(modal?.type === "new" || params.has("proveedor")) && (
        <PurchaseEditor
          supplierId={params.get("proveedor")}
          onClose={close}
          onSaved={() => {
            close();
            refresh();
          }}
        />
      )}
      {modal?.type === "view" && (
        <Modal
          title={modal.purchase.numero}
          onClose={close}
          className="wide-modal"
        >
          <div className="order-summary-head">
            <strong>{modal.purchase.proveedor.nombre}</strong>
            <Status value={modal.purchase.estado} />
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidades</th>
                  <th>Costo</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {modal.purchase.items.map((i) => (
                  <tr key={i.productoId}>
                    <td>{i.nombre}</td>
                    <td>{i.cantidad}</td>
                    <td>{money(i.costo)}</td>
                    <td>{money(i.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>{money(modal.purchase.total)}</strong>
          </div>
          {modal.purchase.observaciones && (
            <p>{modal.purchase.observaciones}</p>
          )}
          {modal.purchase.estado === "PENDIENTE" && (
            <>
              <div className="notice">
                Al recibir esta compra confirmas que la mercadería llegó a la
                tienda. El stock aumentará con las cantidades indicadas.
              </div>
              <div className="form-actions">
                <button
                  className="btn danger"
                  disabled={busy}
                  onClick={() => action("cancel", modal.purchase)}
                >
                  <FiX /> Cancelar compra
                </button>
                <button
                  className="btn primary"
                  disabled={busy}
                  onClick={() => action("receive", modal.purchase)}
                >
                  <FiCheck /> {busy ? "Guardando…" : "Confirmar recepción"}
                </button>
              </div>
            </>
          )}
          {failure && <ErrorBox message={failure} />}
        </Modal>
      )}
    </>
  );
}
