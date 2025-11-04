import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import SearchSettingsPage from '@/pages/SearchSettingsPage.vue'
import StubPage from '@/pages/StubPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import { useAuthStore } from '@/stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppLayout,
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
        component: SearchSettingsPage,
      },
      {
        path: 'responses',
        name: 'Responses',
        component: StubPage,
        props: { title: 'Отклики' },
      },
      {
        path: 'subscription',
        name: 'Subscription',
        component: StubPage,
        props: { title: 'Подписка' },
      },
      {
        path: 'interviews',
        name: 'Interviews',
        component: StubPage,
        props: { title: 'Интервью' },
      },
      {
        path: 'vacancies',
        name: 'Vacancies',
        component: StubPage,
        props: { title: 'Вакансии' },
      },
    ],
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/AuthPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated && to.path !== '/auth') {
    next('/auth')
  } else {
    next()
  }
})

export default router
