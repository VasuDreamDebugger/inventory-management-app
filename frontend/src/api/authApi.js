import axiosClient from './axiosClient';

const AUTH_EVENT = 'auth:change';

function persistSession({ token, user }) {
  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

const authApi = {
  async register(payload) {
    const response = await axiosClient.post('/auth/register', payload);
    persistSession(response.data);
    return response.data;
  },

  async login(payload) {
    const response = await axiosClient.post('/auth/login', payload);
    persistSession(response.data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event(AUTH_EVENT));
  },

  AUTH_EVENT,
};

export default authApi;

