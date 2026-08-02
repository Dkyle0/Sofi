import { onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import type { IndustryItem } from '@/entities/industry'
import type { VacancySearchDraft } from './types'
import { useVacancySearchStore } from './vacancySearchStore'

export function useVacancySearch() {
  const store = useVacancySearchStore()
  const { draft, vacanciesCount, isCounting, countError } = storeToRefs(store)
  let countController: AbortController | undefined

  async function calculateCount() {
    countController?.abort()
    countController = new AbortController()
    await store.fetchVacanciesCount(countController.signal)
  }

  onBeforeUnmount(() => countController?.abort())

  return {
    draft,
    vacanciesCount,
    isCounting,
    countError,
    updateDraft: (patch: Partial<Omit<VacancySearchDraft, 'industries'>>) =>
      store.updateDraft(patch),
    setIndustries: (industries: IndustryItem[]) => store.setIndustries(industries),
    removeIndustry: (industryId: string) => store.removeIndustry(industryId),
    clearIndustries: () => store.clearIndustries(),
    calculateCount,
  }
}
