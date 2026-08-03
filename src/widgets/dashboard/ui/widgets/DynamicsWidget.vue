<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardDynamicsPoint, DashboardPeriod } from '@/features/dashboard'
import DashboardChart from '../charts/DashboardChart.vue'
import {
  dashboardChartFontFamily,
  dashboardChartPalette,
  dashboardChartTooltipStyle,
} from '../charts/palette'
import type { DashboardChartOption } from '../charts/types'
import { formatNumber, formatShortDate } from './widgetFormatting'
import './widgetShared.css'

const props = defineProps<{
  points: DashboardDynamicsPoint[]
  period: DashboardPeriod
}>()

const sentTotal = computed(() => props.points.reduce((sum, point) => sum + point.sent, 0))
const responsesTotal = computed(() => props.points.reduce((sum, point) => sum + point.responses, 0))

const option = computed<DashboardChartOption>(() => ({
  animationDuration: 350,
  aria: {
    enabled: true,
  },
  color: [dashboardChartPalette.primary, dashboardChartPalette.success],
  grid: {
    top: 38,
    right: 12,
    bottom: 24,
    left: 38,
  },
  legend: {
    top: 4,
    right: 0,
    itemWidth: 12,
    itemHeight: 8,
    textStyle: {
      color: dashboardChartPalette.textMuted,
      fontFamily: dashboardChartFontFamily,
      fontSize: 11,
    },
  },
  tooltip: {
    ...dashboardChartTooltipStyle,
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: { color: dashboardChartPalette.border, width: 1 },
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: props.points.map((point) => formatShortDate(point.date)),
    axisLine: { lineStyle: { color: dashboardChartPalette.border } },
    axisTick: { show: false },
    axisLabel: {
      color: dashboardChartPalette.textMuted,
      fontFamily: dashboardChartFontFamily,
      fontSize: 10,
      hideOverlap: true,
    },
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    axisLabel: {
      color: dashboardChartPalette.textMuted,
      fontFamily: dashboardChartFontFamily,
      fontSize: 10,
    },
    splitLine: { lineStyle: { color: dashboardChartPalette.border } },
  },
  series: [
    {
      name: 'Отклики',
      type: 'bar',
      data: props.points.map((point) => point.sent),
      barMaxWidth: 18,
      itemStyle: {
        color: dashboardChartPalette.primary,
        borderRadius: [5, 5, 0, 0],
      },
      emphasis: { disabled: true, focus: 'none' },
    },
    {
      name: 'Ответы',
      type: 'line',
      data: props.points.map((point) => point.responses),
      smooth: true,
      symbolSize: 7,
      itemStyle: { color: dashboardChartPalette.success },
      lineStyle: { color: dashboardChartPalette.success, width: 3 },
      emphasis: { disabled: true, focus: 'none' },
    },
  ],
}))

const summary = computed(
  () =>
    `Динамика за ${props.period} дней: отправлено ${formatNumber(sentTotal.value)} откликов, ` +
    `получено ${formatNumber(responsesTotal.value)} ответов.`,
)
</script>

<template>
  <div class="dashboard-widget-content dynamics-widget">
    <div class="dynamics-widget__topline">
      <p class="dashboard-widget-muted" aria-live="polite">
        <strong>{{ sentTotal }}</strong> откликов · <strong>{{ responsesTotal }}</strong> ответов
      </p>
    </div>

    <DashboardChart class="dynamics-widget__chart" :option="option" :summary="summary" />
  </div>
</template>

<style scoped>
.dynamics-widget {
  gap: 4px;
  overflow: hidden;
}

.dynamics-widget__topline {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.dynamics-widget__topline strong {
  color: var(--color-text);
}

.dynamics-widget__chart {
  flex: 1;
  min-height: 180px;
}

@container dashboard-widget (max-width: 420px) {
  .dynamics-widget__topline {
    align-items: flex-start;
  }

  .dynamics-widget__topline > p {
    max-width: 120px;
  }
}
</style>
