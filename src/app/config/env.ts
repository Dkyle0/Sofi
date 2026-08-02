export type ApiMode = 'mock' | 'real'

const apiMode = import.meta.env.VITE_API_MODE ?? 'mock'

if (apiMode !== 'mock' && apiMode !== 'real') {
  throw new Error('VITE_API_MODE должен быть равен mock или real')
}

export const appConfig = {
  apiMode: apiMode as ApiMode,
}

export const isMockMode = appConfig.apiMode === 'mock'
