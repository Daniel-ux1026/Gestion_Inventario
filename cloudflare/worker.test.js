import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { originUrl } from "./worker.js";

const host = "lirio-tienda.daniel-olivos.workers.dev";
const base = "https://" + host;
const origin = "https://prueba-lirio.trycloudflare.com";
const environment = (value = origin) => ({ PUBLIC_HOST: host, LIRIO_ORIGIN: { get: async () => ({ origin: value }) } });

test("only HTTPS Quick Tunnel origins are accepted", () => {
  assert.ok(originUrl(origin));
  for (const value of ["http://prueba.trycloudflare.com", "https://prueba.trycloudflare.com.ejemplo.com", "https://user:pass@prueba.trycloudflare.com", "https://127.0.0.1", origin + "/api", origin + ":8443"])
    assert.equal(originUrl(value), null);
});

test("unknown host and foreign browser origins cannot reach the upstream", async () => {
  assert.equal((await worker.fetch(new Request("https://otro.workers.dev/"), environment())).status, 404);
  const request = new Request(base + "/api/v1/orders", { method: "POST", headers: { Origin: "https://otro.ejemplo" }, body: "{}" });
  assert.equal((await worker.fetch(request, environment())).status, 403);
});

test("path, JSON body, authorization and cookies survive the proxy", async (t) => {
  let received;
  t.mock.method(globalThis, "fetch", async (request) => { received = request; return Response.json({ ok: true }); });
  const request = new Request(base + "/api/v1/orders?q=1", {
    method: "POST", headers: { Origin: base, Authorization: "Bearer prueba", Cookie: "sesion=prueba" }, body: '{"cantidad":2}',
  });
  const response = await worker.fetch(request, environment());
  assert.equal(received.url, origin + "/api/v1/orders?q=1");
  assert.equal(received.headers.get("Origin"), origin);
  assert.equal(received.headers.get("Authorization"), "Bearer prueba");
  assert.equal(received.headers.get("Cookie"), "sesion=prueba");
  assert.equal(await received.text(), '{"cantidad":2}');
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("redirects retain the public address", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 302, headers: { Location: origin + "/chatbot/" } }));
  const response = await worker.fetch(new Request(base + "/chatbot"), environment());
  assert.equal(response.headers.get("Location"), base + "/chatbot/");
});

test("stopped or unreachable origins return a private maintenance response", async (t) => {
  const request = new Request(base + "/api/v1/health");
  assert.equal((await worker.fetch(request, environment(null))).status, 503);
  t.mock.method(globalThis, "fetch", async () => { throw new Error("private upstream diagnostic"); });
  const response = await worker.fetch(request, environment());
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("private upstream"), false);
});

test("WebSocket upgrade responses pass through unchanged", async (t) => {
  const upgraded = { status: 101 };
  t.mock.method(globalThis, "fetch", async () => upgraded);
  const request = new Request(base + "/chatbot/_stcore/stream", { headers: { Origin: base, Upgrade: "websocket" } });
  assert.equal(await worker.fetch(request, environment()), upgraded);
});
