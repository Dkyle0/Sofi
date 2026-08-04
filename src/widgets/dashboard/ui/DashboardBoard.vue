<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mdiChartBoxOutline, mdiRefresh, mdiTuneVariant } from '@mdi/js'
import { useRouter } from 'vue-router'

import {
  useDashboard,
  type ActivityFilter,
  type DashboardCommand,
  type DashboardPeriod,
} from '@/features/dashboard'
import type { DashboardWidgetBindings, DashboardWidgetId } from '../model'
import { DashboardBoard as DashboardLayoutBoard } from './layout'

const props = defineProps<{
  userId: string
  userName: string
}>()

const router = useRouter()
const {
  snapshot,
  period,
  isLoading,
  loadError,
  actionError,
  successMessage,
  setPeriod,
  clearFeedback,
  load,
  retry,
  execute,
} = useDashboard()

const activityFilter = ref<ActivityFilter>('all')
const busyCommand = ref<DashboardCommand['type'] | null>(null)
const lastCommandWidget = ref<DashboardWidgetId | null>(null)

const commandWidget: Record<DashboardCommand['type'], DashboardWidgetId> = {
  'set-automation': 'automation-today',
  'queue-match': 'best-matches',
  'dismiss-match': 'best-matches',
  'start-resume-improvement': 'resume-readiness',
  'run-resume-battle': 'resume-battle',
  'approve-resume': 'resume-adaptations',
  'resolve-attention': 'attention',
}

const updatedLabel = computed(() => {
  if (!snapshot.value) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(snapshot.value.generatedAt))
})

function setActivityFilter(filter: ActivityFilter): void {
  activityFilter.value = filter
}

function setDashboardPeriod(value: unknown): void {
  if (value === 7 || value === 30) {
    setPeriod(value satisfies DashboardPeriod)
  }
}

function getActionError(widgetId: DashboardWidgetId): string | null {
  return lastCommandWidget.value === widgetId ? actionError.value : null
}

async function handleCommand(command: DashboardCommand): Promise<void> {
  if (busyCommand.value) return

  busyCommand.value = command.type
  lastCommandWidget.value = commandWidget[command.type]

  try {
    await execute(command)
  } finally {
    busyCommand.value = null
  }
}

function openPositions(): void {
  void router.push({ name: 'Positions' })
}

const widgetBindings = computed<DashboardWidgetBindings>(() => {
  const data = snapshot.value
  if (!data) return {}

  return {
    'automation-today': {
      automation: data.automation,
      busyCommand: busyCommand.value,
      actionError: getActionError('automation-today'),
      onCommand: handleCommand,
    },
    funnel: {
      metrics: data.funnel[period.value],
      period: period.value,
    },
    dynamics: {
      points: data.dynamics[period.value],
      period: period.value,
    },
    'active-positions': {
      positions: data.positions,
      onNavigate: openPositions,
    },
    'best-matches': {
      matches: data.matches,
      busyCommand: busyCommand.value,
      actionError: getActionError('best-matches'),
      onCommand: handleCommand,
    },
    'resume-readiness': {
      resume: data.resume,
      busyCommand: busyCommand.value,
      actionError: getActionError('resume-readiness'),
      onCommand: handleCommand,
    },
    'resume-battle': {
      battle: data.resumeBattle,
      resume: data.resume,
      busyCommand: busyCommand.value,
      actionError: getActionError('resume-battle'),
      onCommand: handleCommand,
    },
    'resume-adaptations': {
      adaptations: data.adaptations,
      busyCommand: busyCommand.value,
      actionError: getActionError('resume-adaptations'),
      onCommand: handleCommand,
    },
    attention: {
      items: data.attention,
      busyCommand: busyCommand.value,
      actionError: getActionError('attention'),
      onCommand: handleCommand,
    },
    activity: {
      activities: data.activities,
      filter: activityFilter.value,
      onFilterChange: setActivityFilter,
    },
  }
})

onMounted(() => {
  if (!snapshot.value && !isLoading.value) {
    void load()
  }
})
</script>

