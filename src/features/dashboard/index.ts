export {
  dashboardGateway,
  DashboardGatewayError,
  MockDashboardGateway,
  UnavailableDashboardGateway,
} from './api/dashboardGateway'
export type { DashboardGateway, DashboardGatewayErrorCode } from './api/dashboardGateway'
export { useDashboardStore } from './model/dashboardStore'
export { useDashboard } from './model/useDashboard'
export { getDashboardCommandKey } from './model/types'
export type {
  ActivityFilter,
  AutomationStatus,
  DashboardActivityFilter,
  DashboardActivityItem,
  DashboardActivityType,
  DashboardAdaptationStatus,
  DashboardAttentionItem,
  DashboardAttentionType,
  DashboardAutomation,
  DashboardCommand,
  DashboardDynamicsPoint,
  DashboardFunnelMetrics,
  DashboardMatch,
  DashboardMatchStatus,
  DashboardPeriod,
  DashboardPosition,
  DashboardResumeAdaptation,
  DashboardResumeBattle,
  DashboardResumeBattleScore,
  DashboardResumeBattleStatus,
  DashboardResumeBattleWinner,
  DashboardResumeReadiness,
  DashboardResumeStatus,
  DashboardSnapshot,
} from './model/types'
