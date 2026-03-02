import axios from 'axios';

// ✅ USAR VARIABLE DE ENTORNO O URL LOCAL POR DEFECTO
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

console.log('🔌 Conectando a:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para mostrar errores de CORS
api.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error' && !error.response) {
      console.error('❌ Error de conexión - Verifica si el backend está en línea');
      console.error('   Backend esperado en:', API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

export default api;