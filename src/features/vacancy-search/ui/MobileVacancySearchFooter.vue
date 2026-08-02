<script setup lang="ts">
import VacancySearchActionsPanel from './VacancySearchActionsPanel.vue'

defineProps<{
  count: number | null
  isCounting: boolean
  error: string | null
}>()

defineEmits<{
  calculate: []
}>()
</script>

<template>
  <v-footer app class="pa-5 bg-white mobile-search-footer" elevation="0">
    <v-row>
      <VacancySearchActionsPanel
        :count="count"
        :is-counting="isCounting"
        :error="error"
        @calculate="$emit('calculate')"
      />
    </v-row>
  </v-footer>
</template>

<style scoped>
.mobile-search-footer {
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 16px rgb(0 0 0 / 12%);
}
</style>
