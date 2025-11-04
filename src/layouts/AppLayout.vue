<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useSearchStore } from '@/stores/searchStore'
import { useUIStore } from '@/stores/uiStore'

import NavigationDrawer from '@/components/NavigationDrawer.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import MobileFixedFooter from '@/components/components/MobileFixedFooter.vue'
import { RouterView } from 'vue-router'

const display = useDisplay()
const searchStore = useSearchStore()
const uiStore = useUIStore()

const isDrawerPermanent = computed(() => display.mdAndUp.value)
</script>

<template>
  <v-app>
    <AppHeader @toggle-drawer="uiStore.toggleDrawerVisibility()" />

    <NavigationDrawer
      v-model="uiStore.isDrawerVisible"
      :permanent="isDrawerPermanent"
      :temporary="!isDrawerPermanent"
    />

    <v-main>
      <RouterView />
    </v-main>

    <MobileFixedFooter
      v-if="display.smAndDown.value"
      @save="searchStore.fetchVacanciesCount()"
      :count="searchStore.vacanciesCount"
      :is-counting="searchStore.isCounting"
    />
  </v-app>
</template>

<style scoped>
.v-main {
  background-color: #f3f3f3;
  margin-top: 1px !important;
}
</style>
