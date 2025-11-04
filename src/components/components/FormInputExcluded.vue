<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import FormTextFieldWithLabel from '@/components/fields/FormTextFieldWithLabel.vue'

const store = useSearchStore()
</script>

<template>
  <div>
    <FormTextFieldWithLabel
      v-model="store.settings.excludedKeywords"
      title="Исключить слова"
      description="Убрать вакансии со словами"
      placeholder="Исключить слова, через запятую"
      suggestion-text=""
    />
  </div>
</template>
