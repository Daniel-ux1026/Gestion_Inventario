-- Base de datos para Sistema de Gestión de Inventarios
CREATE DATABASE ABARROTES_V2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ABARROTES_V2;


-- Tabla de roles
CREATE TABLE rol (
                     id_rol INT PRIMARY KEY AUTO_INCREMENT,
                     nombre_rol VARCHAR(50) NOT NULL UNIQUE,
                     descripcion TEXT,
                     fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usuario (
                         id_usuario INT PRIMARY KEY AUTO_INCREMENT,
                         nombre VARCHAR(100) NOT NULL,
                         apellido VARCHAR(100) NOT NULL,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         password VARCHAR(255) NOT NULL,
                         telefono VARCHAR(20),
                         direccion TEXT,
                         id_rol INT NOT NULL,
                         activo BOOLEAN DEFAULT TRUE,
                         fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

-- Tabla de categorías
CREATE TABLE categoria (
                           id_categoria INT PRIMARY KEY AUTO_INCREMENT,
                           nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
                           descripcion TEXT,
                           activo BOOLEAN DEFAULT TRUE,
                           fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de marcas
CREATE TABLE marca (
                       id_marca INT PRIMARY KEY AUTO_INCREMENT,
                       nombre_marca VARCHAR(100) NOT NULL UNIQUE,
                       descripcion TEXT,
                       activo BOOLEAN DEFAULT TRUE,
                       fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE proveedor (
                           id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
                           nombre_proveedor VARCHAR(150) NOT NULL,
                           ruc VARCHAR(11) UNIQUE,
                           telefono VARCHAR(20),
                           email VARCHAR(150),
                           direccion TEXT,
                           activo BOOLEAN DEFAULT TRUE,
                           fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE producto (
                          id_producto INT PRIMARY KEY AUTO_INCREMENT,
                          codigo_producto VARCHAR(50) UNIQUE NOT NULL,
                          nombre_producto VARCHAR(200) NOT NULL,
                          descripcion TEXT,
                          precio_compra DECIMAL(10,2) NOT NULL,
                          precio_venta DECIMAL(10,2) NOT NULL,
                          stock_actual INT DEFAULT 0,
                          stock_minimo INT DEFAULT 0,
                          imagen_url VARCHAR(500),
                          id_categoria INT NOT NULL,
                          id_marca INT NOT NULL,
                          id_proveedor INT,
                          activo BOOLEAN DEFAULT TRUE,
                          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
                          FOREIGN KEY (id_marca) REFERENCES marca(id_marca),
                          FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

-- Tabla de compras (del negocio a proveedores)
CREATE TABLE compra (
                        id_compra INT PRIMARY KEY AUTO_INCREMENT,
                        numero_compra VARCHAR(20) UNIQUE NOT NULL,
                        id_proveedor INT NOT NULL,
                        id_usuario INT NOT NULL,
                        fecha_compra DATE NOT NULL,
                        subtotal DECIMAL(10,2) NOT NULL,
                        igv DECIMAL(10,2) NOT NULL,
                        total DECIMAL(10,2) NOT NULL,
                        estado ENUM('PENDIENTE', 'RECIBIDA', 'CANCELADA') DEFAULT 'PENDIENTE',
                        observaciones TEXT,
                        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor),
                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de detalle de compras
CREATE TABLE detalle_compra (
                                id_detalle_compra INT PRIMARY KEY AUTO_INCREMENT,
                                id_compra INT NOT NULL,
                                id_producto INT NOT NULL,
                                cantidad INT NOT NULL,
                                precio_unitario DECIMAL(10,2) NOT NULL,
                                subtotal DECIMAL(10,2) NOT NULL,
                                FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON DELETE CASCADE,
                                FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla de ventas (del negocio a clientes)
CREATE TABLE venta (
                       id_venta INT PRIMARY KEY AUTO_INCREMENT,
                       numero_venta VARCHAR(20) UNIQUE NOT NULL,
                       id_cliente INT NOT NULL,
                       id_usuario INT NOT NULL,
                       fecha_venta DATE NOT NULL,
                       subtotal DECIMAL(10,2) NOT NULL,
                       igv DECIMAL(10,2) NOT NULL,
                       total DECIMAL(10,2) NOT NULL,
                       metodo_pago ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN') NOT NULL,
                       estado ENUM('PENDIENTE', 'COMPLETADA', 'CANCELADA') DEFAULT 'PENDIENTE',
                       observaciones TEXT,
                       fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario),
                       FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_venta (
                               id_detalle_venta INT PRIMARY KEY AUTO_INCREMENT,
                               id_venta INT NOT NULL,
                               id_producto INT NOT NULL,
                               cantidad INT NOT NULL,
                               precio_unitario DECIMAL(10,2) NOT NULL,
                               subtotal DECIMAL(10,2) NOT NULL,
                               FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
                               FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla kardex (movimientos de inventario)
CREATE TABLE kardex (
                        id_kardex INT PRIMARY KEY AUTO_INCREMENT,
                        id_producto INT NOT NULL,
                        tipo_movimiento ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL,
                        motivo VARCHAR(100) NOT NULL,
                        cantidad INT NOT NULL,
                        stock_anterior INT NOT NULL,
                        stock_actual INT NOT NULL,
                        precio_unitario DECIMAL(10,2),
                        id_compra INT NULL,
                        id_venta INT NULL,
                        id_usuario INT NOT NULL,
                        fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        observaciones TEXT,
                        FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
                        FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
                        FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
                        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de devoluciones
CREATE TABLE devolucion (
                            id_devolucion INT PRIMARY KEY AUTO_INCREMENT,
                            numero_devolucion VARCHAR(20) UNIQUE NOT NULL,
                            tipo_devolucion ENUM('VENTA', 'COMPRA') NOT NULL,
                            id_venta INT NULL,
                            id_compra INT NULL,
                            id_usuario INT NOT NULL,
                            motivo TEXT NOT NULL,
                            fecha_devolucion DATE NOT NULL,
                            total_devolucion DECIMAL(10,2) NOT NULL,
                            estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
                            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
                            FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
                            FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de detalle de devoluciones
CREATE TABLE detalle_devolucion (
                                    id_detalle_devolucion INT PRIMARY KEY AUTO_INCREMENT,
                                    id_devolucion INT NOT NULL,
                                    id_producto INT NOT NULL,
                                    cantidad INT NOT NULL,
                                    precio_unitario DECIMAL(10,2) NOT NULL,
                                    subtotal DECIMAL(10,2) NOT NULL,
                                    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id_devolucion) ON DELETE CASCADE,
                                    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

-- Tabla de chatbot (preguntas frecuentes y respuestas)
CREATE TABLE chatbot (
                         id_chatbot INT PRIMARY KEY AUTO_INCREMENT,
                         pregunta TEXT NOT NULL,
                         respuesta TEXT NOT NULL,
                         palabras_clave TEXT,
                         categoria_consulta VARCHAR(100),
                         activo BOOLEAN DEFAULT TRUE,
                         fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de conversaciones del chatbot
CREATE TABLE conversacion_chatbot (
                                      id_conversacion INT PRIMARY KEY AUTO_INCREMENT,
                                      id_usuario INT NULL,
                                      sesion_id VARCHAR(100) NOT NULL,
                                      pregunta_usuario TEXT NOT NULL,
                                      respuesta_bot TEXT NOT NULL,
                                      fecha_conversacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);



-- Insertar datos iniciales
INSERT INTO rol (nombre_rol, descripcion) VALUES
                                              ('ADMIN', 'Administrador del sistema'),
                                              ('CLIENTE', 'Cliente del sistema'),
                                              ('VENDEDOR', 'Vendedor del sistema');

INSERT INTO categoria (nombre_categoria, descripcion) VALUES
                                                          ('Electrónicos', 'Productos electrónicos y tecnológicos'),
                                                          ('Ropa', 'Vestimenta y accesorios'),
                                                          ('Hogar', 'Artículos para el hogar'),
                                                          ('Deportes', 'Artículos deportivos');

INSERT INTO marca (nombre_marca, descripcion) VALUES
                                                  ('Samsung', 'Marca de electrónicos'),
                                                  ('Apple', 'Marca de tecnología'),
                                                  ('Nike', 'Marca deportiva'),
                                                  ('Adidas', 'Marca deportiva');

INSERT INTO usuario (nombre, apellido, email, password, id_rol) VALUES
                                                                    ('Admin', 'Sistema', 'admin@sistema.com', '$2a$10$DOyWKKDlGXbI1XMFdLO9k.xd6sIlY8jHDH8VhY6Z9OYLvNZ8aHmqu', 1),
                                                                    ('Cliente', 'Prueba', 'cliente@test.com', '$2a$10$DOyWKKDlGXbI1XMFdLO9k.xd6sIlY8jHDH8VhY6Z9OYLvNZ8aHmqu', 2);

INSERT INTO proveedor (nombre_proveedor, ruc, telefono, email, direccion) VALUES
                                                                              ('Proveedor Electrónicos SAC', '20123456789', '987654321', 'ventas@electronicossac.com', 'Av. Principal 123, Lima'),
                                                                              ('Distribuidora Ropa Moderna', '20987654321', '987654322', 'contacto@ropamoderna.com', 'Jr. Comercio 456, Lima');

INSERT INTO chatbot (pregunta, respuesta, palabras_clave, categoria_consulta) VALUES
                                                                                  ('¿Cuáles son los horarios de atención?', 'Nuestros horarios de atención son de Lunes a Viernes de 8:00 AM a 6:00 PM y Sábados de 8:00 AM a 2:00 PM.', 'horarios,atencion,abierto,cerrado', 'INFORMACION'),
                                                                                  ('¿Cómo puedo realizar una compra?', 'Puedes realizar una compra navegando por nuestros productos, agregándolos al carrito y procediendo al checkout. Aceptamos varios métodos de pago.', 'compra,comprar,como,proceso', 'VENTAS'),
                                                                                  ('¿Cuáles son los métodos de pago?', 'Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias, Yape y Plin.', 'pago,metodos,tarjeta,efectivo,yape,plin', 'PAGOS'),
                                                                                  ('¿Hacen envíos a domicilio?', 'Sí, realizamos envíos a domicilio. El costo varía según la zona de entrega.', 'envio,domicilio,delivery,entrega', 'ENVIOS'),
                                                                                  ('¿Puedo devolver un producto?', 'Sí, aceptamos devoluciones dentro de los 7 días posteriores a la compra, siempre que el producto esté en perfectas condiciones.', 'devolucion,devolver,cambio,garantia', 'DEVOLUCIONES'),
                                                                                  ('Contactar con un asesor', 'Para contactar con un asesor humano, puedes escribirnos por WhatsApp al número +51 987 654 321 o llamarnos al mismo número.', 'asesor,humano,contacto,ayuda,soporte', 'CONTACTO');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_producto_codigo ON producto(codigo_producto);
CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_producto_marca ON producto(id_marca);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_venta_fecha ON venta(fecha_venta);
CREATE INDEX idx_compra_fecha ON compra(fecha_compra);
CREATE INDEX idx_kardex_producto ON kardex(id_producto);
CREATE INDEX idx_kardex_fecha ON kardex(fecha_movimiento);