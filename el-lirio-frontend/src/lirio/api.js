const API = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");
export const CHAT_URL =
  import.meta.env.VITE_CHATBOT_URL || "http://localhost:8501";
export const money = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    Number(n || 0),
  );
export const cents = (n) => Math.round(Number(n || 0) * 100);
export const date = (value, time = false) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
export function imageUrl(path) {
  if (
    !path ||
    !/^\/uploads\/productos\/[a-zA-Z0-9_.-]+\.(jpg|jpeg|png|webp)$/.test(path)
  )
    return "/product-placeholder.svg";
  if (API.startsWith("http")) return new URL(API).origin + path;
  return path;
}
export async function api(path, options = {}) {
  const token = sessionStorage.getItem("lirio.token");
  const { body, ...rest } = options;
  const form = body instanceof FormData;
  const response = await fetch(API + path, {
    ...rest,
    headers: {
      ...(body && !form ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
    ...(body ? { body: form ? body : JSON.stringify(body) } : {}),
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith("/auth/login")) {
      sessionStorage.removeItem("lirio.token");
      window.dispatchEvent(new Event("lirio:logout"));
    }
    throw new Error(
      data.message ||
        "No se pudo completar la operación. Inténtalo nuevamente.",
    );
  }
  return data;
}
export async function receiptUrl(id) {
  const response = await fetch(API + "/orders/" + id + "/receipt", {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("lirio.token"),
    },
  });
  if (!response.ok) throw new Error("No se pudo abrir el comprobante");
  return URL.createObjectURL(await response.blob());
}
export function exportCsv(name, rows) {
  const quote = (value) => {
    let text = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const data = "\uFEFF" + rows.map((r) => r.map(quote).join(";")).join("\r\n");
  const url = URL.createObjectURL(
    new Blob([data], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
