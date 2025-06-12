const STORAGE_KEY = "compras_data";

// Obtener todas las compras
export const obtenerCompras = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Guardar lista completa de compras
export const guardarCompras = (compras) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(compras));
};

// Agregar nueva compra
export const agregarCompra = (compra) => {
  const compras = obtenerCompras();
  const nueva = { ...compra, id: Date.now() };
  compras.push(nueva);
  guardarCompras(compras);
  return nueva;
};

// Editar compra por ID
export const editarCompra = (compraEditada) => {
  let compras = obtenerCompras();
  compras = compras.map(c => c.id === compraEditada.id ? compraEditada : c);
  guardarCompras(compras);
};

// Eliminar compra por ID
export const eliminarCompra = (id) => {
  const compras = obtenerCompras().filter(c => c.id !== id);
  guardarCompras(compras);
};
