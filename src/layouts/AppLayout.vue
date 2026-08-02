<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useUIStore } from '@/stores/uiStore'

import NavigationDrawer from '@/components/NavigationDrawer.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import { RouterView } from 'vue-router'

const display = useDisplay()
const uiStore = useUIStore()
const { isDrawerCollapsed, isDrawerVisible } = storeToRefs(uiStore)

const isDrawerPermanent = computed(() => display.mdAndUp.value)
</script>

<template>
  <v-app>
    <AppHeader @toggle-mobile-menu="uiStore.toggleDrawerVisibility" />

    <NavigationDrawer
      v-model="isDrawerVisible"
      :permanent="isDrawerPermanent"
      :collapsed="isDrawerCollapsed"
      @toggle-collapse="uiStore.toggleDrawerCollapse"
    />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  background-color: #f3f3f3;
  margin-top: 1px !important;
}
</style>
