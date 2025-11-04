<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | string[] | number | null
  title: string
  description: string
  placeholder: string
  suggestionText?: string
  suggestionAction?: () => void
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | number | null): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pr-md-4">
      <div class="field-header-wrapper mb-2">
        <div class="main-title">{{ title }}</div>
        <div class="text-caption text-grey-darken-1 mb-3">
          {{ description }}
        </div>
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

      <div v-if="suggestionText && suggestionAction" class="text-caption text-grey-darken-1 mb-6">
        например,
        <span class="text-primary cursor-pointer" @click="suggestionAction">
          {{ suggestionText }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.main-title {
  font-family: Wix Madefor Display;
  font-weight: 700;
  font-style: Bold;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-bottom: 4px;
}

.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
}
.cursor-pointer:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.v-col.pr-md-4 {
  padding-right: 16px !important;
}

.v-text-field.input-no-border :deep(.v-field) {
  border: none !important;
  box-shadow: none !important;
  background-color: #f9f9f9 !important;
  border-radius: 12px !important;
}

.v-text-field.input-no-border :deep(.v-field__overlay) {
  display: none !important;
}

.v-text-field.input-no-border :deep(.v-field__input::placeholder),
.v-text-field.input-no-border :deep(.v-field__input:-moz-placeholder) {
  color: #c5c5c7 !important;
  opacity: 1 !important;
}

.v-text-field.input-no-border :deep(.v-field__outline) {
  display: none;
}
</style>
