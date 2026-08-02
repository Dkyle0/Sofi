import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { isMockMode } from '@/app/config/env'
import { vuetify } from '@/app/providers/vuetify'
import { registerUnauthorizedHandler } from '@/shared/api/http'
import router from '@/router'
import { useAuthStore } from '@/features/auth'

export async function bootstrap() {
  if (isMockMode) {
    const { startMockWorker } = await import('@/app/mocks/browser')
    await startMockWorker()
  }

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(vuetify)

  const authStore = useAuthStore(pinia)
  registerUnauthorizedHandler(() => {
    authStore.clearSession()

    if (router.currentRoute.value.name !== 'Auth') {
      void router.replace({
        name: 'Auth',
        query: { redirect: router.currentRoute.value.fullPath },
      })
    }
  })

  await authStore.restoreSession()
  app.use(router)
  await router.isReady()
  app.mount('#app')
}
