# Validación de la entrega

Actualizado: 29 de octubre de 2026. Entorno: Windows, Java 21.0.10, Node 24.18, Python 3.14.6 y Docker Desktop. Los datos de prueba están separados de cualquier MySQL existente y de la demostración H2 local.

| Verificación | Resultado |
|---|---|
| Contexto y API Java | 20 pruebas, 0 errores |
| Chatbot por reglas | 8 pruebas, 0 errores |
| Navegador en escritorio y móvil | 12 pruebas, 0 errores |
| Scripts de inicio, cierre y publicación | 8 pruebas, 0 errores |
| Accesos de Windows (.bat) | Inicio, cierre y reinicio correctos; los tres puertos quedan libres |
| Compilación de React | Correcta |
| Auditoría npm tras parches compatibles | 0 vulnerabilidades |
| Capturas reales | Tienda, catálogo, panel, inventario, móvil y Streamlit |
| Docker y MySQL | Servicios ejecutados y persistencia comprobada |
| Cloudflare Quick Tunnel | HTTPS y 12 pruebas de navegador correctos |

Las pruebas Java cubren permisos, registro sin escalamiento de rol, JWT, precios y descuentos, totales manipulados, stock insuficiente, productos duplicados, idempotencia, aprobación y rechazo, comprobantes privados, recepción de compras, ajustes y archivado.

Las pruebas de navegador cubren búsqueda, categorías, favoritos, permisos, registro de cliente, bolsa con cantidades, compra en efectivo, seguimiento, períodos del panel, tema oscuro, navegación móvil, creación/ajuste/archivado de producto y la pregunta de contacto en Streamlit.

La verificación visual incluye las capturas en docs/images. La prueba móvil usa Chromium con viewport táctil 390 × 844; no sustituye una prueba física en Safari de iPhone.

La validación no incluye SMTP con credenciales reales, pagos bancarios ni facturación electrónica. Los pagos se confirman manualmente. La publicación comprobada es temporal y está destinada a pruebas; no valida disponibilidad continua de un alojamiento de producción.

Se verifica también que los pedidos y reportes usan America/Lima aunque el host de pruebas utilice UTC.

Se ejecutaron **INICIAR_PROYECTO.bat** y **DETENER_PROYECTO.bat** desde otra carpeta: los tres servicios respondieron, un segundo inicio fue rechazado sin alterar la ejecución activa y la detención liberó los puertos **8080, 5173 y 8501**. Una segunda detención no produjo errores. También se comprobó volver a iniciar y detener durante el arranque del backend. El acceso anterior **INICIAR_LIRIO.cmd** se conserva como acceso al mismo iniciador.

La coordinación usa un bloqueo local y un identificador por ejecución. Una solicitud antigua no detiene una ejecución nueva. El cierre solo se aplica a los procesos creados por el iniciador; no se buscan ni cierran otras aplicaciones por nombre o puerto.

## Prueba pública con Cloudflare y MySQL

Se comprobó el acceso público por HTTPS con Nginx, React, Spring Boot, MySQL 8.4 y Streamlit. Las 12 pruebas de escritorio y móvil pasaron a través de la dirección de Cloudflare, incluidos registro, pedido en efectivo, permisos, edición de inventario y la respuesta de contacto del chatbot.

También se creó un pedido ficticio con una imagen PNG: el comprobante fue accesible para su propietario y quedó protegido sin sesión; un cliente no pudo acceder a las rutas de administración. Repetir la aprobación no volvió a descontar stock. Los accesos del demo local fueron rechazados en la instancia pública.

**DETENER_PROYECTO.bat** cerró el túnel y el proyecto de Docker y liberó el puerto 8088. Al volver a compartir se generó otra dirección HTTPS y se verificó que el pedido, el stock, el comprobante y el acceso del administrador se conservaron. El perfil público carga productos de muestra sin crear las cuentas ni los pedidos históricos de la demostración local.
