import { defineStore } from 'pinia'
import { searchApi } from '@/shared/api/endpoints/search.api'

//Определение типа для уровня опыта
export type ExperienceLevel =
  | 'Нет опыта'
  | 'От 1 года до 3 лет'
  | 'От 3 до 6 лет'
  | 'Более 6 лет'
  | null

export interface SearchSettings {
  keywords: string | null
  excluded_keywords: string | null
  search_in: ('title' | 'description')[]
  inTitle: boolean
  inDescription: boolean
  excludedKeywords: string[]
  industries: string[]
  experienceLevel: ExperienceLevel
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    settings: {
      keywords: '',
      excluded_keywords: '',
      search_in: [],
      inTitle: true,
      inDescription: false,
      excludedKeywords: [],
      // Начальные данные для тегов, соответствующие ТЗ
      industries: ['Аналитик', 'Гейм-дизайнер', 'Менеджер продукта'],
      experienceLevel: null,
    } as SearchSettings,

    // Состояние счетчика вакансий
    vacanciesCount: 0,
    isCounting: false, // Флаг для лоудера

    experienceOptions: [
      { title: 'Нет опыта', value: 'Нет опыта' },
      { title: 'От 1 года до 3 лет', value: 'От 1 года до 3 лет' },
      { title: 'От 3 до 6 лет', value: 'От 3 до 6 лет' },
      { title: 'Более 6 лет', value: 'Более 6 лет' },
    ],
  }),

  getters: {
    // Получение количества отраслей для отображения "7 отраслей"
    industriesCount: (state) => state.settings.industries.length,

    // Преобразование строки keywords в массив для API
    get_keywords_array: (state) => {
      let arr: string[] = []
      if (state.settings.keywords) {
        arr = state?.settings?.keywords
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean) // Удаляем пустые строки
      }

      return arr
    },

    // Аналогично для excluded_keywords
    get_excluded_keywords_array: (state) => {
      let arr: string[] = []
      if (state.settings.excluded_keywords) {
        arr = state?.settings?.excluded_keywords
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }

      return arr
    },

    get_search_in: (state) => {
      const arr: ('title' | 'description')[] = []
      if (state.settings.inTitle) {
        arr.push('title')
      }
      if (state.settings.inDescription) {
        arr.push('description')
      }

      return arr
    },
  },

  actions: {
    // Действие для удаления тега отрасли
    removeIndustry(industry: string) {
      this.settings.industries = this.settings.industries.filter((i) => i !== industry)
    },

    async fetchVacanciesCount() {
      if (this.isCounting) {
        return
      }

      this.isCounting = true
      const formatedData = {
        position_id: 1,
        keywords: this.get_keywords_array,
        exclude_keywords: this.get_excluded_keywords_array,
        search_in: this.get_search_in,
        industries: this.settings.industries,
        experience: this.settings.experienceLevel,
      }
      try {
        const res = await searchApi.fetchVacanciesCount(formatedData)
        this.vacanciesCount = res
      } catch (error) {
        console.error('Ошибка при получении количества вакансий:', error)
        this.vacanciesCount = 0
      } finally {
        this.isCounting = false
      }
    },
  },
})
