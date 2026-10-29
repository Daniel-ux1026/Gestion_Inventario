"""Connect the existing local publisher to its fixed workers.dev address."""
from __future__ import annotations

import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import uuid

ROOT = Path(__file__).resolve().parent
DATA = ROOT / ".data"
SETTINGS = DATA / "direccion_fija.json"
WORKER = ROOT / "cloudflare"
CONFIG = WORKER / "wrangler.jsonc"


def fixed_url():
    if not SETTINGS.exists():
        return None
    value = json.loads(SETTINGS.read_text(encoding="utf-8")).get("url", "")
    if not re.fullmatch(r"https://[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev", value):
        raise RuntimeError("La direccion fija configurada debe ser un enlace HTTPS de workers.dev.")
    return value


def _wrangler(*arguments):
    cli = WORKER / "node_modules/wrangler/bin/wrangler.js"
    node = shutil.which("node")
    if not node or not cli.is_file():
        raise RuntimeError("Instala Node.js y ejecuta npm ci en la carpeta cloudflare para actualizar la direccion fija.")
    env = os.environ.copy()
    env["WRANGLER_SEND_METRICS"] = "false"
    result = subprocess.run([node, str(cli), *arguments, "--config", str(CONFIG)], cwd=WORKER,
                            env=env, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=60)
    if result.returncode:
        raise RuntimeError("No se pudo actualizar la direccion fija. Comprueba la sesion de Cloudflare con wrangler whoami.")
    return result.stdout.strip()


def _save(value):
    DATA.mkdir(parents=True, exist_ok=True)
    path = DATA / ("worker-origin-" + uuid.uuid4().hex + ".json")
    try:
        path.write_text(json.dumps(value), encoding="utf-8")
        _wrangler("kv", "key", "put", "active", "--path", str(path), "--binding", "LIRIO_ORIGIN", "--remote")
    finally:
        path.unlink(missing_ok=True)


def connect(origin, run_id):
    address = fixed_url()
    if not address:
        return origin
    if not re.fullmatch(r"https://[a-z0-9-]+\.trycloudflare\.com", origin):
        raise RuntimeError("El destino debe ser el tunel HTTPS generado por Cloudflare.")
    _save({"origin": origin, "runId": run_id})
    return address


def disconnect(run_id):
    if not fixed_url():
        return
    output = _wrangler("kv", "key", "get", "active", "--binding", "LIRIO_ORIGIN", "--remote", "--text")
    current = json.loads(output)
    # Closing an older execution must not disconnect a newer publisher.
    if current.get("runId") == run_id:
        _save({"origin": None, "runId": run_id})
