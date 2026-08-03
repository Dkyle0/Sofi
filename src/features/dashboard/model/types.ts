export type DashboardPeriod = 7 | 30

export type AutomationStatus = 'active' | 'paused' | 'attention'

export interface DashboardAutomation {
  status: AutomationStatus
  sentToday: number
  dailyLimit: number
  lastRunAt: string | null
  nextRunAt: string | null
}

export interface DashboardFunnelMetrics {
  found: number
  matched: number
  sent: number
  responses: number
  interviews: number
}

export interface DashboardDynamicsPoint {
  date: string
  sent: number
  responses: number
}

export interface DashboardPosition {
  id: string
  title: string
  workFormat: string
  industries: string[]
  salary: string
  newMatches: number
}

export type DashboardMatchStatus = 'available' | 'queued' | 'dismissed'

export interface DashboardMatch {
  id: string
  title: string
  company: string
  salary: string
  workFormat: string
  score: number
  reasons: string[]
  status: DashboardMatchStatus
}

export type DashboardResumeStatus = 'ready' | 'improving'

export interface DashboardResumeReadiness {
  id: string
  name: string
  score: number
  atsScore: number
  keywordsScore: number
  achievementsScore: number
  status: DashboardResumeStatus
}

export type DashboardResumeBattleStatus = 'ready' | 'completed'

export type DashboardResumeBattleWinner = 'original' | 'sofi-turbo' | null

export interface DashboardResumeBattleScore {
  score: number
  atsScore: number
  keywordsScore: number
  achievementsScore: number
}

export interface DashboardResumeBattle {
  id: string
  resumeId: string
  vacancyTitle: string
  company: string
  status: DashboardResumeBattleStatus
  challengerName: string
  challenger: DashboardResumeBattleScore
  winner: DashboardResumeBattleWinner
}

export type DashboardAdaptationStatus = 'base' | 'processing' | 'review' | 'approved'

export interface DashboardResumeAdaptation {
  id: string
  resumeName: string
  vacancyTitle: string
  company: string
  status: DashboardAdaptationStatus
  updatedAt: string
}

export type DashboardAttentionType = 'send-error' | 'employer-question' | 'resume-review'

export interface DashboardAttentionItem {
  id: string
  type: DashboardAttentionType
  title: string
  description: string
  actionLabel: string
  createdAt: string
}

export type DashboardActivityType =
  'search' | 'application' | 'resume' | 'view' | 'response' | 'interview'

export type ActivityFilter = 'all' | 'applications' | 'resume' | 'interviews'
export type DashboardActivityFilter = ActivityFilter

export interface DashboardActivityItem {
  id: string
  type: DashboardActivityType
  title: string
  description: string
  occurredAt: string
}

export interface DashboardSnapshot {
  generatedAt: string
  automation: DashboardAutomation
  funnel: Record<DashboardPeriod, DashboardFunnelMetrics>
  dynamics: Record<DashboardPeriod, DashboardDynamicsPoint[]>
  positions: DashboardPosition[]
  matches: DashboardMatch[]
  resume: DashboardResumeReadiness | null
  resumeBattle: DashboardResumeBattle | null
  adaptations: DashboardResumeAdaptation[]
  attention: DashboardAttentionItem[]
  activities: DashboardActivityItem[]
}

export type DashboardCommand =
  | { type: 'set-automation'; status: 'active' | 'paused' }
  | { type: 'queue-match'; vacancyId: string }
  | { type: 'dismiss-match'; vacancyId: string }
  | { type: 'start-resume-improvement'; resumeId: string }
  | { type: 'run-resume-battle'; battleId: string }
  | { type: 'approve-resume'; adaptationId: string }
  | { type: 'resolve-attention'; itemId: string }

export function getDashboardCommandKey(command: DashboardCommand) {
  switch (command.type) {
    case 'set-automation':
      return command.type
    case 'queue-match':
    case 'dismiss-match':
      return `match:${command.vacancyId}`
    case 'start-resume-improvement':
      return `resume:${command.resumeId}`
    case 'run-resume-battle':
      return `resume-battle:${command.battleId}`
    case 'approve-resume':
      return `adaptation:${command.adaptationId}`
    case 'resolve-attention':
      return `attention:${command.itemId}`
  }
}
