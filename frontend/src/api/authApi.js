import axiosClient from './axiosClient';

const authApi = {
  async register(payload) {
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  },

  async login(payload) {
    const response = await axiosClient.post('/auth/login', payload);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authApi;

