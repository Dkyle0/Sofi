<script setup lang="ts">
import { useRouter } from 'vue-router'
import AccountPanel from '@/components/header/components/AccountPanel.vue'
import LogoIcon from '@/assets/icons/logo.svg'

defineEmits<{
  'toggle-mobile-menu': []
}>()

const router = useRouter()

function goToDashboard() {
  void router.push({ name: 'Dashboard' })
}
</script>

<template>
  <v-app-bar app height="90" color="white" elevation="0" class="app-header">
    <div class="py-5 px-10 d-flex align-center h-100 w-100">
      <v-toolbar-title class="d-flex align-center">
        <v-btn
          aria-label="Перейти на главную"
          variant="text"
          class="logo-button"
          @click="goToDashboard"
        >
          <LogoIcon color="black" />
        </v-btn>
      </v-toolbar-title>

      <v-spacer />
      <AccountPanel @toggle-mobile-menu="$emit('toggle-mobile-menu')" />
    </div>
  </v-app-bar>
</template>

<style scoped>
.logo-button {
  min-width: 0;
  padding: 0;
}
</style>
