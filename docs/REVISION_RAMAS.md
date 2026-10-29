# Revisión de las ramas

Revisión del 28 de octubre de 2026. Se clonó el historial completo y se compararon árboles, dependencias y cambios entre las cuatro ramas remotas.

| Rama | Commit revisado | Estado encontrado | Decisión |
|---|---|---|---|
| main | 69a76873 | Backend Java y dos interfaces React separadas | Conservar su historial |
| backend | 4f851ec7 | Estructura anterior con las interfaces dentro del backend | Revisar servicios y modelos |
| frontend | 8cada917 | Esqueleto de Vite en sistema-gestion | Sin funciones adicionales que integrar |
| inventario-backendv2 | 20b81c3f | React unificado, catálogo y pagos; varios módulos administrativos usaban datos locales | Base de version-final-lirio |

La rama **version-final-lirio** parte de **20b81c3f**. Conserva React, Vite, Java 21, Spring Boot, JPA y MySQL. Añade Streamlit, un perfil local H2, pruebas y configuración de despliegue.

Proveedores, compras, clientes, configuración e inventario ahora se conectan al servidor. Se cerraron las rutas de depuración y el servidor calcula los importes. El avance anterior se conserva en **legacy/**, fuera de la aplicación activa. No se fusionó ni se modificó ninguna rama original.
