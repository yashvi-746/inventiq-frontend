import axios from 'axios'

// Hardcoded for deployment - will work immediately
const API = 'https://inventiq-backend-4.onrender.com';

const api = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('inventiq_user') || '{}')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register'
    ) {
      localStorage.removeItem('inventiq_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api