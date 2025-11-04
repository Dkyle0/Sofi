<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import SaveIcon from '@/assets/icons/save.svg'
import { useDisplay } from 'vuetify'

const store = useSearchStore()
const display = useDisplay()

defineEmits<{
  (e: 'save'): void
}>()
</script>

<template>
  <v-col
    cols="12"
    md="6"
    class="d-flex flex-column"
    :class="{
      'pa-10': display.mdAndUp.value,
      'pa-5': display.smAndDown.value,
    }"
    :style="display.mdAndUp.value ? 'align-items: flex-end; justify-content: flex-start;' : ''"
  >
    <v-btn
      color="primary"
      size="x-large"
      elevation="0"
      @click="$emit('save')"
      class="rounded-xl-12 text-none button-with-icon"
      :class="{
        'mx-auto': display.smAndDown.value,
        'align-self-end': display.mdAndUp.value,
      }"
    >
      <SaveIcon class="mr-3" />
      Сохранить
    </v-btn>

    <div
      class="text-no-wrap found-vacancies-info d-flex align-center justify-center"
      :class="{
        'mx-auto': display.smAndDown.value,
        'align-self-end': display.mdAndUp.value,
      }"
    >
      <span class="found-vacancies-info-text">Найдено вакансий:</span>
      <span lass="ma-2" v-if="store.isCounting"
        ><v-progress-circular :size="15" indeterminate color="primary" c />
      </span>
      <span v-else class="text-h6 font-weight-bold ml-1">{{
        store.vacanciesCount.toLocaleString('ru-RU')
      }}</span>
    </div>
  </v-col>
</template>

<style scoped>
.v-btn.button-with-icon {
  display: flex;
  align-items: center;

  font-family: Wix Madefor Display;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  height: 50px;
  width: 100%;
}

.found-vacancies-info {
  margin-top: 10px;
  border-radius: 12px;
  height: 34px;
  width: 100%;
  border: 1px solid #0057ff;
  padding: 0 10px;
}

@media (min-width: 960px) {
  .v-btn.button-with-icon,
  .found-vacancies-info {
    width: 197px;
  }
}

.v-btn.rounded-xl-12 :deep(svg) {
  fill: white;
  color: white;
}

.rounded-xl-12 {
  border-radius: 12px !important;
}

.found-vacancies-info-text {
  font-family: Wix Madefor Display;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}
</style>
