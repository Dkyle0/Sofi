import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { User } from '@/entities/user'
import { useAuthStore } from './authStore'

vi.mock('../api/authGateway', () => ({
  authGateway: {
    login: vi.fn(),
    restoreSession: vi.fn(),
    logout: vi.fn(),
  },
}))

import { authGateway } from '../api/authGateway'

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u-1',
    email: 'demo@sofi.local',
    name: 'София Орлова',
    gender: 'female',
    firstName: 'София',
    lastName: 'Орлова',
    phone: null,
    telegram: null,
    portfolioLink: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: null,
    lastLogin: null,
    plan: { id: 1, name: 'trial', price: 0, durationDays: 14, features: [] },
    trialEnd: '2025-01-15T00:00:00.000Z',
    subscriptionExpiry: '2025-02-01T00:00:00.000Z',
    paymentStatus: 'trial',
    subscriptionProductCode: null,
    isCancelled: false,
    promoDiscountPercent: null,
    ...overrides,
  }
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts unauthenticated with no user', () => {
      const auth = useAuthStore()

      expect(auth.user).toBeNull()
      expect(auth.isLoading).toBe(false)
      expect(auth.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('sets user and returns true on success', async () => {
      const mockUser = createMockUser()
      vi.mocked(authGateway.login).mockResolvedValue(mockUser)

      const auth = useAuthStore()
      const result = await auth.login({ username: 'demo@sofi.local', password: 'Demo123!' })

      expect(result).toBe(true)
      expect(auth.user).toEqual(mockUser)
      expect(auth.isAuthenticated).toBe(true)
      expect(auth.isLoading).toBe(false)
    })

    it('clears session and returns false on failure', async () => {
      vi.mocked(authGateway.login).mockRejectedValue(new Error('invalid credentials'))

      const auth = useAuthStore()
      const result = await auth.login({ username: 'wrong', password: 'wrong' })

      expect(result).toBe(false)
      expect(auth.user).toBeNull()
      expect(auth.isAuthenticated).toBe(false)
    })

    it('sets isLoading during request', async () => {
      let resolveFn!: (value: User) => void
      vi.mocked(authGateway.login).mockReturnValue(
        new Promise((resolve) => {
          resolveFn = resolve
        }),
      )

      const auth = useAuthStore()
      const promise = auth.login({ username: 'demo@sofi.local', password: 'Demo123!' })

      expect(auth.isLoading).toBe(true)

      resolveFn(createMockUser())
      await promise

      expect(auth.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears session after successful logout', async () => {
      vi.mocked(authGateway.logout).mockResolvedValue(undefined)

      const auth = useAuthStore()
      auth.user = createMockUser()

      await auth.logout()

      expect(auth.user).toBeNull()
      expect(auth.isAuthenticated).toBe(false)
    })

    it('clears session even when server fails', async () => {
      vi.mocked(authGateway.logout).mockRejectedValue(new Error('network error'))

      const auth = useAuthStore()
      auth.user = createMockUser()

      await auth.logout()

      expect(auth.user).toBeNull()
      expect(auth.isAuthenticated).toBe(false)
    })
  })

  describe('restoreSession', () => {
    it('sets user when session exists', async () => {
      const mockUser = createMockUser()
      vi.mocked(authGateway.restoreSession).mockResolvedValue(mockUser)

      const auth = useAuthStore()
      await auth.restoreSession()

      expect(auth.user).toEqual(mockUser)
      expect(auth.isAuthenticated).toBe(true)
    })

    it('keeps user null when no session', async () => {
      vi.mocked(authGateway.restoreSession).mockResolvedValue(null)

      const auth = useAuthStore()
      await auth.restoreSession()

      expect(auth.user).toBeNull()
      expect(auth.isAuthenticated).toBe(false)
    })
  })

  describe('clearSession', () => {
    it('resets user to null', () => {
      const auth = useAuthStore()
      auth.user = createMockUser()

      auth.clearSession()

      expect(auth.user).toBeNull()
      expect(auth.isAuthenticated).toBe(false)
    })
  })
})
