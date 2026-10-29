import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
export function Search({ value, onChange, placeholder = "Buscar…" }) {
  return (
    <div className="search-input">
      <FiSearch />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function Pagination({ page, onChange, total, size = 10 }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <span>
        {total === 0
          ? "Sin registros"
          : (page - 1) * size +
            1 +
            "–" +
            Math.min(page * size, total) +
            " de " +
            total +
            " registros"}
      </span>
      <div>
        <button
          className="icon-btn"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <FiChevronLeft />
        </button>
        <span>
          {page} / {pages}
        </span>
        <button
          className="icon-btn"
          aria-label="Página siguiente"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
export function FormActions({ busy, onCancel, label = "Guardar cambios" }) {
  return (
    <div className="form-actions">
      <button
        className="btn secondary"
        type="button"
        onClick={onCancel}
        disabled={busy}
      >
        Cancelar
      </button>
      <button className="btn primary" disabled={busy}>
        {busy ? "Guardando…" : label}
      </button>
    </div>
  );
}
