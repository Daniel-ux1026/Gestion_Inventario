import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("..");
const out = path.join(root, "docs", "images");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1050 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (e) =>
  process.stderr.write("BROWSER ERROR: " + e.message + "\n"),
);
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(out, "tienda.png"),
  animations: "disabled",
});
await page.goto("http://127.0.0.1:5173/tienda", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(out, "catalogo.png"),
  animations: "disabled",
});
await page.goto("http://127.0.0.1:5173/login", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Como administrador" }).click();
await page.getByRole("button", { name: "Entrar a mi cuenta" }).click();
await page.waitForURL("**/admin");
await page.getByText("El ritmo de tus ventas").waitFor();
await page.waitForTimeout(900);
await page.screenshot({
  path: path.join(out, "dashboard.png"),
  animations: "disabled",
});
await page.goto("http://127.0.0.1:5173/admin/inventario", {
  waitUntil: "networkidle",
});
await page.getByText("LIR-001", { exact: true }).waitFor();
await page.screenshot({
  path: path.join(out, "inventario.png"),
  animations: "disabled",
});
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/admin", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(out, "movil-dashboard.png"),
  animations: "disabled",
  fullPage: true,
});
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(out, "movil-tienda.png"),
  animations: "disabled",
  fullPage: true,
});
await page.setViewportSize({ width: 900, height: 1200 });
await page.goto("http://127.0.0.1:8501/", { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: "¿Cómo contacto con la empresa?" })
  .click();
await page
  .getByText(
    "Una persona de El Lirio de los Valles te ayudará con tu consulta.",
    { exact: false },
  )
  .waitFor();
await page
  .getByRole("heading", { name: "Hola, ¿en qué te ayudamos?" })
  .scrollIntoViewIfNeeded();
await page.screenshot({
  path: path.join(out, "chatbot.png"),
  animations: "disabled",
  fullPage: true,
});
await browser.close();
console.log("Screenshots:", out);
