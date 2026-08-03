<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardFunnelMetrics, DashboardPeriod } from '@/features/dashboard'
import DashboardChart from '../charts/DashboardChart.vue'
import {
  dashboardChartFontFamily,
  dashboardChartPalette,
  dashboardChartTooltipStyle,
} from '../charts/palette'
import type { DashboardChartOption } from '../charts/types'
import { formatNumber } from './widgetFormatting'
import './widgetShared.css'

const props = defineProps<{
  metrics: DashboardFunnelMetrics
  period: DashboardPeriod
}>()

const stages = computed(() => [
  {
    name: 'Найдено',
    value: props.metrics.found,
    color: dashboardChartPalette.primarySoft,
    textColor: dashboardChartPalette.text,
  },
  {
    name: 'Подошло',
    value: props.metrics.matched,
    color: dashboardChartPalette.primary65,
    textColor: dashboardChartPalette.surface,
  },
  {
    name: 'Отправлено',
    value: props.metrics.sent,
    color: dashboardChartPalette.primary78,
    textColor: dashboardChartPalette.surface,
  },
  {
    name: 'Ответы',
    value: props.metrics.responses,
    color: dashboardChartPalette.primary88,
    textColor: dashboardChartPalette.surface,
  },
  {
    name: 'Интервью',
    value: props.metrics.interviews,
    color: dashboardChartPalette.primary,
    textColor: dashboardChartPalette.surface,
  },
])

const option = computed<DashboardChartOption>(() => ({
  animationDuration: 350,
  aria: {
    enabled: true,
  },
  tooltip: {
    ...dashboardChartTooltipStyle,
    trigger: 'item',
    valueFormatter: (value) => formatNumber(Number(value)),
  },
  series: [
    {
      type: 'funnel',
      top: 4,
      bottom: 4,
      left: '5%',
      width: '90%',
      minSize: '24%',
      maxSize: '100%',
      sort: 'descending',
      gap: 4,
      label: {
        show: true,
        position: 'inside',
        color: dashboardChartPalette.text,
        fontFamily: dashboardChartFontFamily,
        fontSize: 12,
        formatter: '{b}: {c}',
      },
      labelLine: { show: false },
      itemStyle: {
        borderColor: dashboardChartPalette.surface,
        borderWidth: 2,
        borderRadius: 6,
      },
      emphasis: {
        disabled: true,
        focus: 'none',
      },
      data: stages.value.map((stage) => ({
        name: stage.name,
        value: stage.value,
        itemStyle: { color: stage.color },
        label: { color: stage.textColor },
      })),
    },
  ],
}))

const summary = computed(
  () =>
    `Воронка за ${props.period} дней: найдено ${formatNumber(props.metrics.found)}, ` +
    `подошло ${formatNumber(props.metrics.matched)}, отправлено ${formatNumber(props.metrics.sent)}, ` +
    `получено ответов ${formatNumber(props.metrics.responses)}, интервью ${formatNumber(props.metrics.interviews)}.`,
)
</script>

<template>
  <div class="dashboard-widget-content funnel-widget">
    <DashboardChart class="funnel-widget__chart" :option="option" :summary="summary" />
  </div>
</template>

<style scoped>
.funnel-widget {
  gap: 4px;
  overflow: hidden;
}

.funnel-widget__chart {
  flex: 1;
  min-height: 180px;
}
</style>
