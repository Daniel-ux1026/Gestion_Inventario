// src/services/ventasService.js

const STORAGE_KEY = "ventas_data";

// Obtener todas las ventas
export const obtenerVentas = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Guardar todas las ventas (sobrescribe)
export const guardarVentas = (ventas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ventas));
};

// Agregar nueva venta
export const agregarVenta = (venta) => {
  const ventas = obtenerVentas();
  const nuevaVenta = { ...venta, id: Date.now() }; // ID único con timestamp
  ventas.push(nuevaVenta);
  guardarVentas(ventas);
  return nuevaVenta;
};

// Editar venta por ID
export const editarVenta = (ventaActualizada) => {
  let ventas = obtenerVentas();
  ventas = ventas.map((v) => (v.id === ventaActualizada.id ? ventaActualizada : v));
  guardarVentas(ventas);
};

// Eliminar venta por ID
export const eliminarVenta = (id) => {
  const ventas = obtenerVentas().filter((v) => v.id !== id);
  guardarVentas(ventas);
};
