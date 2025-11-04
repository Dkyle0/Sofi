import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0057ff',
          error: '#FF0004',
          success: '#16C098',
          warning: '#F59E0C',
          purple: '#7518D1',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(pinia)

async function initializeApp() {
  const authStore = useAuthStore()

  try {
    await authStore.fetchCurrentUser()
  } catch (error) {
    console.error('Критическая ошибка при восстановлении сессии:', error)
  }

  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

initializeApp()
