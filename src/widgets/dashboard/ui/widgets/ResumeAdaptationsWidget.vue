<script setup lang="ts">
import type {
  DashboardAdaptationStatus,
  DashboardCommand,
  DashboardResumeAdaptation,
} from '@/features/dashboard'
import { formatDateTime } from './widgetFormatting'
import './widgetShared.css'

defineProps<{
  adaptations: DashboardResumeAdaptation[]
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const statusLabels: Record<DashboardAdaptationStatus, string> = {
  base: 'Базовая',
  processing: 'Адаптируется',
  review: 'На проверке',
  approved: 'Подтверждена',
}

function approveAdaptation(adaptationId: string) {
  emit('command', { type: 'approve-resume', adaptationId })
}
</script>

<template>
  <div class="dashboard-widget-content adaptations-widget">
    <p v-if="actionError" class="dashboard-widget-action-error" role="alert" aria-live="assertive">
      {{ actionError }}
    </p>

    <ul v-if="adaptations.length" class="dashboard-widget-list">
      <li
        v-for="adaptation in adaptations"
        :key="adaptation.id"
        class="dashboard-widget-list-item adaptations-widget__item"
      >
        <div class="adaptations-widget__heading">
          <strong class="dashboard-widget-title">{{ adaptation.resumeName }}</strong>
          <span class="adaptations-widget__status" :class="`is-${adaptation.status}`">
            {{ statusLabels[adaptation.status] }}
          </span>
        </div>
        <p class="adaptations-widget__vacancy">
          {{ adaptation.vacancyTitle }} · {{ adaptation.company }}
        </p>
        <div class="adaptations-widget__footer">
          <time class="dashboard-widget-muted" :datetime="adaptation.updatedAt">
            {{ formatDateTime(adaptation.updatedAt) }}
          </time>
          <v-progress-circular
            v-if="adaptation.status === 'processing'"
            color="primary"
            size="20"
            width="2"
            indeterminate
            aria-label="Адаптация резюме выполняется"
          />
          <v-btn
            v-if="adaptation.status === 'review'"
            color="primary"
            variant="flat"
            size="small"
            class="dashboard-widget-button"
            :loading="busyCommand === 'approve-resume'"
            :disabled="busyCommand !== null"
            :aria-label="`Подтвердить адаптацию резюме для ${adaptation.vacancyTitle}`"
            @click="approveAdaptation(adaptation.id)"
          >
            Подтвердить
          </v-btn>
        </div>
      </li>
    </ul>

    <div v-else class="dashboard-widget-empty" role="status">
      <span class="adaptations-widget__empty-icon" aria-hidden="true">A+</span>
      <p>Адаптации появятся после выбора подходящей вакансии.</p>
    </div>
  </div>
</template>

<style scoped>
.adaptations-widget__heading,
.adaptations-widget__footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.adaptations-widget__status {
  flex: 0 0 auto;
  padding: 4px 8px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 650;
  background: var(--color-surface);
  border-radius: 999px;
}

.adaptations-widget__status.is-processing,
.adaptations-widget__status.is-review {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.adaptations-widget__status.is-approved {
  color: rgb(var(--v-theme-success));
  background: var(--color-success-soft);
}

.adaptations-widget__vacancy {
  margin: 6px 0 8px;
  overflow: hidden;
  color: var(--color-text);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.adaptations-widget__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-primary);
  font-weight: 800;
  background: var(--color-primary-soft);
  border-radius: 14px;
}
</style>