<template>
  <div class="dashboard-page">
    <section
      v-if="isLoading && !snapshot"
      class="dashboard-page__state"
      aria-label="Загрузка персональной панели"
      aria-busy="true"
    >
      <div class="dashboard-page__standalone-heading">
        <v-skeleton-loader width="340" type="heading, text" />
      </div>
      <div class="dashboard-page__skeleton-grid">
        <v-skeleton-loader v-for="index in 6" :key="index" type="heading, paragraph, actions" />
      </div>
    </section>

    <section v-else-if="loadError" class="dashboard-page__state dashboard-page__error" role="alert">
      <v-icon :icon="mdiChartBoxOutline" size="44" color="primary" aria-hidden="true" />
      <h1>Панель пока недоступна</h1>
      <p>{{ loadError }}</p>
      <v-btn
        color="primary"
        variant="flat"
        :prepend-icon="mdiRefresh"
        :loading="isLoading"
        @click="retry"
      >
        Попробовать ещё раз
      </v-btn>
    </section>

    <DashboardLayoutBoard
      v-else-if="snapshot"
      :user-id="props.userId"
      :widget-bindings="widgetBindings"
    >
      <template #toolbar="{ openSettings }">
        <div class="dashboard-page__toolbar-content">
          <div class="dashboard-page__heading">
            <span class="dashboard-page__eyebrow">Личная панель</span>
            <h1>Здравствуйте, {{ props.userName }}</h1>
            <p>
              Главное по поиску работы и резюме
              <span v-if="updatedLabel">· обновлено в {{ updatedLabel }}</span>
            </p>
          </div>

          <div class="dashboard-page__period">
            <span id="dashboard-period-label">Период аналитики</span>
            <div class="dashboard-page__controls">
              <v-btn-toggle
                :model-value="period"
                mandatory
                density="compact"
                variant="text"
                aria-labelledby="dashboard-period-label"
                @update:model-value="setDashboardPeriod"
              >
                <v-btn :value="7">7 дней</v-btn>
                <v-btn :value="30">30 дней</v-btn>
              </v-btn-toggle>
              <v-btn
                :prepend-icon="mdiTuneVariant"
                variant="outlined"
                color="primary"
                @click="openSettings"
              >
                Настроить виджеты
              </v-btn>
            </div>
          </div>
        </div>
      </template>
    </DashboardLayoutBoard>

    <v-snackbar
      :model-value="Boolean(successMessage)"
      color="success"
      location="bottom end"
      :timeout="3000"
      @update:model-value="!$event && clearFeedback()"
    >
      <span aria-live="polite">{{ successMessage }}</span>
    </v-snackbar>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-width: 0;
  min-height: calc(100dvh - 88px);
  padding: 40px;
}

.dashboard-page__toolbar-content {
  display: flex;
  min-width: 0;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.dashboard-page__heading {
  min-width: 0;
}

.dashboard-page__eyebrow {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dashboard-page__heading h1 {
  font-size: clamp(26px, 2.2vw, 36px);
  font-weight: 750;
  line-height: 1.15;
}

.dashboard-page__heading p {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-size: 14px;
}

.dashboard-page__period {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: 12px;
}

.dashboard-page__controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.dashboard-page__period .v-btn-toggle {
  padding: 3px;
  border-radius: var(--radius-control);
  background: var(--color-surface);
}

.dashboard-page__period .v-btn {
  min-height: 34px;
  border-radius: 9px !important;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
}

.dashboard-page__period .v-btn--active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.dashboard-page__state {
  width: 100%;
}

.dashboard-page__standalone-heading {
  margin-bottom: 24px;
}

.dashboard-page__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.dashboard-page__skeleton-grid .v-skeleton-loader {
  min-height: 304px;
  border-radius: var(--radius-card);
}

.dashboard-page__error {
  display: grid;
  min-height: min(560px, calc(100dvh - 168px));
  place-content: center;
  justify-items: center;
  gap: var(--space-2);
  text-align: center;
}

.dashboard-page__error h1 {
  font-size: 28px;
}

.dashboard-page__error p {
  max-width: 460px;
  margin-bottom: var(--space-2);
  color: var(--color-text-muted);
}

@media (max-width: 1279px) {
  .dashboard-page {
    padding: 24px;
  }

  .dashboard-page__skeleton-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  }
}

@media (max-width: 767px) {
  .dashboard-page__toolbar-content {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 599px) {
  .dashboard-page {
    min-height: calc(100dvh - 64px);
    padding: var(--space-4);
  }

  .dashboard-page__controls {
    flex-wrap: wrap;
  }

  .dashboard-page__period,
  .dashboard-page__period .v-btn-toggle {
    width: 100%;
  }

  .dashboard-page__period .v-btn {
    flex: 1;
  }

  .dashboard-page__skeleton-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
