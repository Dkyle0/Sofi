import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

import {
  DASHBOARD_COLUMN_COUNT,
  DASHBOARD_SIZE_WIDTHS,
  createDefaultDashboardLayoutState,
} from './defaultLayout'
import { loadDashboardLayout, saveDashboardLayout } from './layoutStorage'
import type {
  DashboardLayoutItem,
  DashboardLayoutState,
  DashboardWidgetId,
  DashboardWidgetSize,
} from './types'

function cloneItem(item: DashboardLayoutItem): DashboardLayoutItem {
  return { ...item }
}

function withTimestamp(state: DashboardLayoutState): DashboardLayoutState {
  return { ...state, updatedAt: new Date().toISOString() }
}

function reflowItems(
  items: DashboardLayoutItem[],
  order: DashboardWidgetId[],
): DashboardLayoutItem[] {
  const byId = new Map(items.map((item) => [item.i, cloneItem(item)]))
  let x = 0
  let y = 0
  let rowHeight = 0

  return order.flatMap((id) => {
    const item = byId.get(id)
    if (!item) return []

    if (x > 0 && x + item.w > DASHBOARD_COLUMN_COUNT) {
      x = 0
      y += rowHeight
      rowHeight = 0
    }

    item.x = x
    item.y = y
    x += item.w
    rowHeight = Math.max(rowHeight, item.h)

    if (x >= DASHBOARD_COLUMN_COUNT) {
      x = 0
      y += rowHeight
      rowHeight = 0
    }

    return [item]
  })
}

export function useDashboardLayout(userId: MaybeRefOrGetter<string>) {
  const state = ref<DashboardLayoutState>(createDefaultDashboardLayoutState())
  let isHydrating = false

  const visibleItems = computed(() => {
    const hiddenIds = new Set(state.value.hiddenIds)
    const byId = new Map(state.value.items.map((item) => [item.i, item]))

    return state.value.order.flatMap((id) => {
      const item = byId.get(id)
      return item && !hiddenIds.has(id) ? [cloneItem(item)] : []
    })
  })

  const hiddenIds = computed(() => [...state.value.hiddenIds])
  const hasVisibleWidgets = computed(() => visibleItems.value.length > 0)

  function hydrate(): void {
    isHydrating = true
    state.value = loadDashboardLayout(toValue(userId))
    isHydrating = false
  }

  function updateVisibleLayout(layout: DashboardLayoutItem[]): void {
    const visibleById = new Map(layout.map((item) => [item.i, cloneItem(item)]))
    const items = state.value.items.map((item) => visibleById.get(item.i) ?? cloneItem(item))
    const visibleOrder = [...layout]
      .sort((left, right) => left.y - right.y || left.x - right.x)
      .map(({ i }) => i)
    const hiddenOrder = state.value.order.filter((id) => state.value.hiddenIds.includes(id))

    state.value = withTimestamp({
      ...state.value,
      items,
      order: [...visibleOrder, ...hiddenOrder],
    })
  }

  function hideWidget(id: DashboardWidgetId): void {
    if (state.value.hiddenIds.includes(id)) return
    state.value = withTimestamp({
      ...state.value,
      hiddenIds: [...state.value.hiddenIds, id],
    })
  }

  function showWidget(id: DashboardWidgetId): void {
    state.value = withTimestamp({
      ...state.value,
      hiddenIds: state.value.hiddenIds.filter((hiddenId) => hiddenId !== id),
    })
  }

  function setWidgetVisibility(id: DashboardWidgetId, isVisible: boolean): void {
    if (isVisible) showWidget(id)
    else hideWidget(id)
  }

  function moveWidget(id: DashboardWidgetId, direction: -1 | 1): void {
    const currentIndex = state.value.order.indexOf(id)
    const nextIndex = currentIndex + direction
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= state.value.order.length) return

    const order = [...state.value.order]
    ;[order[currentIndex], order[nextIndex]] = [order[nextIndex], order[currentIndex]]

    state.value = withTimestamp({
      ...state.value,
      order,
      items: reflowItems(state.value.items, order),
    })
  }

  function setWidgetSize(id: DashboardWidgetId, size: DashboardWidgetSize): void {
    const width = DASHBOARD_SIZE_WIDTHS[size]
    const items = state.value.items.map((item) =>
      item.i === id
        ? { ...item, w: width, x: Math.min(item.x, DASHBOARD_COLUMN_COUNT - width) }
        : item,
    )

    state.value = withTimestamp({
      ...state.value,
      items: reflowItems(items, state.value.order),
    })
  }

  function restoreAllWidgets(): void {
    state.value = withTimestamp({ ...state.value, hiddenIds: [] })
  }

  function resetLayout(): void {
    state.value = createDefaultDashboardLayoutState()
  }

  watch(
    () => toValue(userId),
    () => hydrate(),
    { immediate: true },
  )

  watch(
    state,
    (nextState) => {
      if (!isHydrating) saveDashboardLayout(toValue(userId), nextState)
    },
    { deep: true },
  )

  return {
    state,
    visibleItems,
    hiddenIds,
    hasVisibleWidgets,
    updateVisibleLayout,
    hideWidget,
    showWidget,
    setWidgetVisibility,
    moveWidget,
    setWidgetSize,
    restoreAllWidgets,
    resetLayout,
  }
}
