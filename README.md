# Realizamos el backend
---

## Tecnologías Utilizadas

- **Backend:** Java JDK 17 con Spring Boot y Servidor Apache Tomcat  
- **Base de Datos:** MySQL  
- **Comunicación:** API REST para conectar backend y frontend  
- **Chatbot:** Integrado para consultas y asistencia automatizada  

---

## Descripción del Proyecto

Esta aplicación permite gestionar productos en un inventario mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar). El backend está desarrollado en Java utilizando Spring Boot y un API REST que expone los datos al frontend. React.js se encarga de la interfaz de usuario, consumiendo los datos mediante llamadas a la API y renderizando componentes con Bootstrap 5 para un diseño responsivo y moderno.

El chatbot integrado facilita la interacción, ofreciendo ayuda en tiempo real para consultas sobre inventarios o uso del sistema, mejorando la eficiencia y experiencia del usuario.

---

4. Estructura del Proyecto:
/backend       -> Código Java con Spring boot, API REST, configuración y lógica del servidor
/frontend      -> Código de Vite, componentes UI y lógica del cliente
/database     -> Scripts SQL para creación y carga de la base de datos (si aplica)
/README.md     -> Documentación del proyecto
