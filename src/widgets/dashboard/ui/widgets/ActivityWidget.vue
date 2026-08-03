<script setup lang="ts">
import { computed } from 'vue'
import type {
  ActivityFilter,
  DashboardActivityItem,
  DashboardActivityType,
} from '@/features/dashboard'
import { formatDateTime } from './widgetFormatting'
import './widgetShared.css'

const props = defineProps<{
  activities: DashboardActivityItem[]
  filter: ActivityFilter
}>()

const emit = defineEmits<{
  'filter-change': [filter: ActivityFilter]
}>()

const filters: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'applications', label: 'Отклики' },
  { value: 'resume', label: 'Резюме' },
  { value: 'interviews', label: 'Интервью' },
]

const typeMeta: Record<DashboardActivityType, { label: string; symbol: string }> = {
  search: { label: 'Поиск', symbol: '⌕' },
  application: { label: 'Отклик', symbol: '↗' },
  resume: { label: 'Резюме', symbol: 'CV' },
  view: { label: 'Просмотр', symbol: '◉' },
  response: { label: 'Ответ', symbol: '↩' },
  interview: { label: 'Интервью', symbol: '◎' },
}

const filteredActivities = computed(() => {
  if (props.filter === 'all') return props.activities
  if (props.filter === 'applications') {
    return props.activities.filter((item) => ['application', 'response'].includes(item.type))
  }
  if (props.filter === 'resume') {
    return props.activities.filter((item) => item.type === 'resume')
  }
  return props.activities.filter((item) => item.type === 'interview')
})

function changeFilter(value: unknown) {
  if (filters.some((filter) => filter.value === value))
    emit('filter-change', value as ActivityFilter)
}
</script>

<template>
  <div class="dashboard-widget-content activity-widget">
    <v-btn-toggle
      :model-value="filter"
      class="activity-widget__filters"
      mandatory
      density="compact"
      variant="text"
      aria-label="Фильтр последних событий"
      @update:model-value="changeFilter"
    >
      <v-btn v-for="item in filters" :key="item.value" :value="item.value">
        {{ item.label }}
      </v-btn>
    </v-btn-toggle>

    <ol v-if="filteredActivities.length" class="activity-widget__list" aria-live="polite">
      <li v-for="item in filteredActivities" :key="item.id" class="activity-widget__item">
        <span class="activity-widget__symbol" :class="`is-${item.type}`" aria-hidden="true">
          {{ typeMeta[item.type].symbol }}
        </span>
        <div class="activity-widget__content">
          <p class="activity-widget__meta">
            <span>{{ typeMeta[item.type].label }}</span>
            <time :datetime="item.occurredAt">{{ formatDateTime(item.occurredAt) }}</time>
          </p>
          <strong class="dashboard-widget-title">{{ item.title }}</strong>
          <p class="activity-widget__description">{{ item.description }}</p>
        </div>
      </li>
    </ol>

    <div v-else class="dashboard-widget-empty" role="status">
      <p>В этой категории пока нет событий.</p>
    </div>
  </div>
</template>

<style scoped>
.activity-widget__filters {
  align-self: flex-start;
  flex: 0 0 auto;
  max-width: 100%;
  padding: 3px;
  overflow-x: auto;
  background: var(--color-surface-muted);
  border-radius: 10px;
}

.activity-widget__filters :deep(.v-btn) {
  min-width: auto;
  min-height: 30px;
  padding: 0 11px;
  border-radius: 8px !important;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.activity-widget__filters :deep(.v-btn--active) {
  color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 1px 4px rgb(0 0 0 / 8%);
}

.activity-widget__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
  min-width: 0;
  list-style: none;
}

.activity-widget__item {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.activity-widget__symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 750;
  background: var(--color-primary-soft);
  border-radius: 10px;
}

.activity-widget__symbol.is-interview,
.activity-widget__symbol.is-response {
  color: rgb(var(--v-theme-success));
  background: var(--color-success-soft);
}

.activity-widget__symbol.is-view {
  color: rgb(var(--v-theme-warning));
  background: var(--color-warning-soft);
}

.activity-widget__content {
  min-width: 0;
}

.activity-widget__meta {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.activity-widget__meta span {
  font-weight: 650;
}

.activity-widget__description {
  margin-top: 3px;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@container dashboard-widget (max-width: 760px) {
  .activity-widget__list {
    grid-template-columns: 1fr;
  }
}

@container dashboard-widget (max-width: 390px) {
  .activity-widget__filters {
    width: 100%;
    align-self: stretch;
    flex-wrap: nowrap;
    overflow-x: hidden;
  }

  .activity-widget__filters :deep(.v-btn) {
    min-width: 0;
    flex: 1 1 0;
    padding: 0 4px;
    font-size: 11px;
  }
}
</style>
