import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate de que termine en /api
  timeout: 5000, // Si en 5 segundos no responde, suelta el error
});

export default api;