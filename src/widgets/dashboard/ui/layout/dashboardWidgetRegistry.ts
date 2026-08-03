import { defineAsyncComponent, type Component } from 'vue'

import type { DashboardWidgetId } from '../../model'

export interface DashboardWidgetDefinition {
  id: DashboardWidgetId
  title: string
  description: string
  component: Component
  appearance?: 'default' | 'spotlight'
}

export const dashboardWidgetRegistry: readonly DashboardWidgetDefinition[] = [
  {
    id: 'resume-battle',
    title: 'Битва резюме',
    description: 'Игровая демо-симуляция сравнения оригинального резюме с Sofi Turbo',
    component: defineAsyncComponent(() => import('../widgets/ResumeBattleWidget.vue')),
    appearance: 'spotlight',
  },
  {
    id: 'automation-today',
    title: 'Автоотклики сегодня',
    description: 'Состояние дневного лимита и расписание автоматических откликов',
    component: defineAsyncComponent(() => import('../widgets/AutomationTodayWidget.vue')),
  },
  {
    id: 'funnel',
    title: 'Воронка поиска',
    description: 'Конверсия от найденных вакансий до приглашений на интервью',
    component: defineAsyncComponent(() => import('../widgets/FunnelWidget.vue')),
  },
  {
    id: 'dynamics',
    title: 'Динамика откликов',
    description: 'Количество отправленных откликов и ответов по дням',
    component: defineAsyncComponent(() => import('../widgets/DynamicsWidget.vue')),
  },
  {
    id: 'active-positions',
    title: 'Активные позиции',
    description: 'Текущие направления поиска и новые совпадения',
    component: defineAsyncComponent(() => import('../widgets/ActivePositionsWidget.vue')),
  },
  {
    id: 'best-matches',
    title: 'Лучшие совпадения',
    description: 'Вакансии с наиболее высоким соответствием критериям поиска',
    component: defineAsyncComponent(() => import('../widgets/BestMatchesWidget.vue')),
  },
  {
    id: 'resume-readiness',
    title: 'Готовность резюме',
    description: 'ATS-оценка и рекомендации по улучшению основного резюме',
    component: defineAsyncComponent(() => import('../widgets/ResumeReadinessWidget.vue')),
  },
  {
    id: 'resume-adaptations',
    title: 'Адаптации резюме',
    description: 'Версии резюме, подготовленные под конкретные вакансии',
    component: defineAsyncComponent(() => import('../widgets/ResumeAdaptationsWidget.vue')),
  },
  {
    id: 'attention',
    title: 'Требует внимания',
    description: 'Действия, которые нельзя завершить автоматически',
    component: defineAsyncComponent(() => import('../widgets/AttentionWidget.vue')),
  },
  {
    id: 'activity',
    title: 'Последние события',
    description: 'Хронология поиска, откликов, ответов и изменений резюме',
    component: defineAsyncComponent(() => import('../widgets/ActivityWidget.vue')),
  },
]

export const dashboardWidgetRegistryById = new Map(
  dashboardWidgetRegistry.map((definition) => [definition.id, definition]),
)
