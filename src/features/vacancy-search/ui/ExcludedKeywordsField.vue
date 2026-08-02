<script setup lang="ts">
import { FormTextFieldWithLabel } from '@/shared/ui'

defineProps<{
  excludedKeywords: string
}>()

defineEmits<{
  'update:excludedKeywords': [value: string]
}>()
</script>

<template>
  <FormTextFieldWithLabel
    :model-value="excludedKeywords"
    title="Исключить слова"
    description="Убрать вакансии со словами"
    placeholder="Исключить слова, через запятую"
    @update:model-value="$emit('update:excludedKeywords', $event)"
  />
</template>
