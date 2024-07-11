import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Assurez-vous que cette URL est correcte
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
