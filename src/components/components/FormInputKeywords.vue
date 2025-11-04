<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import FormTextFieldWithLabel from '@/components/fields/FormTextFieldWithLabel.vue'

const store = useSearchStore()

// Обработчик для клика на подсказку "специалист по тестированию"
const setKeywordSuggestion = () => {
  if (store.settings.keywords) {
    store.settings.keywords += ', специалист по тестированию'
  } else {
    store.settings.keywords = 'специалист по тестированию'
  }
}
</script>

<template>
  <div>
    <FormTextFieldWithLabel
      v-model="store.settings.keywords"
      title="Ключевые слова *"
      description="Слова, которые нужно искать в вакансии"
      placeholder="Ключевые слова, через запятую"
      suggestion-text="специалист по тестированию"
      :suggestion-action="setKeywordSuggestion"
    />
    <v-row no-gutters>
      <v-col cols="12" md="4" class="pr-md-4"></v-col>

      <v-col cols="12" md="8" class="ma-0 pa-0">
        <div class="text-body-1 font-weight-medium mb-2">Искать</div>

        <v-checkbox
          v-model="store.settings.inTitle"
          label="в названии вакансии"
          color="primary"
          density="compact"
          hide-details
          class="mb-1"
        ></v-checkbox>

        <v-checkbox
          v-model="store.settings.inDescription"
          label="в описании вакансии"
          color="primary"
          density="compact"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
