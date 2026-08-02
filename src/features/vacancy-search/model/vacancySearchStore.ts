import { defineStore } from 'pinia'
import type { IndustryItem } from '@/entities/industry'
import { vacancySearchGateway } from '../api/vacancySearchGateway'
import { createVacancySearchCriteria, type VacancySearchDraft } from './types'

function createInitialDraft(): VacancySearchDraft {
  return {
    positionId: 1,
    keywords: '',
    excludedKeywords: '',
    inTitle: true,
    inDescription: false,
    industries: [
      { id: 'analytics', name: 'Аналитик' },
      { id: 'game-design', name: 'Гейм-дизайнер' },
      { id: 'product', name: 'Менеджер продукта' },
    ],
    experienceLevel: null,
  }
}

function isAborted(signal?: AbortSignal) {
  return signal?.aborted ?? false
}

export const useVacancySearchStore = defineStore('vacancy-search', {
  state: () => ({
    draft: createInitialDraft(),
    vacanciesCount: null as number | null,
    isCounting: false,
    countError: null as string | null,
    countRequestId: 0,
  }),

  actions: {
    updateDraft(patch: Partial<Omit<VacancySearchDraft, 'industries'>>) {
      Object.assign(this.draft, patch)
    },

    setIndustries(industries: IndustryItem[]) {
      this.draft.industries = [...industries]
    },

    removeIndustry(industryId: string) {
      this.draft.industries = this.draft.industries.filter((industry) => industry.id !== industryId)
    },

    clearIndustries() {
      this.draft.industries = []
    },

    async fetchVacanciesCount(signal?: AbortSignal) {
      const requestId = ++this.countRequestId
      this.isCounting = true
      this.countError = null

      try {
        const count = await vacancySearchGateway.getCount(
          createVacancySearchCriteria(this.draft),
          signal,
        )
        if (this.countRequestId === requestId) {
          this.vacanciesCount = count
        }
      } catch {
        if (this.countRequestId === requestId && !isAborted(signal)) {
          this.countError = 'Не удалось посчитать вакансии. Попробуйте ещё раз.'
        }
      } finally {
        if (this.countRequestId === requestId) {
          this.isCounting = false
        }
      }
    },
  },
})
