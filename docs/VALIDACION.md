# Validación de la entrega

Fecha: 28 de octubre de 2026. Entorno: Windows, Java 21.0.10, Node 24.18, Python 3.14.6. Los datos de prueba están separados de cualquier MySQL existente.

| Verificación | Resultado |
|---|---|
| Contexto y API Java | 19 pruebas, 0 errores |
| Chatbot por reglas | 8 pruebas, 0 errores |
| Navegador en escritorio y móvil | 12 pruebas, 0 errores |
| Compilación de React | Correcta |
| Auditoría npm tras parches compatibles | 0 vulnerabilidades |
| Capturas reales | Tienda, catálogo, panel, inventario, móvil y Streamlit |
| Docker y MySQL | Motor Docker no iniciado; ejecución pendiente |

Las pruebas Java cubren permisos, registro sin escalamiento de rol, JWT, precios y descuentos, totales manipulados, stock insuficiente, productos duplicados, idempotencia, aprobación y rechazo, comprobantes privados, recepción de compras, ajustes y archivado.

Las pruebas de navegador cubren búsqueda, categorías, favoritos, permisos, registro de cliente, bolsa con cantidades, compra en efectivo, seguimiento, períodos del panel, tema oscuro, navegación móvil, creación/ajuste/archivado de producto y la pregunta de contacto en Streamlit.

La verificación visual incluye las capturas en docs/images. La prueba móvil usa Chromium con viewport táctil 390 × 844; no sustituye una prueba física en Safari de iPhone.

La validación no incluye SMTP con credenciales reales, pagos bancarios, facturación electrónica ni despliegue público. Los pagos se confirman manualmente.

Se verifica también que los pedidos y reportes usan America/Lima aunque el host de pruebas utilice UTC.
