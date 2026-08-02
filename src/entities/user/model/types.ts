export interface SubscriptionPlan {
  id: number
  name: string
  price: number
  durationDays: number
  features: unknown[]
}

export interface User {
  id: string
  email: string
  name: string
  gender: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  telegram: string | null
  portfolioLink: string | null
  createdAt: string
  updatedAt: string | null
  lastLogin: string | null
  plan: SubscriptionPlan
  trialEnd: string
  subscriptionExpiry: string
  paymentStatus: string
  subscriptionProductCode: string | null
  isCancelled: boolean
  promoDiscountPercent: number | null
}
