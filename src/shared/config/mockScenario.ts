export const mockScenarios = [
  'happy',
  'invalid-login',
  'session-expired',
  'industries-error',
  'vacancy-error',
  'slow',
  'dashboard-empty',
  'dashboard-error',
  'dashboard-action-error',
  'dashboard-attention',
] as const

export type MockScenario = (typeof mockScenarios)[number]

export function getMockScenario(search?: string): MockScenario {
  const searchParams = search ?? (typeof window === 'undefined' ? '' : window.location.search)
  const scenario = new URLSearchParams(searchParams).get('mockScenario')

  return mockScenarios.includes(scenario as MockScenario) ? (scenario as MockScenario) : 'happy'
}

export function getMockDelay(defaultDelay: number, slowDelay = 2000) {
  return getMockScenario() === 'slow' ? slowDelay : defaultDelay
}
