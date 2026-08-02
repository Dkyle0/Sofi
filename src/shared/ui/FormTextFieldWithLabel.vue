<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  title: string
  description: string
  placeholder: string
  suggestionText?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'use-suggestion': []
}>()

const value = computed({
  get: () => props.modelValue,
  set: (nextValue: string) => emit('update:modelValue', nextValue),
})
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pr-md-4">
      <div class="field-header-wrapper mb-2">
        <div class="main-title">{{ title }}</div>
        <div class="text-caption text-grey-darken-1 mb-3">{{ description }}</div>
      </div>
    </v-col>

    <v-col cols="12" md="8">
      <v-text-field
        v-model="value"
        :placeholder="placeholder"
        variant="solo"
        density="compact"
        hide-details
        class="mb-1 input-no-border"
      />

      <div v-if="suggestionText" class="text-caption text-grey-darken-1 mb-6">
        например,
        <button type="button" class="suggestion-button" @click="$emit('use-suggestion')">
          {{ suggestionText }}
        </button>
      </div>
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

.suggestion-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
}

.suggestion-button:hover {
  opacity: 0.8;
}

.v-col.pr-md-4 {
  padding-right: var(--space-4) !important;
}

.v-text-field.input-no-border :deep(.v-field) {
  border: none !important;
  border-radius: var(--radius-control) !important;
  background-color: var(--color-surface-muted) !important;
  box-shadow: none !important;
}

.v-text-field.input-no-border :deep(.v-field__overlay),
.v-text-field.input-no-border :deep(.v-field__outline) {
  display: none !important;
}

.v-text-field.input-no-border :deep(.v-field__input::placeholder),
.v-text-field.input-no-border :deep(.v-field__input:-moz-placeholder) {
  color: #c5c5c7 !important;
  opacity: 1 !important;
}
</style>
