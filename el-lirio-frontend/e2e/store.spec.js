import { test, expect } from "@playwright/test";
const API = process.env.PLAYWRIGHT_API_URL ||
  (process.env.PLAYWRIGHT_BASE_URL ? process.env.PLAYWRIGHT_BASE_URL.replace(/\/$/, "") + "/api/v1" : "http://127.0.0.1:8080/api/v1");
let session;
test.beforeAll(async ({ request }) => {
  const r = await request.post(API + "/auth/login", {
    data: {
      email: process.env.PLAYWRIGHT_ADMIN_EMAIL || "admin@lirio.local",
      password: process.env.PLAYWRIGHT_ADMIN_PASSWORD || "LirioDemo2026!",
    },
  });
  expect(r.ok()).toBeTruthy();
  session = await r.json();
});
async function admin(page, path = "/admin") {
  await page.addInitScript(
    (t) => sessionStorage.setItem("lirio.token", t),
    session.token,
  );
  await page.goto(path);
}
test("catalog search, favorites and categories", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/tienda");
  await expect(page.locator(".product-card").first()).toBeVisible();
  await page.getByRole("textbox", { name: "Buscar productos" }).fill("arroz");
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: /favoritos/ })
    .click();
  await page
    .getByRole("button", { name: "Mis favoritos", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Mis favoritos", exact: true })
    .click();
  await page.getByRole("button", { name: "Limpiar búsqueda" }).click();
  await page.getByRole("button", { name: "Conservas", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test("admin requires authentication and blocks clients", async ({
  page,
  request,
}) => {
  await page.goto("/admin/inventario");
  await expect(page).toHaveURL(/login/);
  const r = await request.post(API + "/auth/register", {
    data: {
      nombre: "Prueba",
      apellido: "Cliente",
      email: "permiso-" + Date.now() + "@ejemplo.local",
      password: "PruebaCliente2026!",
      telefono: "900000000",
    },
  });
  expect(r.status()).toBe(201);
  const s = await r.json();
  await page.evaluate((t) => sessionStorage.setItem("lirio.token", t), s.token);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Este espacio es para administradores" }),
  ).toBeVisible();
});
test("customer registers and confirms a cash order", async ({ page }) => {
  await page.goto("/registro");
  await page.getByLabel("Nombre", { exact: true }).fill("Cliente");
  await page.getByLabel("Apellido", { exact: true }).fill("Navegador");
  await page
    .getByLabel("Correo electrónico")
    .fill("compra-" + Date.now() + "@ejemplo.local");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("PruebaCliente2026!");
  await page.getByLabel("Teléfono").fill("900000000");
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/tienda");
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: /Añadir .* a la bolsa/ })
    .click();
  await page.getByRole("button", { name: /Abrir bolsa con/ }).click();
  const d = page.getByRole("dialog");
  await d.getByRole("button", { name: /Añadir una unidad/ }).click();
  await d.getByRole("link", { name: "Continuar con mi pedido" }).click();
  await page.getByRole("button", { name: "Confirmar mi pedido" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu pedido ya está en buenas manos." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ver mis pedidos" }).click();
  await expect(page.locator(".order-card").first()).toContainText(
    "Por validar",
  );
});
test("dashboard ranges, theme and mobile navigation", async ({ page }) => {
  await admin(page);
  await expect(page.getByText("El ritmo de tus ventas")).toBeVisible();
  await page.getByRole("button", { name: "30 días", exact: true }).click();
  await expect(page.locator(".segmented button.active")).toHaveText("30 días");
  await page.getByRole("button", { name: "Activar modo oscuro" }).click();
  await expect(page.locator(".admin-shell")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await page.getByRole("button", { name: "Activar modo claro" }).click();
  if (await page.getByRole("button", { name: "Abrir menú" }).isVisible())
    await page.getByRole("button", { name: "Abrir menú" }).click();
  await page
    .getByRole("navigation", { name: "Administración" })
    .getByRole("link", { name: "Inventario", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Todo en su lugar." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
});
test("admin product creation, adjustment and archive persist", async ({
  page,
  request,
}) => {
  const code = "E2E-" + Date.now(),
    name = "Producto de prueba " + Date.now();
  await admin(page, "/admin/inventario");
  await page.getByRole("button", { name: "Nuevo producto" }).click();
  const d = page.getByRole("dialog");
  await d.getByLabel("Código", { exact: true }).fill(code);
  await d.getByLabel("Nombre del producto").fill(name);
  await d.getByLabel("Precio de compra (S/)").fill("2.20");
  await d.getByLabel("Precio de venta (S/)").fill("4.50");
  await d.getByLabel("Stock inicial").fill("7");
  await d.getByLabel("Categoría").selectOption({ label: "Abarrotes" });
  await d.getByLabel("Marca").selectOption({ label: "Selección El Lirio" });
  await d.getByRole("button", { name: "Crear producto", exact: true }).click();
  await expect(d).not.toBeVisible();
  await page
    .getByRole("textbox", { name: "Buscar por nombre o código…" })
    .fill(code);
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Ajustar stock de " + name }).click();
  await page.getByLabel("Variación de unidades").fill("-2");
  await page
    .getByLabel("Motivo del ajuste")
    .fill("Conteo físico de prueba de navegador");
  await page.getByRole("button", { name: "Registrar ajuste" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const r = await request.get(API + "/admin/products", {
    headers: { Authorization: "Bearer " + session.token },
  });
  expect((await r.json()).find((p) => p.codigo === code).stock).toBe(5);
  await page
    .getByRole("button", { name: "Archivar " + name, exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Archivar producto", exact: true })
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(0);
});
test("Streamlit suggested question returns company phone", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Abrir asistente de El Lirio" })
    .click();
  const frame = page.frameLocator(
    'iframe[title="Asistente de El Lirio en Streamlit"]',
  );
  await frame
    .getByRole("button", { name: "¿Cómo contacto con la empresa?" })
    .click();
  await expect(
    frame.getByText(/Deseas contactar con la empresa/),
  ).toContainText("948656772");
});
