import { defineStore } from 'pinia'
import type { User } from '@/entities/user'
import { authGateway, type Credentials } from '../api/authGateway'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    clearSession() {
      this.user = null
    },

    async login(credentials: Credentials) {
      this.isLoading = true
      try {
        this.user = await authGateway.login(credentials)
        return true
      } catch {
        this.clearSession()
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        await authGateway.logout()
      } catch {
        // Local session must still end when the server cannot acknowledge logout.
      } finally {
        this.clearSession()
        this.isLoading = false
      }
    },

    async restoreSession() {
      this.isLoading = true
      try {
        this.user = await authGateway.restoreSession()
      } finally {
        this.isLoading = false
      }
    },
  },
})
