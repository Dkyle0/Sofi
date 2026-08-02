import type { IndustryItem } from '@/entities/industry'

export type ExperienceLevel =
  'no-experience' | 'one-to-three-years' | 'three-to-six-years' | 'six-plus-years' | null

export interface VacancySearchDraft {
  positionId: number
  keywords: string
  excludedKeywords: string
  inTitle: boolean
  inDescription: boolean
  industries: IndustryItem[]
  experienceLevel: ExperienceLevel
}

export interface VacancySearchCriteria {
  positionId: number
  keywords: string[]
  excludedKeywords: string[]
  searchIn: Array<'title' | 'description'>
  industries: IndustryItem[]
  experienceLevel: ExperienceLevel
}

export const experienceOptions: Array<{ title: string; value: Exclude<ExperienceLevel, null> }> = [
  { title: 'Нет опыта', value: 'no-experience' },
  { title: 'От 1 года до 3 лет', value: 'one-to-three-years' },
  { title: 'От 3 до 6 лет', value: 'three-to-six-years' },
  { title: 'Более 6 лет', value: 'six-plus-years' },
]

function splitKeywords(value: string) {
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}

export function createVacancySearchCriteria(draft: VacancySearchDraft): VacancySearchCriteria {
  const searchIn: VacancySearchCriteria['searchIn'] = []

  if (draft.inTitle) searchIn.push('title')
  if (draft.inDescription) searchIn.push('description')

  return {
    positionId: draft.positionId,
    keywords: splitKeywords(draft.keywords),
    excludedKeywords: splitKeywords(draft.excludedKeywords),
    searchIn,
    industries: draft.industries,
    experienceLevel: draft.experienceLevel,
  }
}
