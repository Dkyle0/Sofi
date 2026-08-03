import {
  DASHBOARD_COLUMN_COUNT,
  DASHBOARD_DEFAULT_WIDGET_ORDER,
  DASHBOARD_LAYOUT_VERSION,
  createDefaultDashboardLayoutItem,
  createDefaultDashboardLayoutState,
} from './defaultLayout'
import type { DashboardLayoutItem, DashboardLayoutState, DashboardWidgetId } from './types'
import { DASHBOARD_WIDGET_IDS } from './types'

const STORAGE_PREFIX = 'sofi:dashboard-layout:v2'
const LEGACY_STORAGE_PREFIX = 'sofi:dashboard-layout:v1'
const widgetIds = new Set<string>(DASHBOARD_WIDGET_IDS)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isWidgetId(value: unknown): value is DashboardWidgetId {
  return typeof value === 'string' && widgetIds.has(value)
}

function toFiniteInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function normalizeItem(value: unknown): DashboardLayoutItem | null {
  if (!isRecord(value) || !isWidgetId(value.i)) return null

  const defaults = createDefaultDashboardLayoutItem(value.i)
  const w = clamp(toFiniteInteger(value.w, defaults.w), defaults.minW, defaults.maxW)
  const h = clamp(toFiniteInteger(value.h, defaults.h), defaults.minH, defaults.maxH)
  const x = clamp(toFiniteInteger(value.x, defaults.x), 0, DASHBOARD_COLUMN_COUNT - w)
  const y = Math.max(0, toFiniteInteger(value.y, defaults.y))

  return { ...defaults, x, y, w, h }
}

function uniqueWidgetIds(value: unknown): DashboardWidgetId[] {
  if (!Array.isArray(value)) return []

  const seen = new Set<DashboardWidgetId>()
  return value.reduce<DashboardWidgetId[]>((result, item) => {
    if (isWidgetId(item) && !seen.has(item)) {
      seen.add(item)
      result.push(item)
    }
    return result
  }, [])
}

function appendMissingItems(items: DashboardLayoutItem[]): DashboardLayoutItem[] {
  const knownIds = new Set(items.map(({ i }) => i))
  let nextY = items.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0)

  for (const id of DASHBOARD_DEFAULT_WIDGET_ORDER) {
    if (knownIds.has(id)) continue

    const item = createDefaultDashboardLayoutItem(id)
    items.push({ ...item, x: 0, y: nextY })
    nextY += item.h
  }

  return items
}

export function getDashboardLayoutStorageKey(userId: string): string {
  const normalizedUserId = userId.trim() || 'anonymous'
  return `${STORAGE_PREFIX}:${normalizedUserId}`
}

function getLegacyDashboardLayoutStorageKey(userId: string): string {
  const normalizedUserId = userId.trim() || 'anonymous'
  return `${LEGACY_STORAGE_PREFIX}:${normalizedUserId}`
}

export function normalizeDashboardLayoutState(value: unknown): DashboardLayoutState {
  if (!isRecord(value) || value.version !== DASHBOARD_LAYOUT_VERSION) {
    return createDefaultDashboardLayoutState()
  }

  const normalizedItems: DashboardLayoutItem[] = []
  const seenItems = new Set<DashboardWidgetId>()

  if (Array.isArray(value.items)) {
    for (const rawItem of value.items) {
      const item = normalizeItem(rawItem)
      if (item && !seenItems.has(item.i)) {
        seenItems.add(item.i)
        normalizedItems.push(item)
      }
    }
  }

  appendMissingItems(normalizedItems)

  const storedOrder = uniqueWidgetIds(value.order)
  const order = [
    ...storedOrder,
    ...DASHBOARD_DEFAULT_WIDGET_ORDER.filter((id) => !storedOrder.includes(id)),
  ]

  return {
    version: DASHBOARD_LAYOUT_VERSION,
    items: normalizedItems,
    hiddenIds: uniqueWidgetIds(value.hiddenIds),
    order,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
  }
}

export function loadDashboardLayout(userId: string): DashboardLayoutState {
  if (typeof window === 'undefined') return createDefaultDashboardLayoutState()

  try {
    // The v2 showcase preset intentionally replaces the former personalized v1 layout.
    window.localStorage.removeItem(getLegacyDashboardLayoutStorageKey(userId))
    const storedValue = window.localStorage.getItem(getDashboardLayoutStorageKey(userId))
    return storedValue
      ? normalizeDashboardLayoutState(JSON.parse(storedValue) as unknown)
      : createDefaultDashboardLayoutState()
  } catch {
    return createDefaultDashboardLayoutState()
  }
}

export function saveDashboardLayout(userId: string, state: DashboardLayoutState): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      getDashboardLayoutStorageKey(userId),
      JSON.stringify(normalizeDashboardLayoutState(state)),
    )
  } catch {
    // A private browsing policy or a full storage quota must not break the dashboard.
  }
}
