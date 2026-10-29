# Dirección gratuita y fija de El Lirio

La dirección de esta instalación es **https://lirio-tienda.daniel-olivos.workers.dev**. Es un subdominio gratuito asignado por Cloudflare, no un dominio registrado a nombre del negocio.

## Uso diario

1. Enciende el equipo y abre Docker Desktop.
2. Ejecuta **COMPARTIR_PROYECTO.bat**. Cuando confirme que está listo, comparte siempre la dirección fija.
3. Usa **DETENER_PROYECTO.bat** para cerrar la publicación. Los datos y la dirección se conservan.

El iniciador actualiza la conexión de Cloudflare automáticamente. Puede tardar alrededor de medio minuto en propagarse. Cuando el equipo o los servicios están apagados, la misma dirección muestra un aviso temporal; la tienda vuelve al iniciar el proyecto.

Mientras está abierto, el iniciador comprueba la conexión cada 20 segundos. Si el túnel desaparece aunque su proceso siga ejecutándose, tres comprobaciones fallidas consecutivas con la API local sana activan la reconexión. Si el proceso termina, la siguiente comprobación activa la recuperación. Se crea un túnel interno nuevo y se actualiza la misma dirección pública. Los contenedores usan las imágenes existentes y conservan sus volúmenes y credenciales.

Un fallo aislado no cambia el túnel. Si no hay conexión para recuperarlo, el iniciador reintenta después de 60 segundos y mantiene los servicios locales. **DETENER_PROYECTO.bat** también permite cancelar estos reintentos. La recuperación puede tardar unos minutos según la red y la propagación de Cloudflare.

No necesitas reconstruir el proyecto en cada inicio: se reutilizan las imágenes existentes. Para publicar cambios de la aplicación expresamente, ejecuta **python compartir.py --reconstruir**. Una primera instalación sin imágenes construye los contenedores automáticamente.

## Funcionamiento

El Worker **lirio-tienda** conserva la dirección pública y envía las solicitudes al túnel temporal activo. El registro KV **lirio-tienda-origin** guarda únicamente la dirección del túnel y el identificador de ejecución, sin contraseñas ni datos de clientes. Los WebSockets del chatbot se transmiten por el mismo origen HTTPS.

El destino está limitado a túneles HTTPS de trycloudflare.com. El proxy rechaza orígenes de navegador ajenos antes de adaptar las cabeceras para Streamlit. Al cerrar la ejecución, se desactiva su conexión sin afectar una ejecución más reciente.

## Configuración de esta instalación

**.data/direccion_fija.json** activa la dirección fija y contiene solo su URL. No se incluye en Git. La autenticación de Wrangler permanece en el almacén local del usuario y nunca se copia al repositorio.

En otro equipo, instala Node.js, ejecuta **npm ci** en la carpeta **cloudflare**, inicia sesión con **npx wrangler login** en la cuenta propietaria y crea **.data/direccion_fija.json** con el campo **url** correspondiente. La aplicación MySQL y sus comprobantes requieren sus propios respaldos y volúmenes; la dirección de Cloudflare no almacena esos datos.

## Verificación y límites

**node --test cloudflare/worker.test.js** comprueba validación de destinos, protección de origen, envío de cuerpo y autenticación, redirecciones, mantenimiento y transmisión de WebSockets. **python -m unittest discover -s tests** comprueba los iniciadores y la actualización segura de la conexión.

La configuración usa Workers y KV gratuitos dentro de sus cuotas. No se compró un dominio ni se contrató un plan de pago. El equipo sigue siendo el servidor de Java, MySQL y Streamlit, por lo que debe permanecer encendido para atender clientes.

El túnel interno sigue siendo un Quick Tunnel para pruebas: Cloudflare no garantiza su disponibilidad. La dirección fija conserva el nombre público y la reconexión automática permite recuperarlo cuando un túnel deja de ser válido.

Verificación del 29 de octubre de 2026: pasaron las 6 pruebas del proxy, 14 de los scripts y las 12 de escritorio y móvil con la dirección fija. Se detuvo y reinició la publicación: cambió el túnel interno, se mantuvo la misma dirección pública y se conservaron pedidos, stock y un comprobante privado. El chatbot volvió a conectar por WebSocket. Al detener el proyecto se comprobó la respuesta de mantenimiento con estado HTTP 503.

Corrección posterior del mismo día: el proceso de cloudflared seguía abierto, pero su registro mostraba **Unauthorized: Tunnel not found** y el nombre interno ya no resolvía. Se añadió la comprobación de salud y la recuperación automática. Pasaron las 20 pruebas de los scripts, incluidos la pérdida de un túnel con el proceso vivo, los fallos intermitentes, los reintentos y su cancelación. Una interrupción controlada del túnel real confirmó la reconexión sin intervención manual, con la misma dirección y sin cambios en pedidos, stock ni el comprobante; también se verificaron el acceso de administrador y el chatbot desde un navegador móvil.

[Direcciones workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), [límites gratuitos de KV](https://developers.cloudflare.com/kv/platform/limits/), [limitaciones de Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).
