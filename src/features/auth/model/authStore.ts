import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/entities/user'
import { authGateway, type Credentials } from '../api/authGateway'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  function clearSession() {
    user.value = null
  }

  async function login(credentials: Credentials) {
    isLoading.value = true
    try {
      user.value = await authGateway.login(credentials)
      return true
    } catch {
      clearSession()
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await authGateway.logout()
    } catch {
      // Local session must still end when the server cannot acknowledge logout.
    } finally {
      clearSession()
      isLoading.value = false
    }
  }

  async function restoreSession() {
    isLoading.value = true
    try {
      user.value = await authGateway.restoreSession()
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    clearSession,
    login,
    logout,
    restoreSession,
  }
})
