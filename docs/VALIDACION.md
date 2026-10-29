# Validación de la entrega

Fecha: 28 de octubre de 2026. Entorno: Windows, Java 21.0.10, Node 24.18, Python 3.14.6. Los datos de prueba están separados de cualquier MySQL existente.

| Verificación | Resultado |
|---|---|
| Contexto y API Java | 19 pruebas, 0 errores |
| Chatbot por reglas | 8 pruebas, 0 errores |
| Navegador en escritorio y móvil | 12 pruebas, 0 errores |
| Coordinación de inicio y cierre | 5 pruebas, 0 errores |
| Accesos de Windows (.bat) | Inicio, cierre y reinicio correctos; los tres puertos quedan libres |
| Compilación de React | Correcta |
| Auditoría npm tras parches compatibles | 0 vulnerabilidades |
| Capturas reales | Tienda, catálogo, panel, inventario, móvil y Streamlit |
| Docker y MySQL | Motor Docker no iniciado; ejecución pendiente |

Las pruebas Java cubren permisos, registro sin escalamiento de rol, JWT, precios y descuentos, totales manipulados, stock insuficiente, productos duplicados, idempotencia, aprobación y rechazo, comprobantes privados, recepción de compras, ajustes y archivado.

Las pruebas de navegador cubren búsqueda, categorías, favoritos, permisos, registro de cliente, bolsa con cantidades, compra en efectivo, seguimiento, períodos del panel, tema oscuro, navegación móvil, creación/ajuste/archivado de producto y la pregunta de contacto en Streamlit.

La verificación visual incluye las capturas en docs/images. La prueba móvil usa Chromium con viewport táctil 390 × 844; no sustituye una prueba física en Safari de iPhone.

La validación no incluye SMTP con credenciales reales, pagos bancarios, facturación electrónica ni despliegue público. Los pagos se confirman manualmente.

Se verifica también que los pedidos y reportes usan America/Lima aunque el host de pruebas utilice UTC.

Se ejecutaron **INICIAR_PROYECTO.bat** y **DETENER_PROYECTO.bat** desde otra carpeta: los tres servicios respondieron, un segundo inicio fue rechazado sin alterar la ejecución activa y la detención liberó los puertos **8080, 5173 y 8501**. Una segunda detención no produjo errores. También se comprobó volver a iniciar y detener durante el arranque del backend. El acceso anterior **INICIAR_LIRIO.cmd** se conserva como acceso al mismo iniciador.

La coordinación usa un bloqueo local y un identificador por ejecución. Una solicitud antigua no detiene una ejecución nueva. El cierre solo se aplica a los procesos creados por el iniciador; no se buscan ni cierran otras aplicaciones por nombre o puerto.
