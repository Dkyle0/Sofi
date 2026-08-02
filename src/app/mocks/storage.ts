const MOCK_SESSION_KEY = 'sofi:mock-session:v1'

export function hasMockSession() {
  return sessionStorage.getItem(MOCK_SESSION_KEY) === 'demo-user-1'
}

export function createMockSession() {
  sessionStorage.setItem(MOCK_SESSION_KEY, 'demo-user-1')
}

export function clearMockSession() {
  sessionStorage.removeItem(MOCK_SESSION_KEY)
}
