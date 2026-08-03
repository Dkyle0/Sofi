<script setup lang="ts">
import { mdiClose, mdiDrag } from '@mdi/js'

import type { DashboardWidgetId } from '../../model'

const props = defineProps<{
  id: DashboardWidgetId
  title: string
  description: string
  draggable?: boolean
  appearance?: 'default' | 'spotlight'
}>()

const emit = defineEmits<{
  hide: [id: DashboardWidgetId]
}>()

const titleId = `dashboard-widget-title-${props.id}`
</script>

<template>
  <v-card
    class="dashboard-widget-frame"
    :class="{ 'dashboard-widget-frame--spotlight': appearance === 'spotlight' }"
    elevation="0"
    tag="section"
    :aria-labelledby="titleId"
  >
    <header
      class="dashboard-widget-frame__header dashboard-widget-frame__drag-handle"
      :class="{ 'dashboard-widget-frame__header--draggable': draggable }"
    >
      <v-icon
        v-if="draggable"
        class="dashboard-widget-frame__drag-icon"
        :icon="mdiDrag"
        size="20"
        aria-hidden="true"
      />
      <div class="dashboard-widget-frame__heading">
        <h2 :id="titleId" class="dashboard-widget-frame__title">{{ title }}</h2>
        <span class="dashboard-widget-frame__sr-only">{{ description }}</span>
      </div>
      <v-btn
        class="dashboard-widget-frame__hide"
        :icon="mdiClose"
        variant="text"
        size="small"
        :aria-label="`Скрыть виджет «${title}»`"
        @click="emit('hide', id)"
      />
    </header>

    <div class="dashboard-widget-frame__content">
      <slot />
    </div>
  </v-card>
</template>

<style scoped>
.dashboard-widget-frame {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-widget, var(--shadow-card));
}

.dashboard-widget-frame--spotlight {
  border-color: rgb(109 59 255 / 22%);
  background: var(--gradient-demo-spotlight);
  box-shadow: var(--shadow-demo-spotlight);
}

.dashboard-widget-frame--spotlight::before {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 18%;
  left: 18%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-demo-violet),
    var(--color-demo-pink),
    transparent
  );
  content: '';
  pointer-events: none;
}

.dashboard-widget-frame__header {
  display: flex;
  min-height: 54px;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 12px 8px var(--space-4);
  user-select: none;
}

.dashboard-widget-frame__header--draggable {
  cursor: grab;
  touch-action: none;
}

.dashboard-widget-frame__header--draggable:active {
  cursor: grabbing;
}

.dashboard-widget-frame__drag-icon {
  flex: 0 0 auto;
  color: var(--color-text-muted);
}

.dashboard-widget-frame__heading {
  min-width: 0;
  flex: 1;
}

.dashboard-widget-frame__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  white-space: normal;
}

.dashboard-widget-frame__hide {
  flex: 0 0 auto;
  color: var(--color-text-muted);
}

.dashboard-widget-frame__content {
  container-name: dashboard-widget;
  container-type: inline-size;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.dashboard-widget-frame__content > :deep(.v-skeleton-loader) {
  margin: 4px var(--space-4) var(--space-4);
}

.dashboard-widget-frame__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 599px) {
  .dashboard-widget-frame__header {
    min-height: 50px;
    align-items: flex-start;
  }

  .dashboard-widget-frame__title {
    font-size: 17px;
  }
}
</style>
