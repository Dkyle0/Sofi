import { http } from '@/shared/api/http'
import type { IndustryCategory } from '../model/types'

export interface IndustryGateway {
  getAll(signal?: AbortSignal): Promise<IndustryCategory[]>
}

export const industryGateway: IndustryGateway = {
  async getAll(signal) {
    const { data } = await http.get<IndustryCategory[]>('/api/industries', { signal })
    return data
  },
}
