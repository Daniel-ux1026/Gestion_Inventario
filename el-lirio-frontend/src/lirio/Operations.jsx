import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiPhone,
  FiMail,
  FiArrowUpRight,
  FiTruck,
  FiDownload,
  FiCheck,
  FiEye,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { api, money, date, exportCsv, cents } from "./api";
import useApi from "./useApi";
import { useStore } from "./StoreContext";
import { PageHeading, Modal, Loading, ErrorBox, Empty, Status } from "./UI";
import { Search, Pagination, FormActions } from "./AdminUI";

function SupplierEditor({ supplier: p, onClose, onSaved }) {
  const { notify } = useStore(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/suppliers" + (p ? "/" + p.id : ""), {
        method: p ? "PUT" : "POST",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      notify("Proveedor guardado");
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={p ? "Editar proveedor" : "Un nuevo aliado"} onClose={onClose}>
      <form onSubmit={submit}>
        <label>
          Razón social
          <input
            name="nombre"
            required
            maxLength="150"
            defaultValue={p?.nombre || ""}
          />
        </label>
        <div className="form-grid">
          <label>
            RUC
            <input
              name="ruc"
              required
              inputMode="numeric"
              pattern="[0-9]{11}"
              maxLength="11"
              defaultValue={p?.ruc || ""}
            />
          </label>
          <label>
            Teléfono
            <input
              type="tel"
              name="telefono"
              required
              pattern="[0-9+ ()-]{7,20}"
              defaultValue={p?.telefono || ""}
            />
          </label>
        </div>
        <label>
          Correo de contacto
          <input
            name="email"
            type="email"
            maxLength="150"
            defaultValue={p?.email || ""}
          />
        </label>
        <label>
          Dirección
          <input
            name="direccion"
            maxLength="300"
            defaultValue={p?.direccion || ""}
          />
        </label>
        {error && <ErrorBox message={error} />}
        <FormActions busy={busy} onCancel={onClose} label="Guardar proveedor" />
      </form>
    </Modal>
  );
}
export function Suppliers() {
  const { data, loading, error, refresh } = useApi("/admin/suppliers"),
    [q, setQ] = useState(""),
    [modal, setModal] = useState(null);
  const shown = (data || []).filter((p) =>
    (p.nombre + " " + p.ruc).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="CRECER ES UN TRABAJO EN EQUIPO"
        title="Buenos aliados."
        text="El directorio de quienes abastecen tu tienda."
      >
        <button className="btn primary" onClick={() => setModal({})}>
          <FiPlus /> Nuevo proveedor
        </button>
      </PageHeading>
      <div className="glass panel supplier-toolbar">
        <Search
          value={q}
          onChange={setQ}
          placeholder="Buscar proveedor por nombre o RUC…"
        />
        <span className="muted">{shown.length} proveedores</span>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={refresh} />
      ) : shown.length ? (
        <div className="supplier-grid">
          {shown.map((p) => (
            <article className="glass supplier-card" key={p.id}>
              <div className="supplier-card-top">
                <span className="supplier-icon">
                  <FiTruck />
                </span>
                <button
                  className="icon-btn"
                  aria-label={"Editar " + p.nombre}
                  onClick={() => setModal(p)}
                >
                  <FiEdit2 />
                </button>
              </div>
              <h2>{p.nombre}</h2>
              <p className="muted">RUC {p.ruc}</p>
              <a href={"tel:" + p.telefono}>
                <FiPhone /> {p.telefono}
              </a>
              {p.email && (
                <a href={"mailto:" + p.email}>
                  <FiMail /> {p.email}
                </a>
              )}
              {p.direccion && <p className="small muted">{p.direccion}</p>}
              <Link
                className="text-link"
                to={"/admin/compras?proveedor=" + p.id}
              >
                Registrar una compra <FiArrowUpRight />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Tu próximo aliado va aquí"
          text="Añade un proveedor para empezar a registrar compras."
        />
      )}
      {modal && (
        <SupplierEditor
          supplier={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            refresh();
          }}
        />
      )}
    </>
  );
}
export function Customers() {
  const { data, loading, error, refresh } = useApi("/admin/customers"),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  const shown = (data || []).filter((c) =>
    (c.user.nombre + " " + c.user.apellido + " " + c.user.email)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(shown.length / 10)));
  return (
    <>
      <PageHeading
        eyebrow="LA PARTE MÁS IMPORTANTE DE EL LIRIO"
        title="Personas, antes que números."
        text="Conoce a los clientes registrados de tu tienda."
      >
        <button
          className="btn secondary"
          disabled={!data}
          onClick={() =>
            exportCsv("lirio-clientes", [
              [
                "Nombre",
                "Correo",
                "Teléfono",
                "Pedidos aprobados",
                "Compras PEN",
              ],
              ...shown.map((c) => [
                c.user.nombre + " " + c.user.apellido,
                c.user.email,
                c.user.telefono,
                c.pedidos,
                c.compras,
              ]),
            ])
          }
        >
          <FiDownload /> Exportar clientes
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
            placeholder="Buscar cliente por nombre o correo…"
          />
          <span className="muted">{shown.length} clientes registrados</span>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : !shown.length ? (
          <Empty
            title="Aquí conocerás a tus clientes"
            text="Los clientes que creen una cuenta aparecerán aquí."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Pedidos aprobados</th>
                    <th>Total de compras</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.slice((safePage - 1) * 10, safePage * 10).map((c) => (
                    <tr key={c.user.id}>
                      <td>
                        <div className="table-customer">
                          <span className="avatar">{c.user.nombre[0]}</span>
                          <span>
                            <strong>
                              {c.user.nombre} {c.user.apellido}
                            </strong>
                            <small>Cliente registrado</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        {c.user.email}
                        <small>{c.user.telefono || "Sin teléfono"}</small>
                      </td>
                      <td>{c.pedidos}</td>
                      <td>
                        <strong>{money(c.compras)}</strong>
                      </td>
                      <td>
                        <Link
                          className="text-link"
                          to={
                            "/admin/pedidos?q=" +
                            encodeURIComponent(c.user.email)
                          }
                        >
                          Ver pedidos <FiArrowUpRight />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              total={shown.length}
              page={safePage}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}
export function Movements() {
  const { data, loading, error, refresh } = useApi("/admin/kardex"),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  const shown = (data || []).filter((k) =>
    (k.producto + " " + k.motivo).toLowerCase().includes(q.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(shown.length / 10)));
  return (
    <>
      <PageHeading
        eyebrow="CADA UNIDAD TIENE UNA HISTORIA"
        title="Un inventario con memoria."
        text="Entradas, reservas, salidas y reversiones. Los últimos 500 movimientos."
      >
        <button
          className="btn secondary"
          disabled={!data}
          onClick={() =>
            exportCsv("lirio-movimientos", [
              ["Fecha", "Producto", "Motivo", "Variación", "Stock resultante"],
              ...shown.map((k) => [
                k.fecha,
                k.producto,
                k.motivo,
                k.cantidad,
                k.stock,
              ]),
            ])
          }
        >
          <FiDownload /> Exportar historial
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
            placeholder="Buscar por producto o motivo…"
          />
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
            title="Cada movimiento queda aquí"
            text="Las compras recibidas, ventas y ajustes crearán tu historial."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Motivo</th>
                    <th>Variación</th>
                    <th>Stock resultante</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.slice((safePage - 1) * 10, safePage * 10).map((k) => (
                    <tr key={k.id}>
                      <td className="muted">{date(k.fecha, true)}</td>
                      <td>
                        <strong>{k.producto}</strong>
                      </td>
                      <td>{k.motivo}</td>
                      <td>
                        <span
                          className={
                            "movement-qty " +
                            (k.cantidad > 0 ? "positive" : "negative")
                          }
                        >
                          {k.cantidad > 0 ? "+" : ""}
                          {k.cantidad}
                        </span>
                      </td>
                      <td>{k.stock} unidades</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              total={shown.length}
              page={safePage}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}
export function Business() {
  const { business, setBusiness, notify, demo } = useStore(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const saved = await api("/admin/business", {
        method: "PUT",
        body: Object.fromEntries(new FormData(e.currentTarget)),
      });
      setBusiness(saved);
      notify("Los datos de tu tienda se han guardado");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="EL LIRIO, A TU MANERA"
        title="Los detalles de tu negocio."
        text="Información que tus clientes encontrarán en la tienda."
      />
      <div className="settings-grid">
        <form
          className="glass panel form-panel"
          onSubmit={submit}
          key={business.id}
        >
          <h2>Información de la tienda</h2>
          <label>
            Nombre comercial
            <input
              name="nombre"
              defaultValue={business.nombre}
              required
              maxLength="150"
            />
          </label>
          <label>
            Teléfono de contacto
            <input
              name="telefono"
              type="tel"
              defaultValue={business.telefono}
              required
              pattern="[0-9+ ()-]{7,20}"
            />
          </label>
          <label>
            Dirección de la tienda
            <input
              name="direccion"
              defaultValue={business.direccion || ""}
              maxLength="300"
              placeholder="Completa la dirección real de tu negocio"
            />
          </label>
          <label>
            Horario de atención
            <input
              name="horario"
              defaultValue={business.horario || ""}
              maxLength="200"
              placeholder="Completa tu horario de atención"
            />
          </label>
          {error && <ErrorBox message={error} />}
          <button className="btn primary" disabled={busy}>
            {busy ? "Guardando…" : "Guardar información"} <FiCheck />
          </button>
        </form>
        <aside>
          <div className="glass panel settings-info">
            <span className="eyebrow">TU ESPACIO</span>
            <h2>Una base, todo conectado.</h2>
            <p>
              Los cambios se guardan en la base de datos y se reflejan en tu
              tienda.
            </p>
            <dl>
              <div>
                <dt>Moneda</dt>
                <dd>Soles peruanos · PEN</dd>
              </div>
              <div>
                <dt>Zona horaria</dt>
                <dd>América / Lima</dd>
              </div>
              <div>
                <dt>Entorno</dt>
                <dd>
                  {demo ? "Demostración local" : "Base de datos de producción"}
                </dd>
              </div>
              <div>
                <dt>Confirmación de pagos</dt>
                <dd>Revisión manual por administrador</dd>
              </div>
            </dl>
            <p className="small muted">
              El contacto directo solicitado para el asistente es 948656772.
            </p>
          </div>
          <div className="notice">
            <strong>Registros operativos</strong>
            <p>
              Los reportes de este sistema no sustituyen los comprobantes
              electrónicos ni la contabilidad de tu negocio.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
