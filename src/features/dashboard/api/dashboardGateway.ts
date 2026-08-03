import { getMockDelay, getMockScenario, type MockScenario } from '@/shared/config'
import { createEmptyDashboardSnapshot, createMockDashboardSnapshot } from './mockDashboardFixtures'
import type { DashboardActivityItem, DashboardCommand, DashboardSnapshot } from '../model/types'

export interface DashboardGateway {
  getSnapshot(signal?: AbortSignal): Promise<DashboardSnapshot>
  execute(command: DashboardCommand, signal?: AbortSignal): Promise<DashboardSnapshot>
}

export type DashboardGatewayErrorCode =
  'unavailable' | 'load-failed' | 'action-failed' | 'not-found'

export class DashboardGatewayError extends Error {
  readonly code: DashboardGatewayErrorCode

  constructor(code: DashboardGatewayErrorCode, message: string) {
    super(message)
    this.name = 'DashboardGatewayError'
    this.code = code
  }
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Операция отменена', 'AbortError')
  }
}

function wait(delayMs: number, signal?: AbortSignal) {
  throwIfAborted(signal)

  return new Promise<void>((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, delayMs)

    function handleAbort() {
      globalThis.clearTimeout(timeoutId)
      reject(new DOMException('Операция отменена', 'AbortError'))
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

function cloneSnapshot(snapshot: DashboardSnapshot) {
  return structuredClone(snapshot)
}

function commandDelay(command: DashboardCommand) {
  const delays: Record<DashboardCommand['type'], number> = {
    'set-automation': 300,
    'queue-match': 550,
    'dismiss-match': 350,
    'start-resume-improvement': 800,
    'run-resume-battle': 1400,
    'approve-resume': 500,
    'resolve-attention': 450,
  }

  return getMockDelay(delays[command.type])
}

let runtimeActionSequence = 0

function activityNow(
  type: DashboardActivityItem['type'],
  title: string,
  description: string,
): DashboardActivityItem {
  return {
    id: `activity-${type}-command-${++runtimeActionSequence}`,
    type,
    title,
    description,
    occurredAt: new Date().toISOString(),
  }
}

function addActivity(snapshot: DashboardSnapshot, activity: DashboardActivityItem) {
  snapshot.activities.unshift(activity)
  snapshot.activities = snapshot.activities.slice(0, 20)
}

let runtimeScenario: MockScenario | null = null
let runtimeSnapshot: DashboardSnapshot | null = null

function getRuntimeSnapshot(scenario: MockScenario) {
  if (runtimeSnapshot === null || runtimeScenario !== scenario) {
    runtimeScenario = scenario
    runtimeActionSequence = 0
    runtimeSnapshot =
      scenario === 'dashboard-empty'
        ? createEmptyDashboardSnapshot()
        : createMockDashboardSnapshot()

    if (scenario === 'dashboard-attention') {
      runtimeSnapshot.automation.status = 'attention'
      runtimeSnapshot.automation.nextRunAt = null
      runtimeSnapshot.attention.unshift({
        id: 'attention-automation-paused',
        type: 'send-error',
        title: 'Автоотклики требуют проверки',
        description: 'Три сайта работодателей запросили ручное подтверждение',
        actionLabel: 'Проверить',
        createdAt: new Date().toISOString(),
      })
    }
  }

  return runtimeSnapshot
}

function applyCommand(snapshot: DashboardSnapshot, command: DashboardCommand) {
  const now = new Date()

  switch (command.type) {
    case 'set-automation': {
      snapshot.automation.status = command.status
      snapshot.automation.nextRunAt =
        command.status === 'active' ? new Date(now.getTime() + 15 * 60 * 1000).toISOString() : null
      addActivity(
        snapshot,
        activityNow(
          'application',
          command.status === 'active' ? 'Автоотклики возобновлены' : 'Автоотклики на паузе',
          command.status === 'active'
            ? 'Следующий запуск запланирован автоматически'
            : 'Новые отклики не будут отправляться',
        ),
      )
      break
    }
    case 'queue-match': {
      const match = snapshot.matches.find((item) => item.id === command.vacancyId)
      if (!match) {
        throw new DashboardGatewayError('not-found', 'Вакансия больше недоступна')
      }
      match.status = 'queued'
      addActivity(
        snapshot,
        activityNow(
          'application',
          'Вакансия добавлена в очередь',
          `${match.title} · ${match.company}`,
        ),
      )
      break
    }
    case 'dismiss-match': {
      const match = snapshot.matches.find((item) => item.id === command.vacancyId)
      if (!match) {
        throw new DashboardGatewayError('not-found', 'Вакансия больше недоступна')
      }
      match.status = 'dismissed'
      break
    }
    case 'start-resume-improvement': {
      const resume = snapshot.resume
      if (!resume || resume.id !== command.resumeId) {
        throw new DashboardGatewayError('not-found', 'Резюме больше недоступно')
      }
      resume.status = 'ready'
      resume.score = 86
      resume.atsScore = 89
      resume.keywordsScore = 84
      resume.achievementsScore = 85
      addActivity(
        snapshot,
        activityNow('resume', 'Резюме улучшено', `Готовность «${resume.name}» повышена до 86%`),
      )
      break
    }
    case 'run-resume-battle': {
      const battle = snapshot.resumeBattle
      const resume = snapshot.resume
      if (!battle || !resume || battle.id !== command.battleId || battle.resumeId !== resume.id) {
        throw new DashboardGatewayError('not-found', 'Битва резюме больше недоступна')
      }

      if (battle.status === 'ready') {
        battle.status = 'completed'
        battle.winner = 'sofi-turbo'
        addActivity(
          snapshot,
          activityNow(
            'resume',
            'Sofi Turbo победило в битве резюме',
            `${battle.vacancyTitle} · ${battle.company} · преимущество ${battle.challenger.score - resume.score} баллов`,
          ),
        )
      }
      break
    }
    case 'approve-resume': {
      const adaptation = snapshot.adaptations.find((item) => item.id === command.adaptationId)
      if (!adaptation) {
        throw new DashboardGatewayError('not-found', 'Адаптация больше недоступна')
      }
      adaptation.status = 'approved'
      adaptation.updatedAt = now.toISOString()
      snapshot.attention = snapshot.attention.filter((item) => item.type !== 'resume-review')
      addActivity(
        snapshot,
        activityNow(
          'resume',
          'Адаптация подтверждена',
          `${adaptation.vacancyTitle} · ${adaptation.company}`,
        ),
      )
      break
    }
    case 'resolve-attention': {
      const item = snapshot.attention.find((attention) => attention.id === command.itemId)
      if (!item) {
        throw new DashboardGatewayError('not-found', 'Задача уже выполнена')
      }
      snapshot.attention = snapshot.attention.filter((attention) => attention.id !== command.itemId)
      if (snapshot.automation.status === 'attention' && snapshot.attention.length === 0) {
        snapshot.automation.status = 'active'
        snapshot.automation.nextRunAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString()
      }
      addActivity(snapshot, activityNow('application', 'Задача выполнена', item.title))
      break
    }
  }

  snapshot.generatedAt = now.toISOString()
}

export class MockDashboardGateway implements DashboardGateway {
  async getSnapshot(signal?: AbortSignal) {
    await wait(getMockDelay(600), signal)
    throwIfAborted(signal)

    const scenario = getMockScenario()
    if (scenario === 'dashboard-error') {
      throw new DashboardGatewayError(
        'load-failed',
        'Не удалось загрузить данные dashboard. Попробуйте ещё раз.',
      )
    }

    return cloneSnapshot(getRuntimeSnapshot(scenario))
  }

  async execute(command: DashboardCommand, signal?: AbortSignal) {
    await wait(commandDelay(command), signal)
    throwIfAborted(signal)

    const scenario = getMockScenario()
    if (scenario === 'dashboard-action-error') {
      throw new DashboardGatewayError(
        'action-failed',
        'Не удалось выполнить действие. Попробуйте ещё раз.',
      )
    }

    const snapshot = getRuntimeSnapshot(scenario)
    applyCommand(snapshot, command)
    return cloneSnapshot(snapshot)
  }
}

export class UnavailableDashboardGateway implements DashboardGateway {
  async getSnapshot(signal?: AbortSignal): Promise<DashboardSnapshot> {
    throwIfAborted(signal)
    throw new DashboardGatewayError('unavailable', 'Dashboard API пока не подключён')
  }

  async execute(_command: DashboardCommand, signal?: AbortSignal): Promise<DashboardSnapshot> {
    throwIfAborted(signal)
    throw new DashboardGatewayError('unavailable', 'Dashboard API пока не подключён')
  }
}

export const dashboardGateway: DashboardGateway =
  import.meta.env.VITE_API_MODE === 'real'
    ? new UnavailableDashboardGateway()
    : new MockDashboardGateway()
