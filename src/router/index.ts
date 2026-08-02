import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Sofi',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/StubPage.vue'),
        props: { title: 'Дэшборд' },
      },
      {
        path: 'positions',
        name: 'Positions',
        component: () => import('@/pages/SearchSettingsPage.vue'),
      },
      {
        path: 'responses',
        name: 'Responses',
        component: () => import('@/pages/StubPage.vue'),
        props: { title: 'Отклики' },
      },
      {
        path: 'subscription',
        name: 'Subscription',
        component: () => import('@/pages/StubPage.vue'),
        props: { title: 'Подписка' },
      },
      {
        path: 'interviews',
        name: 'Interviews',
        component: () => import('@/pages/StubPage.vue'),
        props: { title: 'Интервью' },
      },
      {
        path: 'vacancies',
        name: 'Vacancies',
        component: () => import('@/pages/StubPage.vue'),
        props: { title: 'Вакансии' },
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/AuthPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return {
      name: 'Auth',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
