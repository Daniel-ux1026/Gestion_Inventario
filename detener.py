"""Ask the current launcher to close only the services it owns."""
from __future__ import annotations

import sys
import time

from ejecucion import STATE, REQUEST, read_json, write_json


def main():
    state = read_json(STATE)
    identifier = state.get("id")
    if state.get("status") == "stopped" and state.get("errors"):
        print("La ultima detencion no pudo cerrar todos los servicios: "
              + "; ".join(state["errors"]) + ". Revisa los registros de .data/.", file=sys.stderr)
        return 1
    if not identifier or state.get("status") != "running":
        print("El proyecto ya esta detenido. No hay servicios que cerrar.")
        return 0
    write_json(REQUEST, {"id": identifier})
    print("Deteniendo la web, el backend y el chatbot de El Lirio...", flush=True)
    deadline = time.monotonic() + 45
    while time.monotonic() < deadline:
        current = read_json(STATE)
        if current.get("id") != identifier:
            print("La ejecucion solicitada se detuvo; hay una nueva ejecucion independiente.")
            return 0
        if current.get("status") == "stopped":
            errors = current.get("errors", [])
            if errors:
                print("No se pudo completar el cierre: " + "; ".join(errors), file=sys.stderr)
                return 1
            print("Proyecto detenido correctamente: web, backend y chatbot cerrados.")
            return 0
        time.sleep(0.25)
    print("El iniciador no confirmo el cierre. Revisa su ventana y los registros de .data/. "
          "No se han cerrado procesos ajenos al proyecto.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError) as error:
        print("No se pudo solicitar la detencion: " + str(error), file=sys.stderr)
        sys.exit(1)
