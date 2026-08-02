import axios from 'axios'

// REAL API TRANSPORT: в обычном demo-режиме эти запросы перехватывает MSW.
let unauthorizedHandler: (() => void) | undefined

export function registerUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

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
    if (error.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)
