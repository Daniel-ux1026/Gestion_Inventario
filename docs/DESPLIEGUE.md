# Instalación con MySQL y Docker

1. Instala Docker Engine con Compose o inicia Docker Desktop.
2. Copia .env.example a .env. Completa DB_PASSWORD, MYSQL_ROOT_PASSWORD, JWT_SECRET (aleatorio, 32 caracteres como mínimo), ADMIN_EMAIL y ADMIN_PASSWORD (12 caracteres como mínimo).
3. Ajusta FRONTEND_URL y CORS_ORIGINS al origen real. Configura SMTP si necesitas recuperar contraseñas por correo.
4. Ejecuta **docker compose up --build -d** y abre **http://localhost:8088**.

MySQL y los comprobantes usan volúmenes persistentes. Solo Nginx publica un puerto. El perfil prod no crea productos, ventas ni cuentas de demostración; inicializa roles, configuración y el administrador definido por entorno.

En una instalación nueva JPA genera el esquema. Antes de conectar una base existente, respáldala y prueba la adaptación en una copia. No importes el volcado original sobre datos reales. Para una prueba pública gratuita usa [Cloudflare Quick Tunnel](CLOUDFLARE.md). Para alojamiento permanente configura HTTPS y un dominio del propietario.

La web escucha de forma predeterminada en **127.0.0.1:8088**. Cloudflare o un proxy inverso local pueden acceder a ese puerto. Si necesitas publicarlo directamente en otras interfaces de red, configura **WEB_BIND_ADDRESS** expresamente.

## Operación

- **docker compose ps** muestra el estado.
- **docker compose logs --tail=100 backend** muestra registros del servidor.
- **docker compose down** detiene los servicios conservando volúmenes.
- No uses la opción **-v** al detener salvo que quieras eliminar los datos.
- Respalda MySQL y los comprobantes y comprueba su restauración.

## Credenciales anteriores

La configuración del avance original contenía valores literales para base de datos, SMTP y JWT. La implementación activa usa variables de entorno. Los valores anteriores siguen en el historial de Git: **el propietario debe revocarlos o cambiarlos antes de un despliegue público**. No se reproducen aquí y no se reescribió el historial.

## Alcance de la validación

Se ejecutaron el backend, la interfaz y Streamlit con H2 local y también con MySQL 8.4 en Docker. Se comprobó la publicación temporal con Cloudflare, las operaciones de navegador por HTTPS y la conservación de pedidos, stock y comprobantes al detener y volver a iniciar. Consulta los [resultados y límites de validación](VALIDACION.md).

Se conservó la línea Spring Boot 3.5, actualizada a 3.5.16. Esta línea terminó su soporte abierto; antes de operar públicamente sin soporte comercial, planifica una actualización a una línea con soporte. [Anuncio oficial de Spring](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/).

El volcado SQL y los comprobantes históricos del avance se conservaron localmente pero se excluyeron del índice de esta rama para evitar volver a publicar datos antiguos. El historial original permanece intacto.
