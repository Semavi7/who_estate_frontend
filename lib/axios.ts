import axios from 'axios'
import { store } from './redux/store'
import { logout } from './redux/authSlice'
import { toast } from 'sonner'

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout())
            if (window.location.pathname !== '/') {
                toast.error('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.')
            }

        }
        return Promise.reject(error)
    }
)
export default api