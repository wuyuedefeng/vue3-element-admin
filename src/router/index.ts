import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useProxy, useRoutes } from '@/utils/hooks/useRouter'
import HomeView from '../views/home/index.vue'

export const createRouter = () => {
  const proxyRouter = useProxy(
    createVueRouter({
      history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
      routes: useRoutes([
        { path: '/', name: 'home', component: HomeView },
        { path: '/about', name: 'about', component: () => import('../views/about/index.vue') }
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
