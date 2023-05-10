import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', {
  state: (): any => ({
    visitedRoutes: []
  }),
  getters: {
    cachedRouteNames: (state) => {
      const routeNames = []
      for (const route of state.visitedRoutes) {
        let routeName = route.name
        while (routeName) {
          if (routeNames.indexOf(routeName) === -1) {
            routeNames.push(routeName)
          }
          routeName = routeName.split('/').slice(0, -1).join('/')
        }
      }
      return routeNames
    }
  },
  actions: {
    addVisitedRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route?.name || !route?.meta?.title || route?.meta?.ignoreCache) return
      const tag = { path: route.path, name: route.name, meta: route.meta, query: route.query }
      const visitedRoutes = this.visitedRoutes
      const findItem = visitedRoutes.find(
        (route: RouteLocationNormalizedLoaded) => route.path === tag.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.visitedRoutes.splice(idx, 1, tag)
      } else {
        this.visitedRoutes.push(tag)
      }
    },
    deleteVisitedRoutes(route: RouteLocationNormalizedLoaded, ops: { router: any; route: any }) {
      const visitedRoutes = this.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        if (ops.route.name === findItem.name) {
          if (idx + 1 <= this.visitedRoutes.length - 1) {
            ops.router.push({ ...this.visitedRoutes[idx + 1] })
          } else if (idx - 1 >= 0) {
            ops.router.push({ ...this.visitedRoutes[idx - 1] })
          } else {
            ops.router.push({ path: '/' })
          }
        }
        this.visitedRoutes.splice(idx, 1)
      }
    },
    deleteOtherRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const tag = { path: route.path, name: route.name, meta: route.meta, query: route.query }
      this.visitedRoutes = [tag]
    },
    deleteLeftRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const visitedRoutes: RouteLocationNormalizedLoaded[] = this.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.visitedRoutes = visitedRoutes.slice(idx)
      }
    },
    deleteRightRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const visitedRoutes: RouteLocationNormalizedLoaded[] = this.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.visitedRoutes = visitedRoutes.slice(0, idx + 1)
      }
    }
  },
  persist: [
    {
      paths: [],
      storage: localStorage
    },
    {
      paths: ['visitedRoutes'],
      storage: sessionStorage
    }
  ]
})
