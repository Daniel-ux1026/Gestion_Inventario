const QUICK_HOST = /^[a-z0-9-]+\.trycloudflare\.com$/;

export function originUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && QUICK_HOST.test(url.hostname) &&
      !url.username && !url.password && !url.port && url.pathname === "/" &&
      !url.search && !url.hash ? url : null;
  } catch {
    return null;
  }
}

function unavailable(request) {
  const message = "La tienda no está disponible en este momento. Vuelve a intentarlo en unos minutos.";
  const headers = { "Cache-Control": "no-store", "Retry-After": "30", "X-Content-Type-Options": "nosniff" };
  if (new URL(request.url).pathname.startsWith("/api/")) {
    return Response.json({ message }, { status: 503, headers });
  }
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>El Lirio</title><style>body{margin:0;background:#f6f4ed;color:#354b3b;font:18px system-ui;display:grid;place-items:center;min-height:100vh}main{max-width:480px;margin:24px;padding:36px;border:1px solid white;border-radius:28px;background:#ffffff80}p{line-height:1.6}h1{font-size:36px}a{color:inherit}</style><main><h1>Volvemos pronto.</h1><p>${message}</p><p>Gracias por visitar El Lirio.</p></main></html>`,
    { status: 503, headers: { ...headers, "Content-Type": "text/html;charset=UTF-8" } });
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    if (incoming.hostname !== env.PUBLIC_HOST) return new Response("Not found", { status: 404 });
    const browserOrigin = request.headers.get("Origin");
    // Validate before rewriting Origin for the upstream Streamlit WebSocket handshake.
    if (browserOrigin && browserOrigin !== incoming.origin) {
      return new Response("Origen no permitido", { status: 403 });
    }
    try {
      const saved = await env.LIRIO_ORIGIN.get("active", { type: "json", cacheTtl: 30 });
      const target = originUrl(saved?.origin);
      if (!target) return unavailable(request);
      target.pathname = incoming.pathname;
      target.search = incoming.search;
      const headers = new Headers(request.headers);
      headers.delete("Host");
      if (browserOrigin) headers.set("Origin", target.origin);
      const referer = headers.get("Referer");
      if (referer?.startsWith(incoming.origin + "/")) {
        headers.set("Referer", target.origin + referer.slice(incoming.origin.length));
      }
      const forwarded = new Request(target, {
        method: request.method, headers, redirect: "manual",
        ...(!["GET", "HEAD"].includes(request.method) ? { body: request.body, duplex: "half" } : {}),
      });
      const upstream = await fetch(forwarded);
      if (upstream.status === 101) return upstream;
      if (upstream.status >= 500) return unavailable(request);
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("Cache-Control", "no-store");
      responseHeaders.set("X-Content-Type-Options", "nosniff");
      responseHeaders.delete("Access-Control-Allow-Origin");
      responseHeaders.delete("Access-Control-Allow-Credentials");
      const location = responseHeaders.get("Location");
      if (location) {
        const redirected = new URL(location, target);
        if (redirected.hostname === target.hostname) {
          responseHeaders.set("Location", incoming.origin + redirected.pathname + redirected.search + redirected.hash);
        }
      }
      return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
    } catch {
      return unavailable(request);
    }
  },
};
