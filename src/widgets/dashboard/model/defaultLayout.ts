import type {
  DashboardLayoutItem,
  DashboardLayoutState,
  DashboardWidgetId,
  DashboardWidgetSize,
} from './types'

export const DASHBOARD_COLUMN_COUNT = 12
export const DASHBOARD_ROW_HEIGHT = 72
export const DASHBOARD_GRID_GAP = 16
export const DASHBOARD_LAYOUT_VERSION = 2 as const

const DEFAULT_WIDGET_HEIGHT = 4
const MIN_WIDGET_HEIGHT = 3
const MAX_WIDGET_HEIGHT = 8

const defaultCoordinates: Record<
  DashboardWidgetId,
  Pick<DashboardLayoutItem, 'x' | 'y' | 'w' | 'h'>
> = {
  activity: { x: 0, y: 0, w: 12, h: DEFAULT_WIDGET_HEIGHT },
  'resume-battle': { x: 0, y: 4, w: 8, h: DEFAULT_WIDGET_HEIGHT },
  'automation-today': { x: 8, y: 4, w: 4, h: DEFAULT_WIDGET_HEIGHT },
  funnel: { x: 0, y: 8, w: 4, h: DEFAULT_WIDGET_HEIGHT },
  dynamics: { x: 4, y: 8, w: 4, h: DEFAULT_WIDGET_HEIGHT },
  'active-positions': { x: 8, y: 8, w: 4, h: DEFAULT_WIDGET_HEIGHT },
  'best-matches': { x: 0, y: 12, w: 8, h: DEFAULT_WIDGET_HEIGHT },
  'resume-readiness': { x: 8, y: 12, w: 4, h: DEFAULT_WIDGET_HEIGHT },
  'resume-adaptations': { x: 0, y: 16, w: 8, h: DEFAULT_WIDGET_HEIGHT },
  attention: { x: 8, y: 16, w: 4, h: DEFAULT_WIDGET_HEIGHT },
}

export const DASHBOARD_DEFAULT_WIDGET_ORDER: readonly DashboardWidgetId[] = [
  'activity',
  'resume-battle',
  'automation-today',
  'funnel',
  'dynamics',
  'active-positions',
  'best-matches',
  'resume-readiness',
  'resume-adaptations',
  'attention',
]

export const DASHBOARD_SIZE_WIDTHS: Readonly<Record<DashboardWidgetSize, number>> = {
  compact: 4,
  normal: 8,
  wide: 12,
}

export function createDefaultDashboardLayoutItem(id: DashboardWidgetId): DashboardLayoutItem {
  return {
    i: id,
    ...defaultCoordinates[id],
    minW: 4,
    minH: MIN_WIDGET_HEIGHT,
    maxW: DASHBOARD_COLUMN_COUNT,
    maxH: MAX_WIDGET_HEIGHT,
  }
}

export function createDefaultDashboardLayoutState(): DashboardLayoutState {
  return {
    version: DASHBOARD_LAYOUT_VERSION,
    items: DASHBOARD_DEFAULT_WIDGET_ORDER.map(createDefaultDashboardLayoutItem),
    hiddenIds: [],
    order: [...DASHBOARD_DEFAULT_WIDGET_ORDER],
    updatedAt: new Date().toISOString(),
  }
}

export function getDashboardWidgetSize(width: number): DashboardWidgetSize {
  if (width <= DASHBOARD_SIZE_WIDTHS.compact) return 'compact'
  if (width <= DASHBOARD_SIZE_WIDTHS.normal) return 'normal'
  return 'wide'
}
