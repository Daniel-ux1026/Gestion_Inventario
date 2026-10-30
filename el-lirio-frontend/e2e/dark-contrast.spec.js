import { test, expect } from "@playwright/test";

// Measure the colors rendered by the browser, including transparent backgrounds.
async function contrast(locator) {
  return locator.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const rgba = (color) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const blend = (color, background) => color.slice(0, 3).map((v, i) => v * color[3] / 255 + background[i] * (1 - color[3] / 255));
    const layers = [];
    let opacity = 1;
    for (let node = element; node; node = node.parentElement) {
      layers.push(rgba(getComputedStyle(node).backgroundColor));
      opacity *= Number(getComputedStyle(node).opacity);
    }
    const background = layers.reverse().reduce((base, layer) => blend(layer, base), [255, 255, 255]);
    const color = rgba(getComputedStyle(element).color);
    color[3] *= opacity;
    const foreground = blend(color, background);
    const luminance = (rgb) => rgb.map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
}

test.use({ reducedMotion: "reduce" });

test("las listas de productos del asistente son legibles en ambos modos", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  for (const theme of ["dark", "light"]) {
    if (theme === "light") await page.getByRole("button", { name: "Activar modo claro" }).click();
    await page.getByRole("button", { name: "Abrir asistente de El Lirio" }).click();
    const frame = page.frameLocator('iframe[title="Asistente de El Lirio en Streamlit"]');
    await expect(frame.locator(".stApp")).toHaveCSS("background-color", theme === "dark" ? "rgb(23, 18, 21)" : "rgb(255, 255, 255)");
    await frame.getByRole("button", { name: "¿Qué productos tienen?", exact: true }).click({ timeout: 30000 });
    await expect(frame.getByText("Esto figura en el catálogo:", { exact: true })).toBeVisible({ timeout: 30000 });
    const items = frame.locator('[data-testid="stChatMessage"] li');
    await expect(items.first()).toBeVisible();
    for (const item of await items.all()) {
      await item.scrollIntoViewIfNeeded();
      expect(await contrast(item)).toBeGreaterThanOrEqual(4.5);
    }
    for (const highlighted of await frame.locator('[data-testid="stChatMessage"] li :is(strong, em, a)').all()) expect(await contrast(highlighted)).toBeGreaterThanOrEqual(4.5);
    for (const note of await frame.locator('[data-testid="stCaptionContainer"] p').all()) expect(await contrast(note)).toBeGreaterThanOrEqual(4.5);
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  }
});

test("catálogo, bolsa y formularios conservan textos con contraste en oscuro", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/tienda");
  await expect(page.locator(".product-card").first()).toBeVisible();
  expect(await contrast(page.locator(".product-info h3").first())).toBeGreaterThanOrEqual(4.5);
  await page.locator(".product-card .add-btn").first().click();
  await page.getByRole("button", { name: /Abrir bolsa con/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (const selector of ["h2", ".cart-item-info > strong", ".cart-total > strong", ".btn.primary", ".text-button"]) expect(await contrast(dialog.locator(selector).first())).toBeGreaterThanOrEqual(4.5);
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  for (const path of ["/login", "/registro", "/recuperar"]) {
    await page.goto(path);
    await expect(page.locator(".auth-card")).toBeVisible();
    expect(await contrast(page.locator(".auth-card h2"))).toBeGreaterThanOrEqual(4.5);
    for (const label of await page.locator(".auth-card label").all()) expect(await contrast(label)).toBeGreaterThanOrEqual(4.5);
  }
});
