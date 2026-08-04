import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVacancySearchStore } from './vacancySearchStore'

vi.mock('../api/vacancySearchGateway', () => ({
  vacancySearchGateway: {
    getCount: vi.fn(),
  },
}))

import { vacancySearchGateway } from '../api/vacancySearchGateway'

describe('useVacancySearchStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with default draft', () => {
      const store = useVacancySearchStore()

      expect(store.draft.positionId).toBe(1)
      expect(store.draft.keywords).toBe('')
      expect(store.draft.inTitle).toBe(true)
      expect(store.draft.inDescription).toBe(false)
      expect(store.draft.industries).toHaveLength(3)
      expect(store.draft.experienceLevel).toBeNull()
    })

    it('starts with no count and no error', () => {
      const store = useVacancySearchStore()

      expect(store.vacanciesCount).toBeNull()
      expect(store.isCounting).toBe(false)
      expect(store.countError).toBeNull()
    })
  })

  describe('updateDraft', () => {
    it('patches draft fields', () => {
      const store = useVacancySearchStore()

      store.updateDraft({ keywords: 'vue,react', inDescription: true })

      expect(store.draft.keywords).toBe('vue,react')
      expect(store.draft.inDescription).toBe(true)
    })
  })

  describe('setIndustries', () => {
    it('replaces industries array', () => {
      const store = useVacancySearchStore()

      store.setIndustries([
        { id: 'backend', name: 'Backend' },
        { id: 'devops', name: 'DevOps' },
      ])

      expect(store.draft.industries).toHaveLength(2)
      expect(store.draft.industries[0]).toEqual({ id: 'backend', name: 'Backend' })
    })
  })

  describe('removeIndustry', () => {
    it('removes industry by id', () => {
      const store = useVacancySearchStore()

      store.removeIndustry('analytics')

      expect(store.draft.industries.find((i) => i.id === 'analytics')).toBeUndefined()
      expect(store.draft.industries).toHaveLength(2)
    })
  })

  describe('clearIndustries', () => {
    it('empties industries array', () => {
      const store = useVacancySearchStore()

      store.clearIndustries()

      expect(store.draft.industries).toEqual([])
    })
  })

  describe('fetchVacanciesCount', () => {
    it('stores count from gateway', async () => {
      vi.mocked(vacancySearchGateway.getCount).mockResolvedValue(42)

      const store = useVacancySearchStore()
      await store.fetchVacanciesCount()

      expect(store.vacanciesCount).toBe(42)
      expect(store.isCounting).toBe(false)
      expect(store.countError).toBeNull()
    })

    it('sets countError on failure', async () => {
      vi.mocked(vacancySearchGateway.getCount).mockRejectedValue(new Error('network'))

      const store = useVacancySearchStore()
      await store.fetchVacanciesCount()

      expect(store.vacanciesCount).toBeNull()
      expect(store.countError).toBe('Не удалось посчитать вакансии. Попробуйте ещё раз.')
    })

    it('ignores abort errors', async () => {
      const controller = new AbortController()
      controller.abort()
      vi.mocked(vacancySearchGateway.getCount).mockRejectedValue(
        new DOMException('aborted', 'AbortError'),
      )

      const store = useVacancySearchStore()
      await store.fetchVacanciesCount(controller.signal)

      expect(store.countError).toBeNull()
    })
  })
})
