<script setup lang="ts">
import AccountPanel from '@/components/header/components/AccountPanel.vue'
import LogoIcon from '@/assets/icons/logo.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <v-app-bar app height="90" color="white" elevation="0" class="app-header">
    <div class="py-5 px-10 d-flex align-center h-100 w-100">
      <v-toolbar-title class="d-flex align-center cursor-pointer">
        <LogoIcon color="black" class="cursor-pointer" @click="goToDashboard" />
      </v-toolbar-title>

      <v-spacer />
      <AccountPanel />
    </div>
  </v-app-bar>
</template>

<style scoped>
.user-profile-wrapper {
  transition: opacity 0.2s ease;
}
.user-profile-wrapper:hover {
  opacity: 0.9;
}

.menu-down-icon {
  color: #9e9e9e;
  transition: transform 0.2s;
}

.text-caption a.hover-effect {
  transition: color 0.2s;
}
.text-caption a.hover-effect:hover {
  color: var(--v-theme-primary) !important;
}
</style>
