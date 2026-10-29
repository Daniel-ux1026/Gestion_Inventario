# Pruebas gratuitas con Cloudflare Quick Tunnel

Esta instalación también admite una [dirección gratuita y fija de workers.dev](DIRECCION_FIJA.md), que permanece igual al reiniciar el proyecto. Cuando **.data/direccion_fija.json** está configurado, **COMPARTIR_PROYECTO.bat** actualiza automáticamente su conexión con el túnel temporal.

La tienda, la API Java y Streamlit comparten una dirección HTTPS temporal. La aplicación se ejecuta en Docker en tu equipo; Cloudflare conecta esa aplicación con las personas que abren el enlace. No necesitas comprar un dominio ni contratar alojamiento.

## Compartir con clientes

1. Inicia Docker Desktop y espera que su motor esté listo. Necesitas también Python 3.11 o superior.
2. Abre **COMPARTIR_PROYECTO.bat**. En la primera ejecución se descargan las imágenes de Docker y el ejecutable oficial de Cloudflare; puede tardar varios minutos. El ejecutable descargado se verifica con SHA-256.
3. Comparte exclusivamente la dirección de **.data/enlace_publico.txt**. Los clientes pueden crear sus cuentas desde la tienda.
4. Cuando termines, abre **DETENER_PROYECTO.bat**. Detiene el túnel y los contenedores de esa prueba, conservando los datos.

Desde una terminal puedes usar **python compartir.py** y **python detener.py**. Para ejecutar sin abrir el navegador: **python compartir.py --sin-abrir**.

## Datos y acceso

- La prueba usa su propio proyecto de Docker y volúmenes de MySQL y comprobantes. No importa tu H2 local ni el volcado SQL antiguo.
- Incluye 24 productos de muestra. No carga las cuentas ni los pedidos históricos del demo local.
- Las contraseñas de MySQL, la clave JWT y la contraseña del administrador se generan aleatoriamente y se conservan en **.data/cloudflare.env** para los siguientes arranques.
- Tu acceso administrativo está en **.data/ACCESO_ADMINISTRADOR.txt**. Usa el formulario de inicio de sesión de la web. Ese archivo y la carpeta **.data** son privados y están excluidos de Git y del ZIP de código.
- El puerto web escucha únicamente en **127.0.0.1:8088**. MySQL, Java y Streamlit se comunican por la red interna de Docker.
- El catálogo, las fotografías y el chatbot usan rutas del mismo origen. Los visitantes no necesitan acceder al localhost de su propio equipo.
- **INICIAR_PROYECTO.bat** mantiene la demostración local original. Cierra esa ejecución antes de usar **COMPARTIR_PROYECTO.bat**, o viceversa.

## Duración y límites

Mantén encendidos tu equipo, Docker Desktop y el iniciador mientras los clientes prueban la web. El enlace deja de funcionar al detener el túnel y cambia al volver a compartir. Quick Tunnel está destinado a pruebas y no garantiza disponibilidad. Admite hasta 200 solicitudes simultáneas y no admite SSE; este chatbot utiliza WebSockets.

Los precios y productos son ejemplos. Los pagos se validan manualmente; no se conectó ninguna pasarela bancaria. La recuperación de contraseña por correo sigue requiriendo configurar SMTP.

Registros de diagnóstico: **.data/publicar-salida.log**, **.data/publicar-error.log**, **.data/cloudflare.log**, **.data/docker-build.log** y **.data/docker-stop.log**. No compartas el archivo de variables ni las credenciales al solicitar ayuda.

[Documentación oficial de Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).
