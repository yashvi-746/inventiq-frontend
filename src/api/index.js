import api from './axiosInstance'

// --- Inventory API ---
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  add: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  remove: (id) => api.delete(`/inventory/${id}`),
}

// --- Chat API ---
export const chatApi = {
  send: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat/history'),
  getReports: (days = 7) => api.get(`/chat/reports?days=${days}`),
}

// --- Auth API ---
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}
