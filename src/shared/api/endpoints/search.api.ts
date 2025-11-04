import { http } from '../http'

export interface SearchSettings {
  position_id: number
  keywords: string[]
  exclude_keywords: string[]
  search_in: ('title' | 'description')[]
  industries: string[]
  experience: string | null
}

export const searchApi = {
  async fetchVacanciesCount(settings: SearchSettings): Promise<number> {
    const { data } = await http.post<number>('/vacancy-parser/get-total-vacancies/', settings)
    return data
  },
}
