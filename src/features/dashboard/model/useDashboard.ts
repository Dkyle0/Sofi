import { computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from './dashboardStore'
import { getDashboardCommandKey, type DashboardCommand } from './types'

export function useDashboard() {
  const store = useDashboardStore()
  const {
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
  } = storeToRefs(store)
  let loadController: AbortController | undefined
  const commandControllers = new Set<AbortController>()

  async function load() {
    loadController?.abort()
    loadController = new AbortController()
    await store.load(loadController.signal)
  }

  async function execute(command: DashboardCommand) {
    const controller = new AbortController()
    commandControllers.add(controller)

    try {
      return await store.execute(command, controller.signal)
    } finally {
      commandControllers.delete(controller)
    }
  }

  onBeforeUnmount(() => {
    loadController?.abort()
    commandControllers.forEach((controller) => controller.abort())
    commandControllers.clear()
  })

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
    hasData: computed(() => snapshot.value !== null),
    setPeriod: store.setPeriod,
    clearFeedback: store.clearFeedback,
    isCommandPending: (command: DashboardCommand) =>
      pendingCommandKeys.value.includes(getDashboardCommandKey(command)),
    load,
    retry: load,
    execute,
  }
}
