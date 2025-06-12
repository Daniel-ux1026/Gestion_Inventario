const STORAGE_KEY = 'campañas_fidelizacion';

export const obtenerCampañas = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const agregarCampaña = (campaña) => {
  const campañas = obtenerCampañas();
  campañas.push({ ...campaña, id: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campañas));
};
