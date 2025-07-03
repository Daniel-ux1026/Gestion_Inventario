import axios from 'axios';

const API_URL = "http://localhost:8080/api/kardex";

export const getKardexData = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};