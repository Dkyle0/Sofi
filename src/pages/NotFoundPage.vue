<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <v-container
    fluid
    class="fill-height d-flex flex-column align-center justify-center text-center not-found-container"
  >
    <div class="error-code">404</div>
    <div class="error-title mt-4 mb-2">Страница не найдена</div>
    <div class="error-description mb-8">
      Похоже, вы перешли по несуществующему адресу или страница была удалена.
    </div>

    <v-btn color="primary" variant="flat" class="go-home-btn" size="large" @click="goHome">
      Вернуться на главную
    </v-btn>
  </v-container>
</template>

<style scoped>
.not-found-container {
  background: linear-gradient(180deg, #ffffff 0%, #f9fafc 100%);
  animation: fadeIn 0.6s ease-in-out;
}

.error-code {
  font-family: 'Wix Madefor Display', sans-serif;
  font-weight: 700;
  font-size: 120px;
  color: #1976d2;
  line-height: 1;
  letter-spacing: -2px;
  transition:
    transform 0.4s ease,
    color 0.4s ease;
}
.error-code:hover {
  transform: scale(1.05);
  color: #1565c0;
}

.error-title {
  font-family: 'Wix Madefor Display', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: #2c2c2c;
  letter-spacing: 0.2px;
}

.error-description {
  font-size: 16px;
  color: #707070;
  max-width: 500px;
}

.go-home-btn {
  border-radius: 10px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.25s ease-in-out;
  letter-spacing: 0.3px;
}

.go-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(25, 118, 210, 0.25);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
