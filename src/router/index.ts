import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useProxy, useRoutes } from '@/utils/hooks/useRouter'
import HomeView from '../views/home/index.vue'

export const createRouter = () => {
  const proxyRouter = useProxy(
    createVueRouter({
      history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
      routes: useRoutes([
        { path: '/', name: 'home', meta: { title: '首页' }, component: HomeView },
        {
          path: '/about',
          name: 'about',
          meta: { title: '关于' },
          component: () => import('../views/about/index.vue')
        },
        {
          path: '/auth',
          name: 'auth',
          meta: { title: 'Auth' },
          component: () => import('../views/auth/index.vue'),
          children: [
            {
              path: 'login',
              name: 'auth/login',
              meta: { title: 'Login' },
              component: () => import('@/views/auth/login/index.vue')
            },
            {
              path: 'register',
              name: 'auth/register',
              meta: { title: 'Register' },
              component: () => import('@/views/auth/register/index.vue')
            }
          ]
        }
      ])
    })
  )

  proxyRouter.beforeEach(async (to, from, next) => {
    next()
  })

  proxyRouter.beforeResolve(async (to) => {
    return true
  })

  proxyRouter.afterEach(async (to, from) => {})

  return proxyRouter
}
