# Gestión de Inventarios con Chatbot

Proyecto fullstack para la gestión integral de inventarios, que incorpora un chatbot para mejorar la experiencia de usuario y soporte interactivo.

---

## Tecnologías Utilizadas

- **Backend:** Java JDK 23 con JSP y Servidor Apache Tomcat  
- **Frontend:** React.js con Bootstrap 5  
- **Base de Datos:** MySQL  
- **Comunicación:** API REST para conectar backend y frontend  
- **Chatbot:** Integrado para consultas y asistencia automatizada  

---

## Descripción del Proyecto

Esta aplicación permite gestionar productos en un inventario mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar). El backend está desarrollado en Java utilizando JSP para la generación dinámica de páginas y un API REST que expone los datos al frontend. React.js se encarga de la interfaz de usuario, consumiendo los datos mediante llamadas a la API y renderizando componentes con Bootstrap 5 para un diseño responsivo y moderno.

El chatbot integrado facilita la interacción, ofreciendo ayuda en tiempo real para consultas sobre inventarios o uso del sistema, mejorando la eficiencia y experiencia del usuario.

---

## Requisitos del Sistema

- **Java Development Kit (JDK):** Versión 23  
- **Servidor de aplicaciones:** Apache Tomcat (compatible con JSP y Servlets)  
- **Node.js y npm:** Para manejo del frontend React  
- **MySQL Server:** Para la gestión de la base de datos  

---

1. Configurar la base de datos MySQL

    Crea una base de datos para el proyecto.

    Ejecuta el script SQL ubicado en la carpeta /backend para crear las tablas y datos iniciales.

    Configura los parámetros de conexión en el archivo de configuración del backend (DatabaseConnection.java o archivo correspondiente).

2. Configurar y ejecutar el backend

    Asegúrate que JDK 23 esté instalado y configurado en tu sistema (JAVA_HOME apuntando a JDK 23).

    Despliega el backend en Apache Tomcat:

        Copia el WAR o despliega el proyecto en la carpeta webapps de Tomcat.

        Inicia el servidor Tomcat.

    Verifica que el backend esté corriendo y accesible (por ejemplo, en http://localhost:8080/backend).

3. Configurar y ejecutar el frontend
cd frontend
npm install
npm start

El frontend se ejecutará en http://localhost:3000.
Consume la API REST del backend para mostrar y manejar los datos del inventario.

4. Estructura del Proyecto:
/backend       -> Código Java JSP, API REST, configuración y lógica del servidor
/frontend      -> Código React.js, componentes UI y lógica del cliente
/database     -> Scripts SQL para creación y carga de la base de datos (si aplica)
/README.md     -> Documentación del proyecto
