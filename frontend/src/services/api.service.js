import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Customer Service
export const customerService = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  create: async (customer) => {
    const response = await api.post('/customers', customer);
    return response.data;
  },
  update: async (id, customer) => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  generateMock: async () => {
    const response = await api.post('/customers/generate-mock');
    return response.data;
  },
  clearAll: async () => {
    const response = await api.delete('/customers/clear-all');
    return response.data;
  },
};

// Service Request Service
export const serviceRequestService = {
  getAll: async () => {
    const response = await api.get('/servicerequests');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/servicerequests/${id}`);
    return response.data;
  },
  getByCustomerId: async (customerId) => {
    const response = await api.get(`/servicerequests/customer/${customerId}`);
    return response.data;
  },
  getByWaiterId: async (waiterId) => {
    const response = await api.get(`/servicerequests/waiter/${waiterId}`);
    return response.data;
  },
  create: async (dto) => {
    const response = await api.post('/servicerequests', dto);
    return response.data;
  },
  assign: async (id, waiterUserId) => {
    const response = await api.post(`/servicerequests/${id}/assign`, { waiterUserId });
    return response.data;
  },
  markAsPickedUp: async (id) => {
    const response = await api.post(`/servicerequests/${id}/pickup`);
    return response.data;
  },
  markAsCompleted: async (id) => {
    const response = await api.post(`/servicerequests/${id}/complete`);
    return response.data;
  },
};

// Equipment Service
export const equipmentService = {
  getAll: async () => {
    const response = await api.get('/equipments');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/equipments/${id}`);
    return response.data;
  },
  getByCustomerId: async (customerId) => {
    const response = await api.get(`/equipments/customer/${customerId}`);
    return response.data;
  },
  pickup: async (customerId, equipmentId) => {
    const response = await api.post('/equipments/pickup', { customerId, equipmentId });
    return response.data;
  },
  return: async (equipmentId) => {
    const response = await api.post('/equipments/return', { equipmentId });
    return response.data;
  },
  generate: async (type, quantity, eventId) => {
    const response = await api.post('/equipments/generate', { type, quantity, eventId });
    return response.data;
  },
  clearAll: async () => {
    const response = await api.delete('/equipments/clear-all');
    return response.data;
  },
};

export default api;
