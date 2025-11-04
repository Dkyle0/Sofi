import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

export const http = axios.create({
  baseURL: '',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.user = null
      if (router && router.currentRoute.value.path !== '/login') {
        router.replace('/login')
      }
    }
    return Promise.reject(error)
  },
)
