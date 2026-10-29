import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiDownload,
  FiEdit2,
  FiArchive,
  FiSliders,
  FiCheck,
  FiRotateCcw,
} from "react-icons/fi";
import { api, money, imageUrl, exportCsv } from "./api";
import useApi from "./useApi";
import { useStore } from "./StoreContext";
import { PageHeading, Modal, Loading, ErrorBox, Empty } from "./UI";
import { Search, Pagination, FormActions } from "./AdminUI";

function ProductEditor({ product: p, refs, onClose, onSaved }) {
  const { notify } = useStore(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [image, setImage] = useState(p?.imagen || "");
  const [categories, setCategories] = useState(refs.categorias),
    [brands, setBrands] = useState(refs.marcas),
    [newRef, setNewRef] = useState(null),
    [refName, setRefName] = useState("");
  const images = [
    "aceite-primor.jpg",
    "aceite-deleite.jpg",
    "aceite-olivar.jpg",
    "aceite.jpg",
    "arroz-costeno.jpg",
    "arroz-paisana.jpg",
    "arroz_faraon.jpg",
    "arroz_bells.jpg",
    "atun_florida.jpg",
    "atun_gloria.jpg",
    "atun_real.jpg",
    "atun-campomar.jpg",
    "atun-marinero.jpg",
    "atun-sanjorge.jpg",
    "cafe_altomayo.jpg",
    "cafe_artidoro.jpg",
    "cafe_villa_rica.jpg",
    "fideo-nicolini.jpg",
    "fideo-macarron.jpg",
    "linguini-donvittorio.jpg",
    "bolivar.jpg",
    "opal.jpg",
    "patrona.jpg",
    "sapolio.jpg",
  ];
  async function addRef() {
    if (!refName.trim()) return;
    setBusy(true);
    setError("");
    try {
      const r = await api("/admin/" + newRef, {
        method: "POST",
        body: { nombre: refName },
      });
      if (newRef === "categories") setCategories((v) => [...v, r]);
      else setBrands((v) => [...v, r]);
      setNewRef(null);
      setRefName("");
      notify("Registro creado");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const raw = Object.fromEntries(new FormData(e.currentTarget)),
      body = {
        ...raw,
        imagen: image,
        stock: p ? p.stock : Number(raw.stock),
        stockMinimo: Number(raw.stockMinimo),
        precio: Number(raw.precio),
        costo: Number(raw.costo),
        descuento: Number(raw.descuento),
        categoriaId: Number(raw.categoriaId),
        marcaId: Number(raw.marcaId),
        proveedorId: raw.proveedorId ? Number(raw.proveedorId) : null,
      };
    try {
      await api("/admin/products" + (p ? "/" + p.id : ""), {
        method: p ? "PUT" : "POST",
        body,
      });
      notify(p ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={p ? "Editar producto" : "Un nuevo producto"}
      onClose={onClose}
      className="wide-modal"
    >
      <form onSubmit={save}>
        <div className="product-form-top">
          <img src={imageUrl(image)} alt="Imagen del producto" />
          <div>
            <label>
              Imagen de la biblioteca
              <select value={image} onChange={(e) => setImage(e.target.value)}>
                <option value="">Sin imagen</option>
                {images.map((i) => (
                  <option key={i} value={"/uploads/productos/" + i}>
                    {i
                      .replaceAll("_", " ")
                      .replaceAll("-", " ")
                      .replace(".jpg", "")}
                  </option>
                ))}
              </select>
            </label>
            <span className="small muted">
              Usa las fotografías incluidas en el proyecto.
            </span>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              defaultValue={p?.codigo || ""}
              required
              maxLength="50"
              placeholder="LIR-025"
            />
          </label>
          <label>
            Nombre del producto
            <input
              name="nombre"
              defaultValue={p?.nombre || ""}
              required
              maxLength="200"
              placeholder="Nombre y presentación"
            />
          </label>
          <label>
            Precio de compra (S/)
            <input
              name="costo"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              defaultValue={p?.costo || ""}
              required
            />
          </label>
          <label>
            Precio de venta (S/)
            <input
              name="precio"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              defaultValue={p?.precioOriginal || ""}
              required
            />
          </label>
          <label>
            Descuento (%)
            <input
              name="descuento"
              type="number"
              min="0"
              max="90"
              step="1"
              defaultValue={p?.descuento || 0}
              required
            />
          </label>
          <label>
            Stock mínimo
            <input
              name="stockMinimo"
              type="number"
              min="0"
              max="1000000"
              step="1"
              defaultValue={p?.stockMinimo ?? 10}
              required
            />
          </label>
          {!p && (
            <label>
              Stock inicial
              <input
                name="stock"
                type="number"
                min="0"
                max="1000000"
                step="1"
                defaultValue="0"
                required
              />
            </label>
          )}
          <div className="reference-field">
            <div className="label-row">
              <label htmlFor="product-category">Categoría</label>
              <button
                type="button"
                className="inline-add"
                onClick={() => setNewRef("categories")}
              >
                + Nueva
              </button>
            </div>
            <select
              id="product-category"
              name="categoriaId"
              defaultValue={p?.categoria.id || ""}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="reference-field">
            <div className="label-row">
              <label htmlFor="product-brand">Marca</label>
              <button
                type="button"
                className="inline-add"
                onClick={() => setNewRef("brands")}
              >
                + Nueva
              </button>
            </div>
            <select
              id="product-brand"
              name="marcaId"
              defaultValue={p?.marca.id || ""}
              required
            >
              <option value="">Selecciona una marca</option>
              {brands.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <label>
            Proveedor
            <select name="proveedorId" defaultValue={p?.proveedor?.id || ""}>
              <option value="">Sin proveedor asignado</option>
              {refs.proveedores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        {newRef && (
          <div className="inline-reference">
            <input
              aria-label={
                newRef === "categories"
                  ? "Nombre de categoría"
                  : "Nombre de marca"
              }
              placeholder="Nombre del nuevo registro"
              value={refName}
              maxLength="100"
              onChange={(e) => setRefName(e.target.value)}
            />
            <button
              type="button"
              className="btn secondary"
              disabled={busy}
              onClick={addRef}
            >
              Crear
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => setNewRef(null)}
            >
              Cancelar
            </button>
          </div>
        )}
        <label>
          Descripción
          <textarea
            name="descripcion"
            defaultValue={p?.descripcion || ""}
            maxLength="2000"
            rows="2"
          />
        </label>
        {p && (
          <p className="notice">
            El stock se modifica con un ajuste o al recibir una compra. Así
            conservamos el historial de movimientos.
          </p>
        )}
        {error && <ErrorBox message={error} />}
        <FormActions
          busy={busy}
          onCancel={onClose}
          label={p ? "Guardar cambios" : "Crear producto"}
        />
      </form>
    </Modal>
  );
}
function Adjustment({ product: p, onClose, onSaved }) {
  const { notify } = useStore(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [qty, setQty] = useState("");
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        cantidad: Number(qty),
        motivo: new FormData(e.currentTarget).get("motivo"),
      };
      await api("/admin/products/" + p.id + "/adjust", {
        method: "POST",
        body,
      });
      notify("Stock actualizado y movimiento registrado");
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Ajustar stock" onClose={onClose}>
      <p>
        <strong>{p.nombre}</strong> · Stock actual: {p.stock} unidades
      </p>
      <form onSubmit={save}>
        <label>
          Variación de unidades
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            min={-p.stock}
            max={1000000 - p.stock}
            step="1"
            placeholder="Ej. 10 para ingresar o -2 para retirar"
            required
          />
        </label>
        <p className="notice">
          Stock resultante:{" "}
          <strong>{p.stock + Number(qty || 0)} unidades</strong>
        </p>
        <label>
          Motivo del ajuste
          <textarea
            name="motivo"
            required
            minLength="5"
            maxLength="150"
            placeholder="Explica el motivo para el historial"
            rows="3"
          />
        </label>
        {error && <ErrorBox message={error} />}
        <FormActions busy={busy} onCancel={onClose} label="Registrar ajuste" />
      </form>
    </Modal>
  );
}
export default function Inventory() {
  const { notify, refresh: refreshShop } = useStore(),
    [params, setParams] = useSearchParams(),
    [page, setPage] = useState(1),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false);
  const { data, loading, error, refresh } = useApi("/admin/products"),
    {
      data: refs,
      error: refError,
      refresh: refreshRefs,
    } = useApi("/admin/references");
  const q = params.get("q") || "",
    stock = params.get("stock") || "todos",
    category = params.get("categoria") || "";
  const shown = (data || []).filter(
    (p) =>
      (stock === "archivados" ? !p.activo : p.activo) &&
      (stock !== "bajo" || p.stock <= p.stockMinimo) &&
      (!category || p.categoria.nombre === category) &&
      (p.nombre + " " + p.codigo).toLowerCase().includes(q.toLowerCase()),
  );
  const safePage = Math.min(page, Math.max(1, Math.ceil(shown.length / 10)));
  function filter(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
    setPage(1);
  }
  function saved() {
    setModal(null);
    refresh();
    refreshRefs();
    refreshShop();
  }
  async function archive(p) {
    setBusy(true);
    try {
      await api("/admin/products/" + p.id + (p.activo ? "" : "/restore"), {
        method: p.activo ? "DELETE" : "POST",
      });
      notify(p.activo ? "Producto archivado" : "Producto reactivado");
      saved();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="CADA PRODUCTO CUENTA"
        title="Todo en su lugar."
        text="Tu inventario, actualizado y bajo control."
      >
        <button
          className="btn secondary"
          disabled={!data}
          onClick={() =>
            exportCsv("lirio-inventario", [
              [
                "Código",
                "Producto",
                "Categoría",
                "Stock",
                "Mínimo",
                "Compra PEN",
                "Venta PEN",
                "Activo",
              ],
              ...shown.map((p) => [
                p.codigo,
                p.nombre,
                p.categoria.nombre,
                p.stock,
                p.stockMinimo,
                p.costo,
                p.precio,
                p.activo ? "Sí" : "No",
              ]),
            ])
          }
        >
          <FiDownload /> Exportar
        </button>
        <button
          className="btn primary"
          disabled={!refs}
          onClick={() => setModal({ type: "edit" })}
        >
          <FiPlus /> Nuevo producto
        </button>
      </PageHeading>
      <div className="mini-stats">
        <span>
          <b>{data?.filter((p) => p.activo).length || 0}</b> productos activos
        </span>
        <span>
          <i className="warning-dot" />
          <b>
            {data?.filter((p) => p.activo && p.stock <= p.stockMinimo).length ||
              0}
          </b>{" "}
          necesitan reposición
        </span>
        <span>
          <b>
            {data?.filter((p) => p.activo).reduce((n, p) => n + p.stock, 0) ||
              0}
          </b>{" "}
          unidades en tienda
        </span>
      </div>
      <section className="glass panel table-panel">
        <div className="table-toolbar">
          <Search
            value={q}
            onChange={(v) => filter("q", v)}
            placeholder="Buscar por nombre o código…"
          />
          <select
            aria-label="Filtrar por categoría"
            value={category}
            onChange={(e) => filter("categoria", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {refs?.categorias.map((c) => (
              <option key={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select
            aria-label="Filtrar por estado de stock"
            value={stock}
            onChange={(e) => filter("stock", e.target.value)}
          >
            <option value="todos">Todos los activos</option>
            <option value="bajo">Stock bajo</option>
            <option value="archivados">Archivados</option>
          </select>
        </div>
        {loading ? (
          <Loading />
        ) : error || refError ? (
          <ErrorBox
            message={error || refError}
            retry={() => {
              refresh();
              refreshRefs();
            }}
          />
        ) : !shown.length ? (
          <Empty
            title="No hay productos aquí"
            text="Prueba otro filtro o añade un nuevo producto."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th className="right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.slice((safePage - 1) * 10, safePage * 10).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product">
                          <img src={imageUrl(p.imagen)} alt="" />
                          <span>
                            <strong>{p.nombre}</strong>
                            <small>{p.codigo}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="category-label">
                          {p.categoria.nombre}
                        </span>
                      </td>
                      <td>
                        <strong>{money(p.precio)}</strong>
                        {p.descuento > 0 && (
                          <small>−{p.descuento}% aplicado</small>
                        )}
                      </td>
                      <td>
                        <div className="stock-cell">
                          <strong>{p.stock}</strong>
                          <span> / mín. {p.stockMinimo}</span>
                          <div>
                            <i
                              className={p.stock <= p.stockMinimo ? "low" : ""}
                              style={{
                                width:
                                  Math.min(
                                    100,
                                    (p.stock / Math.max(1, p.stockMinimo * 5)) *
                                      100,
                                  ) + "%",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            "status " +
                            (!p.activo
                              ? "neutral"
                              : p.stock === 0
                                ? "danger"
                                : p.stock <= p.stockMinimo
                                  ? "warning"
                                  : "success")
                          }
                        >
                          <i />
                          {!p.activo
                            ? "Archivado"
                            : p.stock === 0
                              ? "Agotado"
                              : p.stock <= p.stockMinimo
                                ? "Stock bajo"
                                : "Disponible"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-btn"
                            aria-label={"Editar " + p.nombre}
                            disabled={!refs}
                            onClick={() =>
                              setModal({ type: "edit", product: p })
                            }
                          >
                            <FiEdit2 />
                          </button>
                          {p.activo ? (
                            <>
                              <button
                                className="icon-btn"
                                aria-label={"Ajustar stock de " + p.nombre}
                                onClick={() =>
                                  setModal({ type: "adjust", product: p })
                                }
                              >
                                <FiSliders />
                              </button>
                              <button
                                className="icon-btn"
                                aria-label={"Archivar " + p.nombre}
                                onClick={() =>
                                  setModal({ type: "archive", product: p })
                                }
                              >
                                <FiArchive />
                              </button>
                            </>
                          ) : (
                            <button
                              className="icon-btn"
                              aria-label={"Reactivar " + p.nombre}
                              disabled={busy}
                              onClick={() => archive(p)}
                            >
                              <FiRotateCcw />
                            </button>
                          )}
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
      {modal?.type === "edit" && refs && (
        <ProductEditor
          product={modal.product}
          refs={refs}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {modal?.type === "adjust" && (
        <Adjustment
          product={modal.product}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {modal?.type === "archive" && (
        <Modal title="Archivar producto" onClose={() => setModal(null)}>
          <p>
            <strong>{modal.product.nombre}</strong> dejará de aparecer en la
            tienda. Su historial se conserva y podrás reactivarlo desde
            Archivados.
          </p>
          <div className="form-actions">
            <button
              className="btn secondary"
              disabled={busy}
              onClick={() => setModal(null)}
            >
              Cancelar
            </button>
            <button
              className="btn danger"
              disabled={busy}
              onClick={() => archive(modal.product)}
            >
              {busy ? "Archivando…" : "Archivar producto"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
