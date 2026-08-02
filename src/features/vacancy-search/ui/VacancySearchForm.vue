<script setup lang="ts">
import type { VacancySearchDraft, ExperienceLevel } from '../model/types'
import KeywordsField from './KeywordsField.vue'
import ExcludedKeywordsField from './ExcludedKeywordsField.vue'
import IndustryField from './IndustryField.vue'
import ExperienceLevelField from './ExperienceLevelField.vue'

defineProps<{
  draft: VacancySearchDraft
}>()

defineEmits<{
  'update:keywords': [value: string]
  'update:excludedKeywords': [value: string]
  'update:inTitle': [value: boolean]
  'update:inDescription': [value: boolean]
  'update:experienceLevel': [value: ExperienceLevel]
  'edit-industries': []
  'remove-industry': [industryId: string]
  'clear-industries': []
}>()
</script>

<template>
  <v-form class="form-wrapper">
    <v-row>
      <v-col cols="12">
        <KeywordsField
          class="mb-8"
          :keywords="draft.keywords"
          :in-title="draft.inTitle"
          :in-description="draft.inDescription"
          @update:keywords="$emit('update:keywords', $event)"
          @update:in-title="$emit('update:inTitle', $event)"
          @update:in-description="$emit('update:inDescription', $event)"
        />
      </v-col>

      <v-col cols="12">
        <ExcludedKeywordsField
          class="mb-8"
          :excluded-keywords="draft.excludedKeywords"
          @update:excluded-keywords="$emit('update:excludedKeywords', $event)"
        />
      </v-col>

      <v-col cols="12">
        <IndustryField
          class="mb-8"
          :industries="draft.industries"
          @edit="$emit('edit-industries')"
          @remove="$emit('remove-industry', $event)"
          @clear="$emit('clear-industries')"
        />
      </v-col>

      <v-col cols="12">
        <ExperienceLevelField
          class="mb-8"
          :experience-level="draft.experienceLevel"
          @update:experience-level="$emit('update:experienceLevel', $event)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
.form-wrapper {
  max-width: 850px;
}
</style>
