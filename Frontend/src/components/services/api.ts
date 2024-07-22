// src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Ajouter un intercepteur pour inclure le jeton dans les en-têtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getCollaborateurs = () => api.get('/collaborateurs');
export const getAteliers = () => api.get('/ateliers');
export const getProjects = () => api.get('/projects');
export const getCommandes = () => api.get('/commandes');

// Assurez-vous d'exporter également la fonction d'ajout/mise à jour du rapport
export const addOrUpdateRapport = (data: any) => api.post('/rapports', data);

export default api;
