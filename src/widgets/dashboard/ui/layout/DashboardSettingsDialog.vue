<script setup lang="ts">
import { computed } from 'vue'
import { mdiChevronDown, mdiChevronUp, mdiClose, mdiRestore } from '@mdi/js'

import {
  getDashboardWidgetSize,
  type DashboardLayoutItem,
  type DashboardWidgetId,
  type DashboardWidgetSize,
} from '../../model'
import type { DashboardWidgetDefinition } from './dashboardWidgetRegistry'

const props = defineProps<{
  modelValue: boolean
  widgets: readonly DashboardWidgetDefinition[]
  layout: DashboardLayoutItem[]
  order: DashboardWidgetId[]
  hiddenIds: DashboardWidgetId[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'visibility-change': [id: DashboardWidgetId, isVisible: boolean]
  move: [id: DashboardWidgetId, direction: -1 | 1]
  resize: [id: DashboardWidgetId, size: DashboardWidgetSize]
  reset: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const orderedWidgets = computed(() => {
  const byId = new Map(props.widgets.map((widget) => [widget.id, widget]))
  return props.order.flatMap((id) => {
    const widget = byId.get(id)
    return widget ? [widget] : []
  })
})

const layoutById = computed(() => new Map(props.layout.map((item) => [item.i, item])))
const hiddenIdSet = computed(() => new Set(props.hiddenIds))

const sizeOptions: Array<{ title: string; value: DashboardWidgetSize }> = [
  { title: 'Компактный', value: 'compact' },
  { title: 'Обычный', value: 'normal' },
  { title: 'Широкий', value: 'wide' },
]

function currentSize(id: DashboardWidgetId): DashboardWidgetSize {
  return getDashboardWidgetSize(layoutById.value.get(id)?.w ?? 4)
}

function updateSize(id: DashboardWidgetId, value: DashboardWidgetSize | null): void {
  if (value) emit('resize', id, value)
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="760" scrollable>
    <v-card class="dashboard-settings" rounded="lg">
      <v-card-title class="dashboard-settings__header">
        <div>
          <h2 class="dashboard-settings__title">Настройка виджетов</h2>
          <p class="dashboard-settings__subtitle">
            Выберите виджеты, порядок и ширину. Изменения сохраняются автоматически.
          </p>
        </div>
        <v-btn
          :icon="mdiClose"
          variant="text"
          size="small"
          aria-label="Закрыть настройки виджетов"
          @click="isOpen = false"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="dashboard-settings__list">
        <article
          v-for="(widget, index) in orderedWidgets"
          :key="widget.id"
          class="dashboard-settings__item"
        >
          <div class="dashboard-settings__identity">
            <v-switch
              :model-value="!hiddenIdSet.has(widget.id)"
              color="primary"
              density="compact"
              hide-details
              inset
              :label="widget.title"
              @update:model-value="emit('visibility-change', widget.id, Boolean($event))"
            />
            <p class="dashboard-settings__description">{{ widget.description }}</p>
          </div>

          <div class="dashboard-settings__controls">
            <div class="dashboard-settings__order" aria-label="Изменить порядок виджета">
              <v-btn
                :icon="mdiChevronUp"
                variant="text"
                size="small"
                :disabled="index === 0"
                :aria-label="`Переместить «${widget.title}» выше`"
                @click="emit('move', widget.id, -1)"
              />
              <v-btn
                :icon="mdiChevronDown"
                variant="text"
                size="small"
                :disabled="index === orderedWidgets.length - 1"
                :aria-label="`Переместить «${widget.title}» ниже`"
                @click="emit('move', widget.id, 1)"
              />
            </div>

            <v-select
              class="dashboard-settings__size"
              :model-value="currentSize(widget.id)"
              :items="sizeOptions"
              item-title="title"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              :aria-label="`Размер виджета «${widget.title}»`"
              @update:model-value="updateSize(widget.id, $event)"
            />
          </div>
        </article>
      </v-card-text>

      <v-divider />

      <v-card-actions class="dashboard-settings__actions">
        <v-btn :prepend-icon="mdiRestore" variant="text" @click="emit('reset')">
          Сбросить раскладку
        </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="isOpen = false">Готово</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dashboard-settings__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 24px;
  white-space: normal;
}

.dashboard-settings__title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}

.dashboard-settings__subtitle,
.dashboard-settings__description {
  color: var(--color-text-muted);
}

.dashboard-settings__subtitle {
  margin-top: var(--space-1);
  font-size: 14px;
}

.dashboard-settings__list {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) 24px;
}

.dashboard-settings__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-4);
  padding: 12px;
  border-radius: var(--radius-control);
  background: var(--color-surface-muted);
}

.dashboard-settings__identity {
  min-width: 0;
}

.dashboard-settings__identity :deep(.v-label) {
  color: var(--color-text);
  font-weight: 600;
  opacity: 1;
}

.dashboard-settings__description {
  padding-left: 52px;
  font-size: 12px;
  line-height: 1.4;
}

.dashboard-settings__controls,
.dashboard-settings__order {
  display: flex;
  align-items: center;
}

.dashboard-settings__controls {
  gap: var(--space-2);
}

.dashboard-settings__size {
  width: 150px;
}

.dashboard-settings__actions {
  padding: var(--space-4) 24px;
}

@media (max-width: 599px) {
  .dashboard-settings__header,
  .dashboard-settings__actions {
    padding: var(--space-4);
  }

  .dashboard-settings__list {
    padding: 12px var(--space-4);
  }

  .dashboard-settings__item {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-settings__controls {
    justify-content: space-between;
    padding-left: 44px;
  }

  .dashboard-settings__description {
    padding-left: 44px;
  }

  .dashboard-settings__actions {
    flex-wrap: wrap;
  }
}
</style>
