# Identidad visual de Lirio Inversiones

Se incorpora el logo JPG original proporcionado por el negocio en cabecera, pie, acceso, administración e icono del navegador. El archivo se conserva sin modificar. Los colores se definen en **src/lirio/styles/theme.css**: superficies blancas y acentos rojos en modo claro; superficies oscuras y acentos rojos con contraste en modo oscuro. Los estados de éxito, advertencia y rechazo conservan su significado.

El botón accesible de luna o sol está disponible en tienda, acceso y administración. El tema inicial respeta la preferencia del dispositivo y la selección se guarda en **lirio.theme**. Cambiar de modo no borra los campos del acceso, la bolsa ni los favoritos. El tema se aplica antes del renderizado para evitar destellos claros al recargar.

La franja «Pequeños detalles. Una compra mejor.» se elimina completa, incluido su teléfono. El asistente conserva su función de contacto. Su iframe recibe un modo validado por el propio chatbot para aplicar los mismos fondos y colores.

## Verificación

Las seis pruebas de **e2e/branding.spec.js** cubren escritorio y móvil: logo, ausencia de franja y enlace telefónico en la cabecera, cambio con teclado, persistencia al navegar y recargar, preferencia del sistema, conservación de campos, bolsa y fondo oscuro efectivo del chatbot. Pasaron el análisis estático y la compilación. Se revisaron visualmente tienda, acceso y administración en ambos modos, y se comprobó la respuesta de contacto del asistente.

La actualización desplegada reconstruye solo web y chatbot. El backend, las credenciales y los volúmenes de MySQL y comprobantes se conservan. La dirección pública sigue siendo la misma.

## Uso

1. Abre la tienda y pulsa la luna para activar el modo oscuro o el sol para volver al modo claro.
2. En el equipo servidor, usa **COMPARTIR_PROYECTO.bat** con Docker abierto para publicar, y **DETENER_PROYECTO.bat** para cerrar.
