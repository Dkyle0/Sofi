<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  const success = await auth.login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<template>
  <v-container
    fluid
    class="fill-height d-flex flex-column align-center justify-center text-center auth-container"
  >
    <v-card class="pa-8 auth-card" elevation="2" width="380">
      <h1 class="auth-title mb-8">Вход в систему</h1>

      <v-text-field
        v-model="username"
        label="Логин"
        type="text"
        variant="solo"
        density="comfortable"
        hide-details
        class="mb-4 input-no-border"
      />

      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Пароль"
        variant="solo"
        density="comfortable"
        hide-details
        class="mb-6 input-no-border"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-btn
        color="primary"
        block
        size="large"
        :loading="auth.loading"
        class="login-btn mb-2"
        @click="handleLogin"
      >
        Войти
      </v-btn>

      <div v-if="error" class="text-error mt-4">{{ error }}</div>
    </v-card>
  </v-container>
</template>

<style scoped>
.auth-container {
  background-color: #ffffff;
}

.auth-title {
  font-family: 'Wix Madefor Display', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: #2c2c2c;
  text-align: center;
}

.auth-card {
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.login-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 10px;
}

.input-no-border :deep(.v-field) {
  border: none !important;
  box-shadow: none !important;
  background-color: #f9f9f9 !important;
  border-radius: 12px !important;
}
.input-no-border :deep(.v-field__overlay) {
  display: none !important;
}
.input-no-border :deep(.v-field__outline) {
  display: none;
}
.input-no-border :deep(.v-field__input::placeholder) {
  color: #b0b0b0;
}
</style>
