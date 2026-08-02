import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './authStore'

export function useAuthSession() {
  const store = useAuthStore()
  const { user, isLoading } = storeToRefs(store)

  return {
    user,
    isLoading,
    isAuthenticated: computed(() => store.isAuthenticated),
    login: store.login,
    logout: store.logout,
  }
}
