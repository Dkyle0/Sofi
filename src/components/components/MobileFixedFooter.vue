<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import SearchActionsPanel from '@/components/components/SearchActionsPanel.vue'

const store = useSearchStore()
</script>

<template>
  <v-footer app class="pa-5 bg-white" :elevation="8" :style="{ borderTop: '1px solid #eee' }">
    <v-row>
      <SearchActionsPanel @save="store.fetchVacanciesCount()" />
    </v-row>
  </v-footer>
</template>

<style scoped></style>
