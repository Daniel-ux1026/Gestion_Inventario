"""Deterministic customer support. Reads only the public catalog; never performs payments."""
from __future__ import annotations
import os
import re
import unicodedata
from decimal import Decimal, ROUND_HALF_UP
import requests

PHONE = "948656772"
QUESTIONS = [
    "¿Qué productos tienen?",
    "¿Cómo hago un pedido?",
    "¿Cómo puedo pagar?",
    "¿Cómo recojo mi pedido?",
    "¿Cuál es el horario?",
    "¿Cómo contacto con la empresa?",
]
CONTACT = "¿Deseas contactar con la empresa? Llama al **948656772**. Una persona de El Lirio de los Valles te ayudará con tu consulta."

def normalize(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")

def catalog() -> list[dict] | None:
    try:
        response = requests.get(os.environ.get("LIRIO_API_URL", "http://127.0.0.1:8080/api/v1").rstrip("/") + "/catalog", timeout=4)
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, list):
            return None
        return [p for p in data if isinstance(p, dict) and all(k in p for k in ("nombre", "precio", "stock"))]
    except (requests.RequestException, ValueError):
        return None

def business() -> dict:
    try:
        response = requests.get(os.environ.get("LIRIO_API_URL", "http://127.0.0.1:8080/api/v1").rstrip("/") + "/business", timeout=4)
        response.raise_for_status()
        data = response.json()
        return data if isinstance(data, dict) else {}
    except (requests.RequestException, ValueError):
        return {}

def safe(text: str) -> str:
    return re.sub(r"([\\\x60*_[\]{}()#+.!<>|])", r"\\\1", str(text))

def answer(question: str, products: list[dict] | None = None, store: dict | None = None) -> str:
    q = normalize(question[:500])
    if any(w in q for w in ["contact", "telefon", "numero", "llamar", "llame", "humano", "persona", "comunicar"]):
        return CONTACT
    if any(w in q for w in ["horario", "hora abren", "hora cierran", "abierto"]):
        hours = (store or {}).get("horario", "").strip()
        if hours and "consulta" not in normalize(hours):
            return "El horario informado por la tienda es: **" + safe(hours) + "**. Para confirmar atención en feriados, llama al **948656772**."
        return "La tienda aún no ha publicado un horario confirmado. Puedes consultarlo llamando al **948656772**."
    if any(w in q for w in ["pagar", "pago", "yape", "plin", "transferencia", "efectivo"]):
        return "Puedes elegir **efectivo al recoger**, **Yape**, **Plin** o **transferencia**. Antes de un pago digital, confirma el número o cuenta y el titular con la tienda al **948656772**. Adjunta tu comprobante al registrar el pedido; el administrador revisará el abono. Nunca compartas claves ni códigos."
    if any(w in q for w in ["recojo", "recoger", "entrega", "delivery", "direccion", "ubicacion", "envio"]):
        address = (store or {}).get("direccion", "").strip()
        place = " La dirección publicada es: **" + safe(address) + "**." if address else " La tienda confirmará contigo el punto de recojo."
        return "Los pedidos se registran para **recojo en tienda**." + place + " Para consultar horarios u otra modalidad de entrega, llama al **948656772** antes de pagar."
    if any(w in q for w in ["pedido", "comprar", "compra", "bolsa", "carrito", "registr", "cuenta"]):
        return "Tu próxima compra, en 4 pasos:\n\n1. Explora **La tienda** y añade productos a tu bolsa.\n2. Inicia sesión o crea una cuenta.\n3. Revisa cantidades y elige cómo pagar.\n4. Confirma el pedido y consulta su estado en **Mis pedidos**.\n\nLa tienda valida el pago antes de aprobarlo. Si ya pagaste y tu pedido fue rechazado, llama al **948656772** para coordinar la revisión o devolución."
    if any(w in q for w in ["hola", "buenos dias", "buenas", "ayuda"]):
        return "¡Hola! Soy el asistente de **El Lirio**. Puedo orientarte sobre productos, pedidos, pagos, recojo y contacto con la tienda. Elige una pregunta o dime qué producto buscas."
    if any(w in q for w in ["producto", "stock", "precio", "oferta", "tienen", "hay", "arroz", "aceite", "atun", "cafe", "fideo", "jabon", "limpi", "pasta"]):
        if products is None:
            return "No puedo consultar el catálogo en este momento. Revisa **La tienda** o llama al **948656772** para confirmar precios y disponibilidad."
        tokens = {w for w in re.findall(r"[a-z0-9]+", q) if len(w) > 2} - {"que","los","las","del","una","unos","tienen","productos","producto","precio","precios","stock","hay","cuanto","cuesta","ofertas","oferta","para","con","por","busco","quiero"}
        matches = [p for p in products if not tokens or any(t in normalize(p["nombre"]) for t in tokens)]
        if "oferta" in q:
            matches = [p for p in matches if p.get("descuento", 0) > 0]
        if not matches:
            return "No encontré ese producto en el catálogo actual. Prueba con otro nombre o llama al **948656772** para consultar una alternativa."
        rows = []
        for p in matches[:6]:
            price = Decimal(str(p["precio"])).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            stock = int(p["stock"])
            rows.append("- **" + safe(p["nombre"]) + "** · S/ " + str(price) + " · " + (str(stock) + " unidades disponibles" if stock > 0 else "agotado"))
        return "Esto figura en el catálogo:\n\n" + "\n".join(rows) + "\n\nLos precios y el stock pueden cambiar; el total se vuelve a verificar al registrar el pedido."
    return "Puedo ayudarte con **productos, pedidos, pagos, recojo, horarios y contacto** de El Lirio. Para una consulta diferente o atención personal, llama al **948656772**."
