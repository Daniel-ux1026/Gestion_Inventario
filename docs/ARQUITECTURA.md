# Arquitectura y reglas de operación

## Componentes

- React 19 y Vite 7: tienda, bolsa persistente, sesión en sessionStorage y administración con carga por sección.
- Spring Boot 3.5.16 y Java 21: API REST /api/v1, validación, JWT y autorización por roles consultados en la base.
- JPA: modelos originales de productos, usuarios, categorías, marcas, proveedores, compras, pedidos y Kardex. Se añadieron configuración y recuperación de contraseña.
- MySQL: almacenamiento de instalaciones con perfil prod. H2: demostración y pruebas aisladas.
- Streamlit: atención por reglas y catálogo público, sin claves de IA ni operaciones de pago.

## Pedidos

El cliente envía IDs, cantidades, total esperado y una clave única. La transacción bloquea su cuenta y los productos por ID, comprueba stock y calcula descuentos con BigDecimal, redondeo HALF_UP a dos decimales. Un precio cambiado requiere revisar el total.

Se guarda una instantánea de productos, precios y costos, se reservan unidades y se registra el movimiento. Reintentar la misma clave devuelve el pedido; reutilizarla con otros datos se rechaza.

ADMIN verifica el abono o el efectivo recibido. Aprobar no descuenta stock otra vez. Rechazar devuelve las unidades una sola vez; los estados finales no aceptan una transición opuesta.

Los pedidos pendientes reservan stock hasta que el administrador los resuelva; no existe vencimiento automático. Si hubo un abono y el pedido se rechaza, la devolución se coordina con el cliente.

## Compras e inventario

Una compra pendiente no modifica stock. Recibirla aumenta las unidades y registra su costo y movimiento en una transacción. Repetir la recepción no duplica unidades. Recibir mercadería no significa pagar al proveedor.

Los ajustes requieren una variación distinta de cero y un motivo; no permiten stock negativo. Archivar retira el producto de la tienda y conserva su historial. Se puede reactivar.

## Reportes

Ventas incluye pedidos APROBADOS según su fecha de creación, con períodos de 7, 30 o 90 días en America/Lima. Margen bruto resta el costo de la instantánea; no es utilidad neta. Inventario multiplica stock disponible por costo actual.

Los precios son finales y no se agrega un impuesto automático. Los reportes y registros operativos no son comprobantes electrónicos fiscales. Los CSV neutralizan valores que podrían interpretarse como fórmulas.

## Acceso y archivos

Los JWT duran dos horas; los roles y el estado activo se verifican por solicitud. Las contraseñas usan BCrypt. Los endpoints públicos de autenticación limitan intentos por IP. La recuperación necesita SMTP y genera enlaces de 20 minutos.

Los comprobantes se validan y recodifican como PNG, con nombres aleatorios fuera de la carpeta pública. Admiten hasta 3 MB y 12 megapíxeles. Solo ADMIN o el propietario del pedido pueden leerlos. Las fotografías de productos son públicas.

El chatbot no recibe JWT ni datos privados de clientes. Consulta el catálogo y la configuración públicos. Conserva hasta 40 mensajes en la sesión de Streamlit y avisa cuando no puede verificar precios o stock.
