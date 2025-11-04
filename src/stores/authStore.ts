import { defineStore } from 'pinia'
import {
  authApi,
  userApi,
  type LoginRequest,
  type UserDataResponse,
} from '@/shared/api/endpoints/auth.api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | UserDataResponse,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },

  actions: {
    async login(username: string, password: string) {
      this.loading = true
      try {
        const payload: LoginRequest = {
          grant_type: 'password',
          username,
          password,
        }

        const userData = await authApi.login(payload)
        this.user = userData
        return true
      } catch (err) {
        console.error('Ошибка входа:', err)
        this.user = null
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await authApi.logout()
      } catch (err) {
        console.error('Ошибка выхода (API):', err)
      } finally {
        this.user = null
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      this.loading = true
      try {
        const userData = await userApi.getMe()
        this.user = userData
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // Это не ошибка, а нормальная ситуация:
        // пользователь просто не залогинен (куки нет или она истекла).
        this.user = null
      } finally {
        this.loading = false
      }
    },
  },
})
