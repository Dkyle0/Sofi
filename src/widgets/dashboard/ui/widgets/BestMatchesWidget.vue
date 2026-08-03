<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardCommand, DashboardMatch } from '@/features/dashboard'
import './widgetShared.css'

const props = defineProps<{
  matches: DashboardMatch[]
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const visibleMatches = computed(() => props.matches.filter((match) => match.status !== 'dismissed'))

function queueMatch(vacancyId: string) {
  emit('command', { type: 'queue-match', vacancyId })
}

function dismissMatch(vacancyId: string) {
  emit('command', { type: 'dismiss-match', vacancyId })
}
</script>

<template>
  <div class="dashboard-widget-content matches-widget">
    <p v-if="actionError" class="dashboard-widget-action-error" role="alert" aria-live="assertive">
      {{ actionError }}
    </p>

    <ul v-if="visibleMatches.length" class="matches-widget__list">
      <li v-for="match in visibleMatches" :key="match.id" class="matches-widget__item">
        <div class="matches-widget__score" :aria-label="`Совпадение ${match.score} процентов`">
          <strong>{{ match.score }}</strong>
          <span>%</span>
        </div>

        <div class="matches-widget__info">
          <strong class="dashboard-widget-title">{{ match.title }}</strong>
          <p class="matches-widget__company">{{ match.company }}</p>
          <p class="dashboard-widget-muted">{{ match.salary }} · {{ match.workFormat }}</p>
          <div
            v-if="match.reasons.length"
            class="matches-widget__reasons"
            aria-label="Причины совпадения"
          >
            <span
              v-for="reason in match.reasons.slice(0, 3)"
              :key="reason"
              class="dashboard-widget-chip"
            >
              {{ reason }}
            </span>
          </div>
        </div>

        <div class="matches-widget__actions">
          <span v-if="match.status === 'queued'" class="matches-widget__queued" role="status">
            В очереди
          </span>
          <v-btn
            v-else
            color="primary"
            variant="flat"
            size="small"
            class="dashboard-widget-button"
            :loading="busyCommand === 'queue-match'"
            :disabled="busyCommand !== null"
            :aria-label="`Добавить вакансию ${match.title} в очередь`"
            @click="queueMatch(match.id)"
          >
            В очередь
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            :disabled="busyCommand !== null"
            :aria-label="`Скрыть вакансию ${match.title}`"
            @click="dismissMatch(match.id)"
          >
            <span class="matches-widget__close" aria-hidden="true">×</span>
          </v-btn>
        </div>
      </li>
    </ul>

    <div v-else class="dashboard-widget-empty" role="status">
      <span class="matches-widget__empty-score" aria-hidden="true">✓</span>
      <p>Новые совпадения появятся после следующего запуска поиска.</p>
    </div>
  </div>
</template>

<style scoped>
.matches-widget__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
  list-style: none;
}

.matches-widget__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  min-width: 0;
  padding: 12px;
  background: var(--color-surface-muted);
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  transition: border-color 0.2s ease;
}

.matches-widget__item:hover {
  border-color: rgb(var(--v-theme-primary) / 22%);
}

.matches-widget__score,
.matches-widget__empty-score {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: baseline;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding-top: 10px;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: 50%;
}

.matches-widget__score strong {
  font-size: 18px;
  line-height: 1;
}

.matches-widget__score span {
  font-size: 10px;
}

.matches-widget__info {
  min-width: 0;
}

.matches-widget__company {
  margin: 3px 0 2px;
  color: var(--color-text);
  font-size: 13px;
}

.matches-widget__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.matches-widget__actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.matches-widget__queued {
  padding: 6px 9px;
  color: rgb(var(--v-theme-success));
  font-size: 12px;
  font-weight: 600;
  background: var(--color-success-soft);
  border-radius: 999px;
}

.matches-widget__close {
  color: var(--color-text-muted);
  font-size: 22px;
  line-height: 1;
}

.matches-widget__empty-score {
  align-items: center;
  padding: 0;
  font-size: 22px;
}

@container dashboard-widget (max-width: 760px) {
  .matches-widget__list {
    grid-template-columns: 1fr;
  }
}

@container dashboard-widget (max-width: 420px) {
  .matches-widget__item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .matches-widget__actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
