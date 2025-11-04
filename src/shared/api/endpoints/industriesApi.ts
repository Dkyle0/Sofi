import { http } from '@/shared/api/http'

export interface IndustryItem {
  id: string
  name: string
}

export interface IndustryCategory {
  id: string
  name: string
  industries: IndustryItem[]
}

export const industriesApi = {
  async getAll(): Promise<IndustryCategory[]> {
    const { data } = await http.get<IndustryCategory[]>('/api/industries')
    return data
  },
}
