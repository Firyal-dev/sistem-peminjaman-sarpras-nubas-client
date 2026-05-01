import axios from 'axios'
import { authStore } from '../auth/authStore'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
})

// Inject Bearer token ke setiap request kalau ada
api.interceptors.request.use((config) => {
    const token = authStore.getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Kalau 401, clear token dan redirect ke login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            authStore.clear()
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login'
            }
        }
        return Promise.reject(err)
    }
)
