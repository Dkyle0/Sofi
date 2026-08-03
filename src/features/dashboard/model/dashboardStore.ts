import { defineStore } from 'pinia'
import { dashboardGateway, DashboardGatewayError } from '../api/dashboardGateway'
import {
  getDashboardCommandKey,
  type DashboardCommand,
  type DashboardPeriod,
  type DashboardSnapshot,
} from './types'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof DashboardGatewayError ? error.message : fallback
}

function getSuccessMessage(command: DashboardCommand) {
  switch (command.type) {
    case 'set-automation':
      return command.status === 'active' ? 'Автоотклики возобновлены' : 'Автоотклики приостановлены'
    case 'queue-match':
      return 'Вакансия добавлена в очередь'
    case 'dismiss-match':
      return 'Вакансия скрыта из рекомендаций'
    case 'start-resume-improvement':
      return 'Резюме улучшено'
    case 'run-resume-battle':
      return 'Битва резюме завершена'
    case 'approve-resume':
      return 'Адаптация резюме подтверждена'
    case 'resolve-attention':
      return 'Задача выполнена'
  }
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    snapshot: null as DashboardSnapshot | null,
    period: 30 as DashboardPeriod,
    isLoading: false,
    loadError: null as string | null,
    actionError: null as string | null,
    successMessage: null as string | null,
    pendingCommandKeys: [] as string[],
    loadRequestId: 0,
  }),

  getters: {
    selectedFunnel: (state) => state.snapshot?.funnel[state.period] ?? null,
    selectedDynamics: (state) => state.snapshot?.dynamics[state.period] ?? [],
    automationQuota: (state) => {
      if (!state.snapshot) {
        return null
      }

      return {
        sent: state.snapshot.automation.sentToday,
        limit: state.snapshot.automation.dailyLimit,
      }
    },
    isCommandPending: (state) => (command: DashboardCommand) =>
      state.pendingCommandKeys.includes(getDashboardCommandKey(command)),
  },

  actions: {
    setPeriod(period: DashboardPeriod) {
      this.period = period
    },

    clearFeedback() {
      this.actionError = null
      this.successMessage = null
    },

    async load(signal?: AbortSignal) {
      const requestId = ++this.loadRequestId
      this.isLoading = true
      this.loadError = null

      try {
        const snapshot = await dashboardGateway.getSnapshot(signal)
        if (this.loadRequestId === requestId) {
          this.snapshot = snapshot
        }
      } catch (error) {
        if (this.loadRequestId === requestId && !isAbortError(error)) {
          this.snapshot = null
          this.loadError = getErrorMessage(
            error,
            'Не удалось загрузить данные dashboard. Попробуйте ещё раз.',
          )
        }
      } finally {
        if (this.loadRequestId === requestId) {
          this.isLoading = false
        }
      }
    },

    async execute(command: DashboardCommand, signal?: AbortSignal) {
      const commandKey = getDashboardCommandKey(command)
      if (this.pendingCommandKeys.includes(commandKey)) {
        return false
      }

      this.pendingCommandKeys.push(commandKey)
      this.clearFeedback()

      try {
        this.snapshot = await dashboardGateway.execute(command, signal)
        this.successMessage = getSuccessMessage(command)
        return true
      } catch (error) {
        if (!isAbortError(error)) {
          this.actionError = getErrorMessage(
            error,
            'Не удалось выполнить действие. Попробуйте ещё раз.',
          )
        }
        return false
      } finally {
        this.pendingCommandKeys = this.pendingCommandKeys.filter((key) => key !== commandKey)
      }
    },
  },
})
