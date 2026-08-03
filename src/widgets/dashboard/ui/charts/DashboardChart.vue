<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { DashboardChartOption } from './types'

const props = defineProps<{
  option: DashboardChartOption
  summary: string
}>()

const VChart = defineAsyncComponent(async () => {
  await import('./echarts')
  return (await import('vue-echarts')).default
})

const root = ref<HTMLElement | null>(null)
const shouldRender = ref(false)
const prefersReducedMotion = ref(false)
const summaryId = `dashboard-chart-summary-${useId()}`
let observer: IntersectionObserver | null = null
let reducedMotionQuery: MediaQueryList | null = null

const renderedOption = computed<DashboardChartOption>(() =>
  prefersReducedMotion.value
    ? {
        ...props.option,
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: 0,
        animationDelay: 0,
        animationDelayUpdate: 0,
        stateAnimation: { duration: 0 },
      }
    : props.option,
)

function updateReducedMotionPreference(event: MediaQueryListEvent | MediaQueryList): void {
  prefersReducedMotion.value = event.matches
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateReducedMotionPreference(reducedMotionQuery)
  reducedMotionQuery.addEventListener('change', updateReducedMotionPreference)

  if (!('IntersectionObserver' in window)) {
    shouldRender.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return

      shouldRender.value = true
      observer?.disconnect()
      observer = null
    },
    { rootMargin: '240px' },
  )
  observer.observe(root.value as HTMLElement)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  reducedMotionQuery?.removeEventListener('change', updateReducedMotionPreference)
})
</script>

<template>
  <figure
    ref="root"
    class="dashboard-chart"
    role="img"
    :aria-labelledby="summaryId"
    :aria-busy="!shouldRender"
  >
    <VChart
      v-if="shouldRender"
      class="dashboard-chart__canvas"
      :option="renderedOption"
      autoresize
    />
    <v-skeleton-loader v-else type="image" class="dashboard-chart__placeholder" />
    <figcaption :id="summaryId" class="dashboard-chart__summary">{{ summary }}</figcaption>
  </figure>
</template>

<style scoped>
.dashboard-chart {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 190px;
  margin: 0;
}

.dashboard-chart__canvas,
.dashboard-chart__placeholder {
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.dashboard-chart__placeholder :deep(.v-skeleton-loader__image) {
  height: 100%;
  border-radius: var(--radius-control);
}

.dashboard-chart__summary {
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
</style>
