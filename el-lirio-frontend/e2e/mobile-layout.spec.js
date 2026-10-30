import { test, expect } from "@playwright/test";

const product = {
  id: 1,
  nombre: "Arroz extra de grano largo para tu despensa",
  categoria: "Abarrotes",
  descripcion: "Un producto para comprobar el diseño móvil.",
  precio: 4.5,
  stock: 20,
  unidad: "Unidad",
  imagen: "/lirio-logo.jpg",
};

async function prepare(page, theme) {
  await page.addInitScript((theme) => {
    sessionStorage.setItem("lirio.token", "sesion-simulada-de-diseno");
    localStorage.setItem("lirio.theme", theme);
    localStorage.setItem("lirio.cart", JSON.stringify([{ id: 1, qty: 1 }]));
  }, theme);
  await page.route("**/api/v1/**", async (route) => {
    // Layout tests use fixtures; they never register customers or place orders.
    expect(route.request().method()).toBe("GET");
    const path = new URL(route.request().url()).pathname;
    const fixtures = {
      "/api/v1/catalog": [product],
      "/api/v1/business": { nombre: "Lirio", direccion: "Recojo en tienda", telefono: "900000000" },
      "/api/v1/health": { demo: false, demoAccounts: false },
      "/api/v1/auth/me": {
        id: 1,
        nombre: "Prueba",
        apellido: "Móvil",
        email: "movil@example.test",
        rol: "CLIENTE",
        telefono: "900000000",
      },
    };
    expect(fixtures[path], "Endpoint esperado: " + path).toBeDefined();
    await route.fulfill({ json: fixtures[path] });
  });
}

async function fits(page) {
  expect(await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    scrollX,
  }))).toEqual({ width: page.viewportSize().width, viewport: page.viewportSize().width, scrollX: 0 });
  expect(await page.locator(".checkout-grid").evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
}

for (const theme of ["light", "dark"]) {
  for (const width of [320, 360, 390, 402, 440, 756]) {
    test(`pago estable a ${width}px en ${theme}, incluso con comprobante largo`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 756 ? 352 : 681 });
      await prepare(page, theme);
      await page.goto("/checkout");
      const payment = page.locator(".payment-options");
      await expect(payment).toBeVisible();
      const original = await payment.boundingBox();
      for (const method of ["Efectivo", "Yape", "Plin", "Transferencia"]) {
        await payment.locator("label").filter({ hasText: new RegExp("^" + method + "$") }).click();
        await expect(page.getByRole("radio", { name: method, exact: true })).toBeChecked();
        await fits(page);
        const current = await payment.boundingBox();
        expect(Math.abs(current.x - original.x)).toBeLessThan(1);
        expect(Math.abs(current.width - original.width)).toBeLessThan(1);
      }
      const name = "comprobante_" + "transferencia_".repeat(12) + ".png";
      await page.locator('input[type="file"]').setInputFiles({
        name,
        mimeType: "image/png",
        buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGN4pm37HwAFlwJOwwTb6AAAAABJRU5ErkJggg==", "base64"),
      });
      await expect(page.locator(".upload-label > strong")).toHaveText(name);
      await expect(page.locator(".receipt-preview")).toBeVisible();
      await expect(page.locator(".receipt-preview")).toHaveJSProperty("naturalWidth", 1);
      await fits(page);
      const afterUpload = await payment.boundingBox();
      expect(Math.abs(afterUpload.width - original.width)).toBeLessThan(1);
      for (const field of await page.locator('.checkout-page input:not([type="radio"]), .checkout-page textarea').all()) {
        expect(await field.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
      }
      await page.getByRole("radio", { name: "Efectivo", exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("radio", { name: "Yape", exact: true })).toBeChecked();
      await fits(page);
    });
  }
}
