import axios from 'axios'
import { startLoading, stopLoading } from './loadingState'
import { showApiError } from '@/utils/apiError'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// BEFORE every request → start loading
api.interceptors.request.use(
    (config) => {
        startLoading()
        return config
    },
    (error) => {
        stopLoading()
        return Promise.reject(error)
    }
)

// AFTER every request → stop loading
// If it failed → show specific error popup
api.interceptors.response.use(
    (response) => {
        stopLoading()
        return response
    },
    (error) => {
        stopLoading()

        if (!error.config?.silent) {
            showApiError(error)
        }
        
        return Promise.reject(error)
    }
)

export default api