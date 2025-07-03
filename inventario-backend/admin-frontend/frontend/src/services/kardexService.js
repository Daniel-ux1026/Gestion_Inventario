// services/kardexService.js
import { getKardexData } from '../dao/kardexDao';
import { KardexEntry } from '../models/kardexModel';

export const getAllKardex = async () => {
  try {
    const rawData = await getKardexData();
    return rawData.map(data => new KardexEntry(data));
  } catch (error) {
    console.error("Error en kardexService:", error);
    return [];
  }
};
