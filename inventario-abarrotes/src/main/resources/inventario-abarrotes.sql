CREATE DATABASE ABARROTES;
USE ABARROTES;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

CREATE TABLE marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    marca_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(70) NOT NULL,
    presentacion VARCHAR(90) NOT NULL,
    precio_compra DECIMAL(18, 2) NOT NULL,
    precio_venta DECIMAL(18, 2) NOT NULL,
    stock INT NOT NULL,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    estado TINYINT(1) DEFAULT 1,
    UNIQUE(codigo),
    FOREIGN KEY(categoria_id) REFERENCES categoria(id_categoria),
    FOREIGN KEY(marca_id) REFERENCES marca(id_marca)
);

CREATE TABLE proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    empresa VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    dni CHAR(8) UNIQUE NOT NULL,
    CHECK (dni REGEXP '^[0-9]{8}$'),
    telefono CHAR(9) NOT NULL,
    CHECK (telefono REGEXP '^[0-9]{9}$'),
    correo VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(150) NOT NULL
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni CHAR(8) UNIQUE NOT NULL,
    CHECK (dni REGEXP '^[0-9]{8}$'),
    telefono CHAR(9) NOT NULL,
    CHECK (telefono REGEXP '^[0-9]{9}$'),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    FOREIGN KEY (rol_id) REFERENCES rol(id_rol)
);

CREATE TABLE compra (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(18, 2),
    estado TINYINT(1) DEFAULT 1,
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id_proveedor),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);

CREATE TABLE detalle_compra (
    id_detalle_compra INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18, 2) NOT NULL,
    subtotal DECIMAL(18, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (compra_id) REFERENCES compra(id_compra),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
);

CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(18, 2),
    estado TINYINT(1) DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id_usuario)
);

CREATE TABLE detalle_venta (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18, 2) NOT NULL,
    subtotal DECIMAL(18, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (venta_id) REFERENCES venta(id_venta),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
);

CREATE TABLE chatbot (
    id_interaccion INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    mensaje_cliente TEXT,
    respuesta TEXT,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    canal VARCHAR(30),
    estado_conversacion VARCHAR(30),
    FOREIGN KEY (venta_id) REFERENCES venta(id_venta)
);

CREATE TABLE kardex (
    id_kardex INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    compra_id INT,
    tipo_movimiento VARCHAR(50) NOT NULL,
    motivo VARCHAR(30) NOT NULL,
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_documento VARCHAR(30) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18, 2) NOT NULL,
    total DECIMAL(18, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (venta_id) REFERENCES venta(id_venta),
    FOREIGN KEY (compra_id) REFERENCES compra(id_compra)
);



-- CONSULTAS
-- buscar usuarios  activos por rol
SELECT u.id_usuario, u.nombre, u.apellido, u.correo, r.nombre AS rol
FROM usuario u
JOIN rol r ON u.rol_id = r.id_rol
WHERE u.estado = 1;

 -- listar compras con proveedor y usuario responsable
 
SELECT c.id_compra, c.fecha, c.total, p.empresa AS proveedor, u.nombre AS usuario, u.apellido AS apellido_usuario
FROM compra c
JOIN proveedor p ON c.proveedor_id = p.id_proveedor
JOIN usuario u ON c.usuario_id = u.id_usuario
WHERE c.estado = 1
ORDER BY c.fecha DESC;

-- Detalle de una compra específica
SELECT dc.id_detalle_compra, pr.nombre AS producto, dc.cantidad, dc.precio_unitario, dc.subtotal
FROM detalle_compra dc
JOIN producto pr ON dc.producto_id = pr.id_producto
WHERE dc.compra_id = 123;  -- Cambia 123 por el id_compra que buscas

-- Listar ventas con cliente y usuario
SELECT v.id_venta, v.fecha, v.total, u.nombre AS vendedor, u.apellido AS apellido_vendedor, c.nombre AS cliente, c.apellido AS apellido_cliente
FROM venta v
JOIN usuario u ON v.usuario_id = u.id_usuario
JOIN usuario c ON v.cliente_id = c.id_usuario
WHERE v.estado = 1
ORDER BY v.fecha DESC;
