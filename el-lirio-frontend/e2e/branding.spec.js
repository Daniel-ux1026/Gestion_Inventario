import { test, expect } from "@playwright/test";

test("logo y cabecera limpia; el modo elegido persiste entre páginas y recargas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const header = page.locator(".store-header");
  const logo = header.getByRole("img", { name: "Lirio Inversiones" });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveJSProperty("naturalWidth", 697);
  await expect(page.locator(".store-strip")).toHaveCount(0);
  await expect(page.getByText("Pequeños detalles. Una compra mejor.", { exact: true })).toHaveCount(0);
  await expect(header.locator('a[href^="tel:"]')).toHaveCount(0);

  const dark = page.getByRole("button", { name: "Activar modo oscuro" });
  await dark.focus();
  await dark.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Activar modo claro" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "La tienda" }).click();
  await expect(page.locator(".product-card").first()).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Activar modo claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("la preferencia del dispositivo se respeta y puede cambiarse al iniciar sesión", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/login");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel("Correo electrónico", { exact: true }).fill("prueba@ejemplo.com");
  await page.getByLabel("Contraseña", { exact: true }).fill("PruebaLocal123!");
  await page.getByRole("button", { name: "Activar modo claro" }).click();
  await expect(page.getByLabel("Correo electrónico", { exact: true })).toHaveValue("prueba@ejemplo.com");
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveValue("PruebaLocal123!");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("la bolsa y el asistente se abren en modo oscuro", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/tienda");
  await expect(page.locator(".product-card").first()).toBeVisible();
  await page.getByRole("button", { name: /Abrir bolsa con/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  await page.getByRole("button", { name: "Abrir asistente de El Lirio" }).click();
  await expect(page.locator('iframe[title="Asistente de El Lirio en Streamlit"]')).toHaveAttribute("src", /embed_options=dark_theme/);
  const chat = page.frameLocator('iframe[title="Asistente de El Lirio en Streamlit"]');
  await expect(chat.getByRole("heading", { name: "Hola, ¿en qué te ayudamos?" })).toBeVisible({ timeout: 30000 });
  await expect(chat.locator(".stApp")).toHaveCSS("background-color", "rgb(23, 18, 21)");
});
