```mysql
-- Inserta todos los productos de la carpeta (ajusta los nombres/IDs si lo necesitas)
INSERT INTO producto
(codigo_producto, nombre_producto, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, imagen_url, id_categoria, id_marca, id_proveedor, activo) VALUES
('P001', 'Aceite', 'Aceite vegetal', 1.80, 3.00, 50, 5, '/uploads/productos/aceite.jpg', 1, 1, 1, 1),
('P002', 'Aceite Deleite', 'Aceite Deleite vegetal', 1.75, 2.80, 50, 5, '/uploads/productos/aceite-deleite.jpg', 1, 1, 1, 1),
('P003', 'Aceite Olivar', 'Aceite Olivar de oliva', 2.20, 3.40, 50, 5, '/uploads/productos/aceite-olivar.jpg', 1, 1, 1, 1),
('P004', 'Aceite Primor', 'Aceite Primor vegetal', 1.70, 2.60, 50, 5, '/uploads/productos/aceite-primor.jpg', 1, 1, 1, 1),
('P005', 'Arroz', 'Arroz blanco tradicional', 1.10, 2.00, 50, 5, '/uploads/productos/arroz.jpg', 1, 1, 1, 1),
('P006', 'Arroz Costeño', 'Arroz costeño', 1.20, 2.10, 50, 5, '/uploads/productos/arroz-costeno.jpg', 1, 1, 1, 1),
('P007', 'Arroz Bells', 'Arroz Bells calidad superior', 1.25, 2.20, 50, 5, '/uploads/productos/arroz_bells.jpg', 1, 1, 1, 1),
('P008', 'Arroz Bells 2', 'Arroz Bells presentación 2', 1.30, 2.25, 50, 5, '/uploads/productos/arroz_bells2.jpg', 1, 1, 1, 1),
('P009', 'Arroz Costeño 2', 'Arroz costeño presentación alternativa', 1.18, 2.12, 50, 5, '/uploads/productos/arroz_costeno.jpg', 1, 1, 1, 1),
('P010', 'Arroz Faraón', 'Arroz Faraón de calidad', 1.50, 2.60, 50, 5, '/uploads/productos/arroz_faraon.jpg', 1, 1, 1, 1),
('P011', 'Atún Campomar', 'Atún Campomar enlatado', 2.10, 3.40, 50, 5, '/uploads/productos/atun-campomar.jpg', 1, 1, 1, 1),
('P012', 'Atún Marinero', 'Atún Marinero en agua', 2.05, 3.30, 50, 5, '/uploads/productos/atun-marinero.jpg', 1, 1, 1, 1),
('P013', 'Atún San Jorge', 'Atún San Jorge', 1.90, 3.10, 50, 5, '/uploads/productos/atun-sanjorge.jpg', 1, 1, 1, 1),
('P014', 'Atún Florida', 'Atún Florida', 2.25, 3.60, 50, 5, '/uploads/productos/atun_florida.jpg', 1, 1, 1, 1),
('P015', 'Atún Gloria', 'Atún Gloria', 1.80, 2.95, 50, 5, '/uploads/productos/atun_gloria.jpg', 1, 1, 1, 1),
('P016', 'Atún Real', 'Atún Real', 2.00, 3.20, 50, 5, '/uploads/productos/atun_real.jpg', 1, 1, 1, 1),
('P017', 'Bolívar', 'Jabón Bolívar', 1.40, 2.10, 50, 5, '/uploads/productos/bolivar.jpg', 1, 1, 1, 1),
('P018', 'Café Altomayo', 'Café Altomayo', 4.80, 6.00, 50, 5, '/uploads/productos/cafe_altomayo.jpg', 1, 1, 1, 1),
('P019', 'Café Artidoro', 'Café Artidoro Rodríguez', 4.40, 5.50, 50, 5, '/uploads/productos/cafe_artidoro.jpg', 1, 1, 1, 1),
('P020', 'Café Villa Rica', 'Café Villa Rica', 4.60, 5.80, 50, 5, '/uploads/productos/cafe_villa_rica.jpg', 1, 1, 1, 1),
('P021', 'Fideo Macarrón', 'Fideos Macarrón', 1.10, 2.10, 50, 5, '/uploads/productos/fideo-macarron.jpg', 1, 1, 1, 1),
('P022', 'Fideo Nicolini', 'Fideos Nicolini', 1.05, 2.00, 50, 5, '/uploads/productos/fideo-nicolini.jpg', 1, 1, 1, 1),
('P023', 'Linguini Don Vittorio', 'Linguini Don Vittorio', 1.55, 2.60, 50, 5, '/uploads/productos/linguini-donvittorio.jpg', 1, 1, 1, 1),
('P024', 'Opal', 'Jabón Opal', 1.00, 1.80, 50, 5, '/uploads/productos/opal.jpg', 1, 1, 1, 1),
('P025', 'Patrona', 'Jabón Patrona', 1.10, 2.00, 50, 5, '/uploads/productos/patrona.jpg', 1, 1, 1, 1),
('P026', 'Sapolio', 'Limpiador Sapolio', 1.90, 3.00, 50, 5, '/uploads/productos/sapolio.jpg', 1, 1, 1, 1);

```


```sql
CREATE TABLE pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre VARCHAR(100),
  total DECIMAL(10,2),
  metodo_pago VARCHAR(20),
  comprobante_url VARCHAR(255),
  estado VARCHAR(30), -- PENDIENTE_VALIDACION, APROBADO, RECHAZADO
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS pedido;

CREATE TABLE pedido (
                        id_pedido INT PRIMARY KEY AUTO_INCREMENT,
                        cliente_nombre VARCHAR(200) NOT NULL,
                        total DECIMAL(10,2) NOT NULL,
                        metodo_pago ENUM('YAPE', 'PLIN', 'TRANSFERENCIA', 'EFECTIVO') NOT NULL,
                        comprobante_url VARCHAR(500),
                        estado ENUM('PENDIENTE_VALIDACION', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE_VALIDACION',
                        productos TEXT, -- JSON con los productos del carrito
                        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE pedido ADD COLUMN cliente_email VARCHAR(255);

```


````markdown
[ADMIN entra a /admin/validar-pagos]
    |
[ValidarPagos.jsx pide GET /api/pedidos/pendientes]
    |
[Backend verifica que eres ADMIN]
    |
[Responde con pedidos pendientes]
    |
[Admin aprueba/rechaza: PUT a /api/pedidos/{id}/aprobar o /rechazar]
    |
[Backend cambia estado, el frontend actualiza lista]

````