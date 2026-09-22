import axios from 'axios'
import { startLoading, stopLoading } from './loadingState'
import { showApiError } from '@/utils/apiError'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

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
        showApiError(error)
        return Promise.reject(error)
    }
)

export default api