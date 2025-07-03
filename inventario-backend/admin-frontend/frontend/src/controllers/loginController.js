import userDao from '../dao/userDao';

const loginController = {
  login: async (username, password) => {
    try {
      const response = await userDao.login(username, password);
      return response.success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }
};

export default loginController;
