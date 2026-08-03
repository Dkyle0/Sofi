<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardAutomation, DashboardCommand } from '@/features/dashboard'
import { formatTime } from './widgetFormatting'
import './widgetShared.css'

const props = defineProps<{
  automation: DashboardAutomation
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const statusMeta = computed(() => {
  switch (props.automation.status) {
    case 'active':
      return { label: 'Автоотклики активны', className: 'is-active' }
    case 'paused':
      return { label: 'Автоотклики на паузе', className: 'is-paused' }
    case 'attention':
      return { label: 'Требуется внимание', className: 'is-attention' }
  }

  return { label: 'Автоотклики на паузе', className: 'is-paused' }
})

const quotaProgress = computed(() => {
  if (props.automation.dailyLimit <= 0) return 0
  return Math.min(100, (props.automation.sentToday / props.automation.dailyLimit) * 100)
})

const isBusy = computed(() => props.busyCommand === 'set-automation')

function toggleAutomation() {
  emit('command', {
    type: 'set-automation',
    status: props.automation.status === 'active' ? 'paused' : 'active',
  })
}
</script>

<template>
  <div class="dashboard-widget-content automation-widget">
    <div class="automation-widget__status" :class="statusMeta.className" role="status">
      <span class="automation-widget__status-dot" aria-hidden="true" />
      {{ statusMeta.label }}
    </div>

    <div>
      <div class="automation-widget__quota-line">
        <strong>{{ automation.sentToday }} из {{ automation.dailyLimit }}</strong>
        <span class="dashboard-widget-muted">откликов сегодня</span>
      </div>
      <v-progress-linear
        class="automation-widget__progress"
        :model-value="quotaProgress"
        color="primary"
        bg-color="var(--color-primary-soft)"
        height="8"
        rounded
        :aria-label="`Использовано ${automation.sentToday} из ${automation.dailyLimit} откликов`"
      />
    </div>

    <dl class="automation-widget__schedule">
      <div>
        <dt>Последний запуск</dt>
        <dd>{{ formatTime(automation.lastRunAt) }}</dd>
      </div>
      <div>
        <dt>Следующий запуск</dt>
        <dd>{{ formatTime(automation.nextRunAt) }}</dd>
      </div>
    </dl>

    <p v-if="actionError" class="dashboard-widget-action-error" role="alert" aria-live="assertive">
      {{ actionError }}
    </p>

    <v-btn
      class="dashboard-widget-button mt-auto"
      :color="automation.status === 'active' ? undefined : 'primary'"
      :variant="automation.status === 'active' ? 'outlined' : 'flat'"
      :loading="isBusy"
      :disabled="isBusy"
      @click="toggleAutomation"
    >
      {{ automation.status === 'active' ? 'Поставить на паузу' : 'Возобновить' }}
    </v-btn>
  </div>
</template>

<style scoped>
.automation-widget__status {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  align-self: flex-start;
  min-height: 30px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
}

.automation-widget__status.is-active {
  background: var(--color-success-soft);
}

.automation-widget__status.is-paused {
  background: var(--color-surface-muted);
}

.automation-widget__status.is-attention {
  background: var(--color-warning-soft);
}

.automation-widget__status-dot {
  width: 8px;
  height: 8px;
  background: currentcolor;
  border-radius: 50%;
}

.automation-widget__status.is-active .automation-widget__status-dot {
  color: rgb(var(--v-theme-success));
}

.automation-widget__status.is-paused .automation-widget__status-dot {
  color: var(--color-text-muted);
}

.automation-widget__status.is-attention .automation-widget__status-dot {
  color: rgb(var(--v-theme-warning));
}

.automation-widget__quota-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.automation-widget__quota-line strong {
  font-size: 24px;
  line-height: 1.2;
}

.automation-widget__progress {
  overflow: hidden;
  border-radius: 999px;
}

.automation-widget__schedule {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.automation-widget__schedule div {
  min-width: 0;
  padding: 10px;
  background: var(--color-surface-muted);
  border-radius: 10px;
}

.automation-widget__schedule dt {
  color: var(--color-text-muted);
  font-size: 12px;
}

.automation-widget__schedule dd {
  margin: 4px 0 0;
  font-size: 15px;
  font-weight: 650;
}
</style>
