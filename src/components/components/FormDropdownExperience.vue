<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { useDisplay } from 'vuetify'

const store = useSearchStore()
const display = useDisplay()

const experienceOptions = store.experienceOptions
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pr-md-4">
      <div
        class="experience-header-wrapper mb-2"
        :class="{
          'mb-md-0': display.mdAndUp.value,
          'pt-2': display.mdAndUp.value,
        }"
      >
        <div class="main-title">Опыт работы</div>
      </div>
    </v-col>

    <v-col cols="12" md="8">
      <v-select
        v-model="store.settings.experienceLevel"
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
      />
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

.v-col.pr-md-4 {
  padding-right: 16px !important;
}

.v-select.rounded-select-no-border :deep(.v-field) {
  border: none !important;
  box-shadow: none !important;
  background-color: #f9f9f9 !important;
  border-radius: 12px !important;
}

.v-select.rounded-select-no-border :deep(.v-field__overlay) {
  display: none !important;
}

.v-select.rounded-select-no-border :deep(.v-field__outline) {
  display: none;
}
</style>
