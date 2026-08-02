<script setup lang="ts">
import { useDisplay } from 'vuetify'
import SaveIcon from '@/assets/icons/save.svg'

defineProps<{
  count: number | null
  isCounting: boolean
  error: string | null
}>()

defineEmits<{
  calculate: []
}>()

const display = useDisplay()
</script>

<template>
  <v-col
    cols="12"
    md="4"
    class="d-flex flex-column"
    :class="{ 'pa-10': display.mdAndUp.value, 'pa-5': display.smAndDown.value }"
    :style="display.mdAndUp.value ? 'align-items: flex-end; justify-content: flex-start;' : ''"
  >
    <v-btn
      color="primary"
      size="x-large"
      elevation="0"
      :loading="isCounting"
      :disabled="isCounting"
      aria-label="Посчитать подходящие вакансии"
      class="rounded-xl-12 text-none button-with-icon"
      :class="{ 'mx-auto': display.smAndDown.value, 'align-self-end': display.mdAndUp.value }"
      @click="$emit('calculate')"
    >
      <SaveIcon class="mr-3" />
      Сохранить
    </v-btn>

    <div
      class="text-no-wrap found-vacancies-info d-flex align-center justify-center"
      :class="{ 'mx-auto': display.smAndDown.value, 'align-self-end': display.mdAndUp.value }"
      aria-live="polite"
      role="status"
    >
      <span class="found-vacancies-info-text">Найдено вакансий:</span>
      <v-progress-circular
        v-if="isCounting"
        class="ml-2"
        :size="15"
        indeterminate
        color="primary"
      />
      <span v-else class="text-h6 font-weight-bold ml-1">{{
        count?.toLocaleString('ru-RU') ?? '—'
      }}</span>
    </div>

    <p
      v-if="error"
      class="text-error text-caption mt-2 action-error"
      role="alert"
      aria-live="assertive"
    >
      {{ error }}
    </p>
  </v-col>
</template>

<style scoped>
.v-btn.button-with-icon {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

.found-vacancies-info {
  width: 100%;
  min-height: 34px;
  padding: 0 var(--space-2);
  margin-top: var(--space-2);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-control);
}

@media (min-width: 960px) {
  .v-btn.button-with-icon,
  .found-vacancies-info {
    width: 197px;
  }
}

.v-btn.rounded-xl-12 :deep(svg) {
  color: white;
  fill: white;
}

.rounded-xl-12 {
  border-radius: var(--radius-control) !important;
}

.found-vacancies-info-text {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
}

.action-error {
  max-width: 197px;
  text-align: right;
}
</style>
