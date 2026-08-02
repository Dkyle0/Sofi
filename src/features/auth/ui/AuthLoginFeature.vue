<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Credentials } from '../api/authGateway'
import { useAuthSession } from '../model/useAuthSession'

const props = defineProps<{
  initialCredentials?: Credentials
}>()

const router = useRouter()
const route = useRoute()
const { isLoading, login } = useAuthSession()

const username = ref(props.initialCredentials?.username ?? '')
const password = ref(props.initialCredentials?.password ?? '')
const error = ref('')
const showPassword = ref(false)

async function submit() {
  error.value = ''
  const success = await login({ username: username.value, password: password.value })

  if (!success) {
    error.value = 'Неверный логин или пароль'
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  await router.push(redirect)
}
</script>

<template>
  <v-container
    fluid
    class="d-flex flex-column flex-wrap align-center justify-center text-center auth-container"
  >
    <v-card class="pa-8 auth-card" elevation="2" width="380">
      <h1 class="auth-title mb-8">Вход в систему</h1>

      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="username"
          label="Логин"
          type="email"
          autocomplete="username"
          variant="solo"
          density="comfortable"
          hide-details
          class="mb-4 input-no-border"
        />

        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Пароль"
          autocomplete="current-password"
          variant="solo"
          density="comfortable"
          hide-details
          class="mb-6 input-no-border"
        >
          <template #append-inner>
            <v-btn
              icon
              variant="text"
              size="small"
              :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              @click="showPassword = !showPassword"
            >
              <v-icon :icon="showPassword ? '$eyeOff' : '$eye'" />
            </v-btn>
          </template>
        </v-text-field>

        <v-btn
          color="primary"
          block
          size="large"
          type="submit"
          :loading="isLoading"
          class="login-btn mb-2"
        >
          Войти
        </v-btn>

        <p v-if="error" class="text-error mt-4" role="alert" aria-live="polite">{{ error }}</p>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
.auth-container {
  min-height: 100dvh;
  background-color: var(--color-surface);
}

.auth-title {
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.auth-card {
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.login-btn {
  border-radius: var(--radius-control);
  font-weight: 600;
  text-transform: none;
}

.input-no-border :deep(.v-field) {
  background-color: var(--color-surface-muted) !important;
  border: none !important;
  border-radius: var(--radius-control) !important;
  box-shadow: none !important;
}

.input-no-border :deep(.v-field__overlay),
.input-no-border :deep(.v-field__outline) {
  display: none;
}
</style>
