const STORAGE_KEY = "clientes_data";

export const obtenerClientes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const guardarClientes = (clientes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
};

export const agregarCliente = (cliente) => {
  const clientes = obtenerClientes();
  const nuevo = { ...cliente, id: Date.now(), campañas: [] };
  clientes.push(nuevo);
  guardarClientes(clientes);
};

export const editarCliente = (clienteEditado) => {
  const clientes = obtenerClientes().map(c =>
    c.id === clienteEditado.id ? clienteEditado : c
  );
  guardarClientes(clientes);
};

export const eliminarCliente = (id) => {
  const clientes = obtenerClientes().filter(c => c.id !== id);
  guardarClientes(clientes);
};
