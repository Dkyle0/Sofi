import { http } from '@/shared/api/http'

export interface LoginRequest {
  grant_type: 'password'
  username: string
  password: string
  scope?: string
  client_id?: string
  client_secret?: string
}

export interface UserDataResponse {
  user_id: string
  email: string
  name: string
  gender: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  telegram: string | null
  portfolio_link: string | null
  created_at: string
  updated_at: string | null
  last_login: string | null
  plan: {
    plan_id: number
    name: string
    price: number
    duration_days: number
    features: unknown[]
  }
  trial_end: string
  subscription_expiry: string
  payment_status: string
  subscription_product_code: string | null
  is_cancelled: boolean
  promo_discount_percent: number | null
}

export const authApi = {
  async login(payload: LoginRequest): Promise<UserDataResponse> {
    const formData = new URLSearchParams()
    formData.append('grant_type', payload.grant_type)
    formData.append('username', payload.username)
    formData.append('password', payload.password)
    if (payload.scope) formData.append('scope', payload.scope)
    if (payload.client_id) formData.append('client_id', payload.client_id)
    if (payload.client_secret) formData.append('client_secret', payload.client_secret)

    const { data } = await http.post<UserDataResponse>('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    return data
  },

  async logout(): Promise<void> {
    await http.post('/api/auth/logout')
  },
}

export const userApi = {
  async getMe(): Promise<UserDataResponse> {
    const { data } = await http.post<UserDataResponse>('/api/auth/refresh')
    return data
  },
}
