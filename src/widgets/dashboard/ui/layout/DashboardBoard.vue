<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mdiRestore, mdiTuneVariant } from '@mdi/js'
import { GridItem, GridLayout, type Layout } from 'grid-layout-plus'
import { useDisplay } from 'vuetify'

import {
  DASHBOARD_COLUMN_COUNT,
  DASHBOARD_GRID_GAP,
  DASHBOARD_ROW_HEIGHT,
  DASHBOARD_WIDGET_IDS,
  useDashboardLayout,
  type DashboardLayoutItem,
  type DashboardWidgetBindings,
  type DashboardWidgetId,
} from '../../model'
import DashboardSettingsDialog from './DashboardSettingsDialog.vue'
import DashboardWidgetFrame from './DashboardWidgetFrame.vue'
import {
  dashboardWidgetRegistry,
  dashboardWidgetRegistryById,
  type DashboardWidgetDefinition,
} from './dashboardWidgetRegistry'

const props = withDefaults(
  defineProps<{
    userId: string
    widgetBindings?: DashboardWidgetBindings
  }>(),
  {
    widgetBindings: () => ({}),
  },
)

defineSlots<{
  toolbar?: () => unknown
  widget?: (props: {
    definition: DashboardWidgetDefinition
    bindings: Record<string, unknown>
  }) => unknown
}>()

const display = useDisplay()
const settingsOpen = ref(false)
const desktopLayout = ref<Layout>([])

const {
  state,
  visibleItems,
  hiddenIds,
  hasVisibleWidgets,
  updateVisibleLayout,
  hideWidget,
  setWidgetVisibility,
  moveWidget,
  setWidgetSize,
  restoreAllWidgets,
  resetLayout,
} = useDashboardLayout(() => props.userId)

const isDesktopLayout = computed(() => display.lgAndUp.value)
const visibleDefinitions = computed(() => {
  const visibleIds = new Set(visibleItems.value.map(({ i }) => i))
  return state.value.order.flatMap((id) => {
    const definition = dashboardWidgetRegistryById.get(id)
    return definition && visibleIds.has(id) ? [definition] : []
  })
})

function getDefinition(id: DashboardWidgetId): DashboardWidgetDefinition {
  const definition = dashboardWidgetRegistryById.get(id)
  if (!definition) throw new Error(`Неизвестный dashboard widget: ${id}`)
  return definition
}

function getBindings(id: DashboardWidgetId): Record<string, unknown> {
  return props.widgetBindings[id] ?? {}
}

function isDashboardWidgetId(value: string | number): value is DashboardWidgetId {
  return typeof value === 'string' && DASHBOARD_WIDGET_IDS.some((id) => id === value)
}

function handleLayoutUpdated(layout: Layout): void {
  const constraintsById = new Map(state.value.items.map((item) => [item.i, item]))
  const normalized = layout.flatMap<DashboardLayoutItem>((item) => {
    if (!isDashboardWidgetId(item.i)) return []

    const constraints = constraintsById.get(item.i)
    if (!constraints) return []

    return [
      {
        ...constraints,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      },
    ]
  })

  const hasLayoutChanged = normalized.some((item) => {
    const current = constraintsById.get(item.i)
    return (
      !current ||
      current.x !== item.x ||
      current.y !== item.y ||
      current.w !== item.w ||
      current.h !== item.h
    )
  })

  if (!hasLayoutChanged) return

  updateVisibleLayout(normalized)
}

