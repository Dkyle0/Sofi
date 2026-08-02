import type { User } from '@/entities/user'
import { http } from '@/shared/api/http'

export interface Credentials {
  username: string
  password: string
}

interface AuthUserDto {
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

export interface AuthGateway {
  login(credentials: Credentials): Promise<User>
  restoreSession(): Promise<User | null>
  logout(): Promise<void>
}

function mapUser(dto: AuthUserDto): User {
  return {
    id: dto.user_id,
    email: dto.email,
    name: dto.name,
    gender: dto.gender,
    firstName: dto.first_name,
    lastName: dto.last_name,
    phone: dto.phone,
    telegram: dto.telegram,
    portfolioLink: dto.portfolio_link,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    lastLogin: dto.last_login,
    plan: {
      id: dto.plan.plan_id,
      name: dto.plan.name,
      price: dto.plan.price,
      durationDays: dto.plan.duration_days,
      features: dto.plan.features,
    },
    trialEnd: dto.trial_end,
    subscriptionExpiry: dto.subscription_expiry,
    paymentStatus: dto.payment_status,
    subscriptionProductCode: dto.subscription_product_code,
    isCancelled: dto.is_cancelled,
    promoDiscountPercent: dto.promo_discount_percent,
  }
}

// REAL API TRANSPORT: in demo mode MSW intercepts these endpoint calls before they leave the browser.
export const authGateway: AuthGateway = {
  async login(credentials) {
    const payload = new URLSearchParams({
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
    })
    const { data } = await http.post<AuthUserDto>('/api/auth/login', payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return mapUser(data)
  },

  async restoreSession() {
    try {
      const { data } = await http.post<AuthUserDto>('/api/auth/refresh')
      return mapUser(data)
    } catch {
      return null
    }
  },

  async logout() {
    await http.post('/api/auth/logout')
  },
}

export type { AuthUserDto }
