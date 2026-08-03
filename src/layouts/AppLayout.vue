<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useDashboard } from '@/features/dashboard'
import { useUIStore } from '@/stores/uiStore'

import NavigationDrawer from '@/components/NavigationDrawer.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import { RouterView } from 'vue-router'

const display = useDisplay()
const uiStore = useUIStore()
const { isDrawerCollapsed, isDrawerVisible } = storeToRefs(uiStore)
const {
  snapshot: dashboardSnapshot,
  automationQuota,
  isLoading: isDashboardLoading,
  load: loadDashboard,
} = useDashboard()

const isDrawerPermanent = computed(() => display.mdAndUp.value)

onMounted(() => {
  if (!dashboardSnapshot.value && !isDashboardLoading.value) {
    void loadDashboard()
  }
})
</script>

<template>
  <v-app>
    <AppHeader @toggle-mobile-menu="uiStore.toggleDrawerVisibility" />

    <NavigationDrawer
      v-model="isDrawerVisible"
      :permanent="isDrawerPermanent"
      :collapsed="isDrawerCollapsed"
      :daily-responses-used="automationQuota?.sent"
      :daily-responses-limit="automationQuota?.limit"
      :is-daily-responses-loading="isDashboardLoading && !automationQuota"
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
