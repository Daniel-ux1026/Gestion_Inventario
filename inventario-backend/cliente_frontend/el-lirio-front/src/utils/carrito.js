// Obtener carrito como arreglo
export function obtenerCarrito() {
  try {
    const data = localStorage.getItem("carrito");
    const carrito = JSON.parse(data);
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    console.error("❌ Error al leer el carrito:", error);
    return [];
  }
}

// Guardar carrito
export function guardarCarrito(carrito) {
  try {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } catch (error) {
    console.error("❌ Error al guardar el carrito:", error);
  }
}

// Agregar producto al carrito con límite de 3
export function agregarAlCarrito(producto) {
  try {
    const carrito = obtenerCarrito();
    const existente = carrito.find(p => p.id === producto.id);

    if (existente) {
      if (existente.cantidad >= 3) {
        alert("Solo puedes agregar hasta 3 unidades.");
        return;
      }
      existente.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);
  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error);
  }
}
