import { delay, HttpResponse, http } from 'msw'
import { mockCredentials, mockIndustries, mockUser } from '@/app/mocks/fixtures'
import { clearMockSession, createMockSession, hasMockSession } from '@/app/mocks/storage'
import type { VacancySearchRequestDto } from '@/features/vacancy-search'

type MockScenario =
  'happy' | 'invalid-login' | 'session-expired' | 'industries-error' | 'vacancy-error' | 'slow'

function getScenario(): MockScenario {
  const scenario = new URLSearchParams(window.location.search).get('mockScenario')
  const allowedScenarios: MockScenario[] = [
    'happy',
    'invalid-login',
    'session-expired',
    'industries-error',
    'vacancy-error',
    'slow',
  ]

  return allowedScenarios.includes(scenario as MockScenario) ? (scenario as MockScenario) : 'happy'
}

function getDelay(defaultDelay: number) {
  return getScenario() === 'slow' ? 2000 : defaultDelay
}

function unauthorizedResponse() {
  return HttpResponse.json({ detail: 'Требуется авторизация' }, { status: 401 })
}

function calculateVacancyCount(settings: VacancySearchRequestDto) {
  const searchFieldsMultiplier =
    settings.search_in.length === 0 ? 0 : settings.search_in.length === 1 ? 0.8 : 1
  const experienceMultiplier: Record<string, number> = {
    'Нет опыта': 0.85,
    'От 1 года до 3 лет': 0.75,
    'От 3 до 6 лет': 0.55,
    'Более 6 лет': 0.4,
  }
  const base =
    350 +
    settings.keywords.length * 140 +
    settings.industries.length * 220 -
    settings.exclude_keywords.length * 75
  const multiplier = settings.experience ? (experienceMultiplier[settings.experience] ?? 1) : 1

  return Math.round(Math.min(9999, Math.max(0, base * searchFieldsMultiplier * multiplier)))
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(getDelay(500))
    const formData = new URLSearchParams(await request.text())
    const isCorrectCredentials =
      formData.get('username') === mockCredentials.username &&
      formData.get('password') === mockCredentials.password

    if (getScenario() === 'invalid-login' || !isCorrectCredentials) {
      return HttpResponse.json({ detail: 'Неверный логин или пароль' }, { status: 401 })
    }

    createMockSession()
    return HttpResponse.json(mockUser)
  }),

  http.post('/api/auth/refresh', async () => {
    await delay(getDelay(150))

    if (getScenario() === 'session-expired') {
      clearMockSession()
    }

    return hasMockSession() ? HttpResponse.json(mockUser) : unauthorizedResponse()
  }),

  http.post('/api/auth/logout', async () => {
    await delay(getDelay(150))
    clearMockSession()
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/industries', async () => {
    await delay(getDelay(350))

    if (getScenario() === 'industries-error') {
      return HttpResponse.json({ detail: 'Не удалось загрузить отрасли' }, { status: 500 })
    }

    return HttpResponse.json(mockIndustries)
  }),

  http.post('/vacancy-parser/get-total-vacancies/', async ({ request }) => {
    await delay(getDelay(600))

    if (getScenario() === 'vacancy-error') {
      return HttpResponse.json({ detail: 'Не удалось посчитать вакансии' }, { status: 500 })
    }

    const settings = (await request.json()) as VacancySearchRequestDto
    return HttpResponse.json(calculateVacancyCount(settings))
  }),
]
