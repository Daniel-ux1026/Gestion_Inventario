export const guardarOrden = (orden) => {
  const actuales = JSON.parse(localStorage.getItem('ordenesCompra')) || [];
  const nuevos = [...actuales, { ...orden, id: Date.now() }];
  localStorage.setItem('ordenesCompra', JSON.stringify(nuevos));
  return nuevos;
};

export const editarOrden = (ordenEditada) => {
  const actuales = JSON.parse(localStorage.getItem('ordenesCompra')) || [];
  const actualizadas = actuales.map(o => o.id === ordenEditada.id ? ordenEditada : o);
  localStorage.setItem('ordenesCompra', JSON.stringify(actualizadas));
  return actualizadas;
};

export const obtenerOrdenes = () => {
  return JSON.parse(localStorage.getItem('ordenesCompra')) || [];
};
