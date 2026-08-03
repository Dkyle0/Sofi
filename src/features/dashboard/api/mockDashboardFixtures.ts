import type {
  DashboardActivityItem,
  DashboardDynamicsPoint,
  DashboardSnapshot,
} from '../model/types'

function atDayOffset(now: Date, days: number, hours: number, minutes = 0) {
  const date = new Date(now)
  date.setHours(hours, minutes, 0, 0)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function createDynamics(now: Date): DashboardDynamicsPoint[] {
  const sentPattern = [2, 3, 5, 4, 6, 3, 7, 5, 4, 8]
  const responsePattern = [0, 1, 0, 1, 2, 0, 1, 1, 0, 2]

  return Array.from({ length: 30 }, (_, index) => ({
    date: atDayOffset(now, index - 29, 12),
    sent: sentPattern[index % sentPattern.length] ?? 0,
    responses: responsePattern[index % responsePattern.length] ?? 0,
  }))
}

function createActivities(now: Date): DashboardActivityItem[] {
  return [
    {
      id: 'activity-interview-1',
      type: 'interview',
      title: 'Назначено интервью',
      description: 'Product Analyst · Fintech Lab',
      occurredAt: atDayOffset(now, 0, 11, 20),
    },
    {
      id: 'activity-response-1',
      type: 'response',
      title: 'Получен ответ работодателя',
      description: 'Senior Product Analyst · Northstar',
      occurredAt: atDayOffset(now, 0, 9, 45),
    },
    {
      id: 'activity-view-1',
      type: 'view',
      title: 'Резюме просмотрено',
      description: 'Product Analyst · Bright Apps',
      occurredAt: atDayOffset(now, -1, 18, 10),
    },
    {
      id: 'activity-application-1',
      type: 'application',
      title: 'Отклик отправлен',
      description: 'Data Analyst · Aurora Market',
      occurredAt: atDayOffset(now, -1, 14, 30),
    },
    {
      id: 'activity-resume-1',
      type: 'resume',
      title: 'Резюме адаптировано',
      description: 'Версия для вакансии Product Analyst',
      occurredAt: atDayOffset(now, -2, 16, 15),
    },
    {
      id: 'activity-search-1',
      type: 'search',
      title: 'Найдено 18 новых вакансий',
      description: 'Позиция «Продуктовый аналитик»',
      occurredAt: atDayOffset(now, -2, 8, 0),
    },
  ]
}

export function createMockDashboardSnapshot(now = new Date()): DashboardSnapshot {
  const dynamics = createDynamics(now)

  return {
    generatedAt: now.toISOString(),
    automation: {
      status: 'active',
      sentToday: 12,
      dailyLimit: 20,
      lastRunAt: atDayOffset(now, 0, 11, 30),
      nextRunAt: atDayOffset(now, 0, 14, 0),
    },
    funnel: {
      7: { found: 62, matched: 21, sent: 12, responses: 3, interviews: 1 },
      30: { found: 186, matched: 54, sent: 32, responses: 7, interviews: 2 },
    },
    dynamics: {
      7: dynamics.slice(-7),
      30: dynamics,
    },
    positions: [
      {
        id: 'position-product-analyst',
        title: 'Продуктовый аналитик',
        workFormat: 'Удалённо или гибрид',
        industries: ['IT', 'Финтех'],
        salary: 'от 180 000 ₽',
        newMatches: 18,
      },
      {
        id: 'position-data-analyst',
        title: 'Data Analyst',
        workFormat: 'Удалённо',
        industries: ['E-commerce', 'IT'],
        salary: 'от 160 000 ₽',
        newMatches: 9,
      },
    ],
    matches: [
      {
        id: 'vacancy-northstar',
        title: 'Senior Product Analyst',
        company: 'Northstar',
        salary: '220 000–280 000 ₽',
        workFormat: 'Удалённо',
        score: 94,
        reasons: ['Совпадает стек', 'Подходит опыт', 'Удалённый формат'],
        status: 'available',
      },
      {
        id: 'vacancy-bright-apps',
        title: 'Product Analyst',
        company: 'Bright Apps',
        salary: 'до 240 000 ₽',
        workFormat: 'Гибрид',
        score: 89,
        reasons: ['Продуктовая аналитика', 'Подходящая отрасль'],
        status: 'available',
      },
      {
        id: 'vacancy-aurora-market',
        title: 'Data Analyst',
        company: 'Aurora Market',
        salary: '180 000–220 000 ₽',
        workFormat: 'Удалённо',
        score: 86,
        reasons: ['SQL и BI', 'Совпадает зарплата'],
        status: 'available',
      },
    ],
    resume: {
      id: 'resume-product-analyst',
      name: 'Продуктовый аналитик',
      score: 78,
      atsScore: 82,
      keywordsScore: 74,
      achievementsScore: 76,
      status: 'ready',
    },
    resumeBattle: {
      id: 'resume-battle-northstar',
      resumeId: 'resume-product-analyst',
      vacancyTitle: 'Senior Product Analyst',
      company: 'Northstar',
      status: 'ready',
      challengerName: 'Sofi Turbo',
      challenger: {
        score: 94,
        atsScore: 94,
        keywordsScore: 96,
        achievementsScore: 92,
      },
      winner: null,
    },
    adaptations: [
      {
        id: 'adaptation-base',
        resumeName: 'Базовое резюме',
        vacancyTitle: 'Продуктовый аналитик',
        company: 'Основная версия',
        status: 'base',
        updatedAt: atDayOffset(now, -4, 12),
      },
      {
        id: 'adaptation-processing',
        resumeName: 'Версия для Northstar',
        vacancyTitle: 'Senior Product Analyst',
        company: 'Northstar',
        status: 'processing',
        updatedAt: atDayOffset(now, 0, 11, 45),
      },
      {
        id: 'adaptation-review',
        resumeName: 'Версия для Bright Apps',
        vacancyTitle: 'Product Analyst',
        company: 'Bright Apps',
        status: 'review',
        updatedAt: atDayOffset(now, -1, 16, 15),
      },
    ],
    attention: [
      {
        id: 'attention-send-error',
        type: 'send-error',
        title: 'Не отправлен отклик',
        description: 'Сайт работодателя временно недоступен',
        actionLabel: 'Повторить',
        createdAt: atDayOffset(now, 0, 10, 10),
      },
      {
        id: 'attention-employer-question',
        type: 'employer-question',
        title: 'Вопрос от работодателя',
        description: 'Нужно подтвердить готовность к гибридному формату',
        actionLabel: 'Ответить',
        createdAt: atDayOffset(now, -1, 15, 25),
      },
      {
        id: 'attention-resume-review',
        type: 'resume-review',
        title: 'Проверьте адаптацию резюме',
        description: 'Версия для Bright Apps готова к подтверждению',
        actionLabel: 'Проверить',
        createdAt: atDayOffset(now, -1, 16, 15),
      },
    ],
    activities: createActivities(now),
  }
}

export function createEmptyDashboardSnapshot(now = new Date()): DashboardSnapshot {
  const snapshot = createMockDashboardSnapshot(now)
  const emptyFunnel = { found: 0, matched: 0, sent: 0, responses: 0, interviews: 0 }

  return {
    ...snapshot,
    automation: {
      status: 'paused',
      sentToday: 0,
      dailyLimit: 20,
      lastRunAt: null,
      nextRunAt: null,
    },
    funnel: { 7: { ...emptyFunnel }, 30: { ...emptyFunnel } },
    dynamics: { 7: [], 30: [] },
    positions: [],
    matches: [],
    resume: null,
    resumeBattle: null,
    adaptations: [],
    attention: [],
    activities: [],
  }
}
