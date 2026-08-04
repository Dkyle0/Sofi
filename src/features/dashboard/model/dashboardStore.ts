import { ref, computed } from 'vue'
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

export const useDashboardStore = defineStore('dashboard', () => {
  const snapshot = ref<DashboardSnapshot | null>(null)
  const period = ref<DashboardPeriod>(30)
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const actionError = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const pendingCommandKeys = ref<string[]>([])

  let loadRequestId = 0

  const selectedFunnel = computed(() => snapshot.value?.funnel[period.value] ?? null)
  const selectedDynamics = computed(() => snapshot.value?.dynamics[period.value] ?? [])

  const automationQuota = computed(() => {
    if (!snapshot.value) {
      return null
    }

    return {
      sent: snapshot.value.automation.sentToday,
      limit: snapshot.value.automation.dailyLimit,
    }
  })

  function isCommandPending(command: DashboardCommand) {
    return pendingCommandKeys.value.includes(getDashboardCommandKey(command))
  }

  function setPeriod(value: DashboardPeriod) {
    period.value = value
  }

  function clearFeedback() {
    actionError.value = null
    successMessage.value = null
  }

  async function load(signal?: AbortSignal) {
    const requestId = ++loadRequestId
    isLoading.value = true
    loadError.value = null

    try {
      const data = await dashboardGateway.getSnapshot(signal)
      if (requestId === loadRequestId) {
        snapshot.value = data
      }
    } catch (error) {
      if (requestId === loadRequestId && !isAbortError(error)) {
        snapshot.value = null
        loadError.value = getErrorMessage(
          error,
          'Не удалось загрузить данные dashboard. Попробуйте ещё раз.',
        )
      }
    } finally {
      if (requestId === loadRequestId) {
        isLoading.value = false
      }
    }
  }

  async function execute(command: DashboardCommand, signal?: AbortSignal) {
    const commandKey = getDashboardCommandKey(command)
    if (pendingCommandKeys.value.includes(commandKey)) {
      return false
    }

    pendingCommandKeys.value = [...pendingCommandKeys.value, commandKey]
    clearFeedback()

    try {
      snapshot.value = await dashboardGateway.execute(command, signal)
      successMessage.value = getSuccessMessage(command)
      return true
    } catch (error) {
      if (!isAbortError(error)) {
        actionError.value = getErrorMessage(
          error,
          'Не удалось выполнить действие. Попробуйте ещё раз.',
        )
      }
      return false
    } finally {
      pendingCommandKeys.value = pendingCommandKeys.value.filter((key) => key !== commandKey)
    }
  }

  return {
    snapshot,
    period,
    isLoading,
    loadError,
    actionError,
    successMessage,
    pendingCommandKeys,
    selectedFunnel,
    selectedDynamics,
    automationQuota,
    isCommandPending,
    setPeriod,
    clearFeedback,
    load,
    execute,
  }
})