watch(
  visibleItems,
  (items) => {
    desktopLayout.value = items.map((item) => ({ ...item }))
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <section class="dashboard-board" aria-label="Персональная панель Sofi">
    <div class="dashboard-board__toolbar">
      <div class="dashboard-board__toolbar-content">
        <slot name="toolbar" />
      </div>
      <v-btn
        class="dashboard-board__settings-button"
        :prepend-icon="mdiTuneVariant"
        variant="outlined"
        color="primary"
        @click="settingsOpen = true"
      >
        Настроить виджеты
      </v-btn>
    </div>

    <template v-if="hasVisibleWidgets">
      <GridLayout
        v-if="isDesktopLayout"
        v-model:layout="desktopLayout"
        class="dashboard-board__desktop-grid"
        :col-num="DASHBOARD_COLUMN_COUNT"
        :row-height="DASHBOARD_ROW_HEIGHT"
        :margin="[DASHBOARD_GRID_GAP, DASHBOARD_GRID_GAP]"
        :is-draggable="true"
        :is-resizable="true"
        :is-bounded="true"
        :vertical-compact="true"
        :responsive="false"
        @layout-updated="handleLayoutUpdated"
      >
        <GridItem
          v-for="item in desktopLayout"
          :key="item.i"
          :i="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="item.minW"
          :min-h="item.minH"
          :max-w="item.maxW"
          :max-h="item.maxH"
          drag-allow-from=".dashboard-widget-frame__drag-handle"
          drag-ignore-from="button, a, input, textarea, select, [role='button']"
        >
          <DashboardWidgetFrame
            v-if="isDashboardWidgetId(item.i)"
            :id="item.i"
            :title="getDefinition(item.i).title"
            :description="getDefinition(item.i).description"
            :appearance="getDefinition(item.i).appearance"
            draggable
            @hide="hideWidget"
          >
            <slot name="widget" :definition="getDefinition(item.i)" :bindings="getBindings(item.i)">
              <Suspense>
                <component :is="getDefinition(item.i).component" v-bind="getBindings(item.i)" />
                <template #fallback>
                  <v-skeleton-loader type="paragraph, actions" />
                </template>
              </Suspense>
            </slot>
          </DashboardWidgetFrame>
        </GridItem>
      </GridLayout>

      <div v-else class="dashboard-board__responsive-grid">
        <DashboardWidgetFrame
          v-for="definition in visibleDefinitions"
          :key="definition.id"
          :id="definition.id"
          :title="definition.title"
          :description="definition.description"
          :appearance="definition.appearance"
          @hide="hideWidget"
        >
          <slot name="widget" :definition="definition" :bindings="getBindings(definition.id)">
            <Suspense>
              <component :is="definition.component" v-bind="getBindings(definition.id)" />
              <template #fallback>
                <v-skeleton-loader type="paragraph, actions" />
              </template>
            </Suspense>
          </slot>
        </DashboardWidgetFrame>
      </div>
    </template>

    <v-card v-else class="dashboard-board__empty" elevation="0" role="status">
      <h2>Все виджеты скрыты</h2>
      <p>Верните их на панель одной кнопкой или выберите нужные в настройках.</p>
      <div class="dashboard-board__empty-actions">
        <v-btn color="primary" variant="flat" :prepend-icon="mdiRestore" @click="restoreAllWidgets">
          Вернуть все виджеты
        </v-btn>
        <v-btn color="primary" variant="text" @click="settingsOpen = true">Настроить</v-btn>
      </div>
    </v-card>

    <DashboardSettingsDialog
      v-model="settingsOpen"
      :widgets="dashboardWidgetRegistry"
      :layout="state.items"
      :order="state.order"
      :hidden-ids="hiddenIds"
      @visibility-change="setWidgetVisibility"
      @move="moveWidget"
      @resize="setWidgetSize"
      @reset="resetLayout"
    />
  </section>
</template>

<style scoped>
.dashboard-board {
  width: 100%;
  min-width: 0;
}

.dashboard-board__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: 8px;
}

.dashboard-board__toolbar-content {
  min-width: 0;
  flex: 1;
}

.dashboard-board__desktop-grid {
  width: 100%;
}

.dashboard-board__desktop-grid :deep(.vgl-item) {
  min-width: 0;
}

.dashboard-board__desktop-grid :deep(.vgl-item--placeholder) {
  border-radius: var(--radius-card);
  background: var(--color-primary-soft);
  opacity: 0.7;
}

.dashboard-board__desktop-grid :deep(.vgl-item__resizer) {
  right: 8px;
  bottom: 8px;
  width: 12px;
  height: 12px;
  border-right: 2px solid var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.dashboard-board__responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: var(--space-4);
}

.dashboard-board__responsive-grid :deep(.dashboard-widget-frame) {
  min-height: 320px;
}

.dashboard-board__empty {
  display: grid;
  min-height: 320px;
  place-content: center;
  justify-items: center;
  gap: var(--space-2);
  padding: 32px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card);
  text-align: center;
}

.dashboard-board__empty p {
  max-width: 440px;
  color: var(--color-text-muted);
}

.dashboard-board__empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

@media (max-width: 599px) {
  .dashboard-board__toolbar {
    align-items: stretch;
    flex-direction: column;
    margin-bottom: var(--space-4);
  }

  .dashboard-board__settings-button {
    width: 100%;
  }

  .dashboard-board__responsive-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-board__empty {
    min-height: 280px;
    padding: 24px var(--space-4);
  }
}
</style>
