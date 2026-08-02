<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useVacancySearch } from '../model/useVacancySearch'
import VacancySearchForm from './VacancySearchForm.vue'
import VacancySearchActionsPanel from './VacancySearchActionsPanel.vue'
import MobileVacancySearchFooter from './MobileVacancySearchFooter.vue'
import IndustrySelectionDialog from './IndustrySelectionDialog.vue'

const display = useDisplay()
const isIndustryDialogOpen = ref(false)
const {
  draft,
  vacanciesCount,
  isCounting,
  countError,
  updateDraft,
  setIndustries,
  removeIndustry,
  clearIndustries,
  calculateCount,
} = useVacancySearch()
</script>

<template>
  <div class="search-settings-content">
    <v-row class="search-settings-row">
      <v-col cols="12" md="8" lg="6" class="pa-10">
        <VacancySearchForm
          :draft="draft"
          @update:keywords="updateDraft({ keywords: $event })"
          @update:excluded-keywords="updateDraft({ excludedKeywords: $event })"
          @update:in-title="updateDraft({ inTitle: $event })"
          @update:in-description="updateDraft({ inDescription: $event })"
          @update:experience-level="updateDraft({ experienceLevel: $event })"
          @edit-industries="isIndustryDialogOpen = true"
          @remove-industry="removeIndustry($event)"
          @clear-industries="clearIndustries"
        />
      </v-col>

      <VacancySearchActionsPanel
        v-if="display.mdAndUp.value"
        :count="vacanciesCount"
        :is-counting="isCounting"
        :error="countError"
        @calculate="calculateCount"
      />
    </v-row>

    <MobileVacancySearchFooter
      v-if="display.smAndDown.value"
      :count="vacanciesCount"
      :is-counting="isCounting"
      :error="countError"
      @calculate="calculateCount"
    />

    <IndustrySelectionDialog
      v-model="isIndustryDialogOpen"
      :selected-industries="draft.industries"
      @save="setIndustries"
    />
  </div>
</template>

<style scoped>
.search-settings-content {
  display: flex;
  margin: 30px 40px;
  border-radius: var(--radius-card);
  background-color: var(--color-surface);
  justify-content: space-between;
}

/* The card owns its outer spacing. Do not let the temporary v3 grid
   compatibility margins pull its columns outside of that padding. */
.search-settings-row {
  margin: 0 !important;
}

@media (max-width: 599px) {
  .search-settings-content {
    margin: var(--space-4);
  }
}
</style>
