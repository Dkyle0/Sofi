<script setup lang="ts">
import { experienceOptions, type ExperienceLevel } from '../model/types'

defineProps<{
  experienceLevel: ExperienceLevel
}>()

defineEmits<{
  'update:experienceLevel': [value: ExperienceLevel]
}>()
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pr-md-4">
      <div class="experience-header-wrapper mb-2 pt-md-2">
        <div class="main-title">Опыт работы</div>
      </div>
    </v-col>

    <v-col cols="12" md="8">
      <v-select
        :model-value="experienceLevel"
        :items="experienceOptions"
        item-title="title"
        item-value="value"
        label="Выберите уровень опыта"
        placeholder="Выберите уровень опыта"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-6 rounded-select-no-border"
        @update:model-value="$emit('update:experienceLevel', $event ?? null)"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
.main-title {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: var(--space-1);
}

.v-col.pr-md-4 {
  padding-right: var(--space-4) !important;
}

.v-select.rounded-select-no-border :deep(.v-field) {
  border: none !important;
  border-radius: var(--radius-control) !important;
  background-color: var(--color-surface-muted) !important;
  box-shadow: none !important;
}

.v-select.rounded-select-no-border :deep(.v-field__overlay),
.v-select.rounded-select-no-border :deep(.v-field__outline) {
  display: none !important;
}
</style>
