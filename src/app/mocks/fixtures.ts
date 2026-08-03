import type { IndustryCategory } from '@/entities/industry'
import type { AuthUserDto } from '@/features/auth'
export { demoCredentials as mockCredentials } from '@/shared/config'
import { demoCredentials } from '@/shared/config'

export const mockUser: AuthUserDto = {
  user_id: 'demo-user-1',
  email: demoCredentials.username,
  name: 'София Орлова',
  gender: 'not_specified',
  first_name: 'София',
  last_name: 'Орлова',
  phone: null,
  telegram: null,
  portfolio_link: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: null,
  last_login: null,
  plan: {
    plan_id: 0,
    name: 'Демо',
    price: 0,
    duration_days: 365,
    features: [],
  },
  trial_end: '2027-01-01T00:00:00.000Z',
  subscription_expiry: '2027-01-01T00:00:00.000Z',
  payment_status: 'demo',
  subscription_product_code: 'demo',
  is_cancelled: false,
  promo_discount_percent: null,
}

export const mockIndustries: IndustryCategory[] = [
  {
    id: 'technology',
    name: 'Технологии',
    industries: [
      { id: 'analytics', name: 'Аналитик' },
      { id: 'product', name: 'Менеджер продукта' },
      { id: 'development', name: 'Разработка ПО' },
      { id: 'qa', name: 'Тестирование' },
    ],
  },
  {
    id: 'creative',
    name: 'Креативные индустрии',
    industries: [
      { id: 'game-design', name: 'Гейм-дизайнер' },
      { id: 'design', name: 'Дизайн' },
      { id: 'media', name: 'Медиа' },
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    industries: [
      { id: 'marketing', name: 'Маркетинг' },
      { id: 'sales', name: 'Продажи' },
      { id: 'finance', name: 'Финансы' },
    ],
  },
]
