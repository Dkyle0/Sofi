import { ref } from 'vue'
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

export const useVacancySearchStore = defineStore('vacancy-search', () => {
  const draft = ref<VacancySearchDraft>(createInitialDraft())
  const vacanciesCount = ref<number | null>(null)
  const isCounting = ref(false)
  const countError = ref<string | null>(null)

  let countRequestId = 0

  function updateDraft(patch: Partial<Omit<VacancySearchDraft, 'industries'>>) {
    Object.assign(draft.value, patch)
  }

  function setIndustries(industries: IndustryItem[]) {
    draft.value.industries = [...industries]
  }

  function removeIndustry(industryId: string) {
    draft.value.industries = draft.value.industries.filter((industry) => industry.id !== industryId)
  }

  function clearIndustries() {
    draft.value.industries = []
  }

  async function fetchVacanciesCount(signal?: AbortSignal) {
    const requestId = ++countRequestId
    isCounting.value = true
    countError.value = null

    try {
      const count = await vacancySearchGateway.getCount(
        createVacancySearchCriteria(draft.value),
        signal,
      )
      if (requestId === countRequestId) {
        vacanciesCount.value = count
      }
    } catch {
      if (requestId === countRequestId && !isAborted(signal)) {
        countError.value = 'Не удалось посчитать вакансии. Попробуйте ещё раз.'
      }
    } finally {
      if (requestId === countRequestId) {
        isCounting.value = false
      }
    }
  }

  return {
    draft,
    vacanciesCount,
    isCounting,
    countError,
    updateDraft,
    setIndustries,
    removeIndustry,
    clearIndustries,
    fetchVacanciesCount,
  }
})
