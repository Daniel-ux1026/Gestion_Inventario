# Gestión de Inventarios con Chatbot

Proyecto fullstack para la gestión integral de inventarios y la venta online de productos, que incorpora un chatbot para mejorar la experiencia de usuario y soporte interactivo.

---

## Tecnologías Utilizadas

- **Backend:** Java JDK 17 con Spring Boot 
- **Frontend:** Vite x React con Bootstrap 5  
- **Base de Datos:** MySQL  
- **Comunicación:** API REST para conectar backend y frontend  
- **Chatbot:** Integrado para consultas y asistencia automatizada  

---

## Descripción del Proyecto

Esta aplicación permite gestionar productos en un inventario mediante operaciones CRUD (Crear, Leer, Actualizar, Eliminar). El backend está desarrollado en Java utilizando Spring Boot y un API REST que expone los datos al frontend. React.js se encarga de la interfaz de usuario, consumiendo los datos mediante llamadas a la API y renderizando componentes con Bootstrap 5 para un diseño responsivo y moderno.

El chatbot integrado facilita la interacción, ofreciendo ayuda en tiempo real para consultas sobre inventarios o uso del sistema, mejorando la eficiencia y experiencia del usuario.

---

## Requisitos del Sistema

- **Java Development Kit (JDK):** Versión 17
- **Servidor de aplicaciones:** Apache Tomcat de Spring Boot
- **Node.js y npm:** Para manejo del frontend Vite x React
- **MySQL Server:** Para la gestión de la base de datos
- - **Spring boot:** Para el backend y ApisRest

---

1. Configurar la base de datos MySQL

    Crea una base de datos para el proyecto.

    Ejecuta el script SQL ubicado en la carpeta /backend para crear las tablas y datos iniciales.

    Configura los parámetros de conexión en el archivo de configuración del backend (ConfiguracionProperties dentro del backend en Spring Boot).

2. Configurar y ejecutar el backend

    Asegúrate que JDK 17 esté instalado y configurado en tu sistema (JAVA_HOME apuntando a JDK 17).


    Verifica que el backend esté corriendo y accesible (por ejemplo, en http://localhost:8080/backend).

3. Configurar y ejecutar el frontend
cd frontend
npm install
npm start

El frontend se ejecutará en http://localhost:3000.
Consume la API REST del backend para mostrar y manejar los datos del inventario.

4. Estructura del Proyecto:

/backend:       Código Java con Spring boot, API REST, configuración y lógica del servidor.

/frontend:      Código de Vite, componentes UI y lógica del cliente.

/database:      Scripts MySQL para creación y carga de la base de datos.

