import { http } from '@/shared/api/http'
import type { VacancySearchCriteria, ExperienceLevel } from '../model/types'

export interface VacancySearchRequestDto {
  position_id: number
  keywords: string[]
  exclude_keywords: string[]
  search_in: Array<'title' | 'description'>
  industries: string[]
  experience: string | null
}

export interface VacancySearchGateway {
  getCount(criteria: VacancySearchCriteria, signal?: AbortSignal): Promise<number>
}

const experienceDtoValues: Record<Exclude<ExperienceLevel, null>, string> = {
  'no-experience': 'Нет опыта',
  'one-to-three-years': 'От 1 года до 3 лет',
  'three-to-six-years': 'От 3 до 6 лет',
  'six-plus-years': 'Более 6 лет',
}

export function mapVacancySearchCriteria(criteria: VacancySearchCriteria): VacancySearchRequestDto {
  return {
    position_id: criteria.positionId,
    keywords: criteria.keywords,
    exclude_keywords: criteria.excludedKeywords,
    search_in: criteria.searchIn,
    industries: criteria.industries.map((industry) => industry.name),
    experience: criteria.experienceLevel ? experienceDtoValues[criteria.experienceLevel] : null,
  }
}

// REAL API TRANSPORT: in demo mode MSW intercepts this endpoint call before it leaves the browser.
export const vacancySearchGateway: VacancySearchGateway = {
  async getCount(criteria, signal) {
    const { data } = await http.post<number>(
      '/vacancy-parser/get-total-vacancies/',
      mapVacancySearchCriteria(criteria),
      { signal },
    )
    return data
  },
}
