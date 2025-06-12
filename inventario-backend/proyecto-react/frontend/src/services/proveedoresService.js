// servicios/proveedoresService.js

export const guardarProveedor = (proveedor) => {
  const actuales = JSON.parse(localStorage.getItem('proveedores')) || [];
  const nuevos = [...actuales, { ...proveedor, id: Date.now() }];
  localStorage.setItem('proveedores', JSON.stringify(nuevos));
  return nuevos;
};

export const obtenerProveedores = () => {
  return JSON.parse(localStorage.getItem('proveedores')) || [];
};
