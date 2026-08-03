export const DASHBOARD_WIDGET_IDS = [
  'automation-today',
  'funnel',
  'dynamics',
  'active-positions',
  'best-matches',
  'resume-readiness',
  'resume-adaptations',
  'attention',
  'activity',
  'resume-battle',
] as const

export type DashboardWidgetId = (typeof DASHBOARD_WIDGET_IDS)[number]

export type DashboardWidgetSize = 'compact' | 'normal' | 'wide'

export interface DashboardLayoutItem {
  i: DashboardWidgetId
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
  maxW: number
  maxH: number
}

export interface DashboardLayoutState {
  version: 2
  items: DashboardLayoutItem[]
  hiddenIds: DashboardWidgetId[]
  order: DashboardWidgetId[]
  updatedAt: string
}

export type DashboardWidgetBindings = Partial<Record<DashboardWidgetId, Record<string, unknown>>>
