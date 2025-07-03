import axios from 'axios';

const API_URL = "http://localhost:8080/api"; // ajustá si usás otro puerto

const userDao = {
  login: async (username, password) => {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    return res.data;
  }
};

export default userDao;
