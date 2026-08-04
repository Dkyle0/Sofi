import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { DashboardGatewayError } from '../api/dashboardGateway'
import type { DashboardSnapshot } from './types'
import { useDashboardStore } from './dashboardStore'

vi.mock('../api/dashboardGateway', async () => {
  const actual =
    await vi.importActual<typeof import('../api/dashboardGateway')>('../api/dashboardGateway')
  return {
    ...actual,
    dashboardGateway: {
      getSnapshot: vi.fn(),
      execute: vi.fn(),
    },
  }
})

import { dashboardGateway } from '../api/dashboardGateway'

function createMockSnapshot(overrides: Partial<DashboardSnapshot> = {}): DashboardSnapshot {
  return {
    generatedAt: '2025-01-01T00:00:00.000Z',
    automation: {
      status: 'active',
      sentToday: 5,
      dailyLimit: 50,
      lastRunAt: null,
      nextRunAt: null,
    },
    funnel: {
      7: { found: 100, matched: 40, sent: 20, responses: 5, interviews: 2 },
      30: { found: 400, matched: 160, sent: 80, responses: 20, interviews: 8 },
    },
    dynamics: {
      7: [{ date: '2025-01-01', sent: 10, responses: 2 }],
      30: [{ date: '2025-01-01', sent: 40, responses: 8 }],
    },
    positions: [],
    matches: [],
    resume: null,
    resumeBattle: null,
    adaptations: [],
    attention: [],
    activities: [],
    ...overrides,
  }
}

describe('useDashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts empty with no snapshot', () => {
      const store = useDashboardStore()

      expect(store.snapshot).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.loadError).toBeNull()
      expect(store.actionError).toBeNull()
      expect(store.successMessage).toBeNull()
      expect(store.pendingCommandKeys).toEqual([])
      expect(store.period).toBe(30)
    })
  })

  describe('computed', () => {
    it('selectedFunnel returns funnel for current period', () => {
      const store = useDashboardStore()
      store.snapshot = createMockSnapshot()

      expect(store.selectedFunnel).toEqual(store.snapshot!.funnel[30])

      store.setPeriod(7)
      expect(store.selectedFunnel).toEqual(store.snapshot!.funnel[7])
    })

    it('selectedFunnel returns null when no snapshot', () => {
      const store = useDashboardStore()

      expect(store.selectedFunnel).toBeNull()
    })

    it('automationQuota returns sent and limit', () => {
      const store = useDashboardStore()
      store.snapshot = createMockSnapshot()

      expect(store.automationQuota).toEqual({ sent: 5, limit: 50 })
    })

    it('automationQuota returns null when no snapshot', () => {
      const store = useDashboardStore()

      expect(store.automationQuota).toBeNull()
    })
  })

  describe('load', () => {
    it('loads snapshot from gateway', async () => {
      const snapshot = createMockSnapshot()
      vi.mocked(dashboardGateway.getSnapshot).mockResolvedValue(snapshot)

      const store = useDashboardStore()
      await store.load()

      expect(store.snapshot).toEqual(snapshot)
      expect(store.isLoading).toBe(false)
      expect(store.loadError).toBeNull()
    })

    it('sets loadError on failure', async () => {
      vi.mocked(dashboardGateway.getSnapshot).mockRejectedValue(
        new DashboardGatewayError('load-failed', 'Не удалось загрузить данные dashboard.'),
      )

      const store = useDashboardStore()
      await store.load()

      expect(store.snapshot).toBeNull()
      expect(store.loadError).toBe('Не удалось загрузить данные dashboard.')
    })

    it('ignores abort errors', async () => {
      const abortError = new DOMException('cancelled', 'AbortError')
      vi.mocked(dashboardGateway.getSnapshot).mockRejectedValue(abortError)

      const store = useDashboardStore()
      await store.load()

      expect(store.loadError).toBeNull()
    })
  })

  describe('execute', () => {
    it('updates snapshot and sets success message', async () => {
      const snapshot = createMockSnapshot()
      vi.mocked(dashboardGateway.execute).mockResolvedValue(snapshot)

      const store = useDashboardStore()
      const result = await store.execute({ type: 'set-automation', status: 'paused' })

      expect(result).toBe(true)
      expect(store.snapshot).toEqual(snapshot)
      expect(store.successMessage).toBe('Автоотклики приостановлены')
    })

    it('sets actionError on gateway failure', async () => {
      vi.mocked(dashboardGateway.execute).mockRejectedValue(
        new DashboardGatewayError('action-failed', 'Ошибка действия'),
      )

      const store = useDashboardStore()
      const result = await store.execute({ type: 'set-automation', status: 'paused' })

      expect(result).toBe(false)
      expect(store.actionError).toBe('Ошибка действия')
    })

    it('prevents duplicate concurrent commands with same key', async () => {
      let resolveExecute!: (v: DashboardSnapshot) => void
      vi.mocked(dashboardGateway.execute).mockReturnValue(
        new Promise((resolve) => {
          resolveExecute = resolve
        }),
      )

      const store = useDashboardStore()
      const command = { type: 'queue-match', vacancyId: 'v-1' } as const

      const promise1 = store.execute(command)
      const result2 = await store.execute(command)

      expect(result2).toBe(false)
      expect(vi.mocked(dashboardGateway.execute)).toHaveBeenCalledTimes(1)

      resolveExecute(createMockSnapshot())
      await promise1
    })
  })

  describe('clearFeedback', () => {
    it('clears actionError and successMessage', () => {
      const store = useDashboardStore()
      store.actionError = 'err'
      store.successMessage = 'ok'

      store.clearFeedback()

      expect(store.actionError).toBeNull()
      expect(store.successMessage).toBeNull()
    })
  })
})
