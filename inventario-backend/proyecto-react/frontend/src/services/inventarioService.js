const STORAGE_KEY = "inventario_data";

export const obtenerProductos = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const guardarProductos = (productos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};

export const agregarProducto = (producto) => {
  const productos = obtenerProductos();
  const nuevo = { ...producto, id: Date.now() };
  productos.push(nuevo);
  guardarProductos(productos);
  return nuevo;
};

export const editarProducto = (productoEditado) => {
  let productos = obtenerProductos();
  productos = productos.map(p => p.id === productoEditado.id ? productoEditado : p);
  guardarProductos(productos);
};

export const eliminarProducto = (id) => {
  const productos = obtenerProductos().filter(p => p.id !== id);
  guardarProductos(productos);
};
