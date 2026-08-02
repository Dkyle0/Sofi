<script setup lang="ts">
import { FormTextFieldWithLabel } from '@/shared/ui'

const props = defineProps<{
  keywords: string
  inTitle: boolean
  inDescription: boolean
}>()

const emit = defineEmits<{
  'update:keywords': [value: string]
  'update:inTitle': [value: boolean]
  'update:inDescription': [value: boolean]
}>()

function useSuggestion() {
  const suggestion = 'специалист по тестированию'
  const nextValue = props.keywords ? `${props.keywords}, ${suggestion}` : suggestion
  emit('update:keywords', nextValue)
}
</script>

<template>
  <div>
    <FormTextFieldWithLabel
      :model-value="keywords"
      title="Ключевые слова *"
      description="Слова, которые нужно искать в вакансии"
      placeholder="Ключевые слова, через запятую"
      suggestion-text="специалист по тестированию"
      @update:model-value="$emit('update:keywords', $event)"
      @use-suggestion="useSuggestion"
    />

    <v-row no-gutters>
      <v-col cols="12" md="4" class="pr-md-4" />
      <v-col cols="12" md="8" class="ma-0 pa-0">
        <div class="text-body-1 font-weight-medium mb-2">Искать</div>
        <v-checkbox
          :model-value="inTitle"
          label="в названии вакансии"
          color="primary"
          density="compact"
          hide-details
          class="mb-1"
          @update:model-value="$emit('update:inTitle', Boolean($event))"
        />
        <v-checkbox
          :model-value="inDescription"
          label="в описании вакансии"
          color="primary"
          density="compact"
          hide-details
          @update:model-value="$emit('update:inDescription', Boolean($event))"
        />
      </v-col>
    </v-row>
  </div>
</template>
