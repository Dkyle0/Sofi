<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardCommand, DashboardResumeReadiness } from '@/features/dashboard'
import DashboardChart from '../charts/DashboardChart.vue'
import { dashboardChartFontFamily, dashboardChartPalette } from '../charts/palette'
import type { DashboardChartOption } from '../charts/types'
import './widgetShared.css'

const props = defineProps<{
  resume: DashboardResumeReadiness | null
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const option = computed<DashboardChartOption>(() => ({
  animationDuration: 450,
  aria: { enabled: true },
  series: [
    {
      type: 'gauge',
      startAngle: 205,
      endAngle: -25,
      min: 0,
      max: 100,
      radius: '100%',
      center: ['50%', '58%'],
      pointer: { show: false },
      progress: {
        show: true,
        width: 13,
        roundCap: true,
        itemStyle: { color: dashboardChartPalette.primary },
      },
      axisLine: {
        lineStyle: {
          width: 13,
          color: [[1, dashboardChartPalette.primarySoft]],
        },
        roundCap: true,
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: {
        show: true,
        offsetCenter: [0, '30%'],
        color: dashboardChartPalette.textMuted,
        fontFamily: dashboardChartFontFamily,
        fontSize: 12,
      },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '-4%'],
        color: dashboardChartPalette.text,
        fontFamily: dashboardChartFontFamily,
        fontSize: 30,
        fontWeight: 700,
        formatter: '{value}',
      },
      emphasis: { disabled: true, focus: 'none' },
      data: [{ name: 'из 100', value: props.resume?.score ?? 0 }],
    },
  ],
}))

const summary = computed(() => {
  if (!props.resume) return 'Данные о готовности резюме отсутствуют.'

  return (
    `Готовность резюме ${props.resume.name}: ${props.resume.score} из 100. ` +
    `ATS ${props.resume.atsScore}, ключевые слова ${props.resume.keywordsScore}, ` +
    `достижения ${props.resume.achievementsScore}.`
  )
})

const isBusy = computed(() => props.busyCommand === 'start-resume-improvement')
const isImproved = computed(() => (props.resume?.score ?? 0) >= 86)

function startImprovement() {
  if (!props.resume) return
  emit('command', { type: 'start-resume-improvement', resumeId: props.resume.id })
}
</script>

<template>
  <div class="dashboard-widget-content readiness-widget">
    <template v-if="resume">
      <div class="readiness-widget__overview">
        <DashboardChart class="readiness-widget__chart" :option="option" :summary="summary" />
        <dl class="readiness-widget__metrics">
          <div>
            <dt>ATS</dt>
            <dd>{{ resume.atsScore }}</dd>
          </div>
          <div>
            <dt>Ключевые слова</dt>
            <dd>{{ resume.keywordsScore }}</dd>
          </div>
          <div>
            <dt>Достижения</dt>
            <dd>{{ resume.achievementsScore }}</dd>
          </div>
        </dl>
      </div>

      <div v-if="resume.status === 'improving'" class="readiness-widget__improving" role="status">
        <v-progress-linear color="primary" indeterminate rounded height="4" />
        <span>Улучшаем резюме…</span>
      </div>

      <p
        v-if="actionError"
        class="dashboard-widget-action-error"
        role="alert"
        aria-live="assertive"
      >
        {{ actionError }}
      </p>

      <v-btn
        color="primary"
        variant="flat"
        class="dashboard-widget-button mt-auto"
        :loading="isBusy"
        :disabled="isBusy || resume.status === 'improving' || isImproved"
        @click="startImprovement"
      >
        {{
          resume.status === 'improving'
            ? 'Улучшение запущено'
            : isImproved
              ? 'Резюме улучшено'
              : 'Улучшить резюме'
        }}
      </v-btn>
    </template>

    <div v-else class="dashboard-widget-empty" role="status">
      <span class="readiness-widget__empty-icon" aria-hidden="true">CV</span>
      <p>Добавьте резюме, чтобы проверить его готовность к автоматическим откликам.</p>
    </div>
  </div>
</template>

<style scoped>
.readiness-widget {
  gap: 8px;
}

.readiness-widget__overview {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(120px, 1fr);
  gap: 8px;
  align-items: center;
}

.readiness-widget__chart {
  height: 142px;
  min-height: 142px;
}

.readiness-widget__metrics {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
}

.readiness-widget__metrics div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  padding: 6px 9px;
  background: var(--color-surface-muted);
  border-radius: 9px;
}

.readiness-widget__metrics dt {
  color: var(--color-text-muted);
  font-size: 12px;
}

.readiness-widget__metrics dd {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.readiness-widget__improving {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--color-primary);
  font-size: 12px;
}

.readiness-widget__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 800;
  background: var(--color-primary-soft);
  border-radius: 14px;
}

@media (max-width: 380px) {
  .readiness-widget__overview {
    grid-template-columns: 1fr;
  }

  .readiness-widget__metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .readiness-widget__metrics div {
    flex-direction: column;
  }
}
</style>
