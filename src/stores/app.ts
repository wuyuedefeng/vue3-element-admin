import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): any => ({
    config: {
      fixHeader: true
    },
    navMenu: {
      collapse: false,
      popperEffect: 'dark'
    },
    tagsView: {
      visitedRoutes: [],
      cachedRoutes: []
    }
  }),
  getters: {
    visitedRouteNames: (state) =>
      state.tagsView.visitedRoutes.map((view: RouteLocationNormalizedLoaded) => view.name)
  },
  actions: {
    addTagsViewVisitedRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route?.name || !route?.meta?.title) return
      const tag = { path: route.path, name: route.name, meta: route.meta, query: route.query }
      const visitedRoutes = this.tagsView.visitedRoutes
      const findItem = visitedRoutes.find(
        (route: RouteLocationNormalizedLoaded) => route.path === tag.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.tagsView.visitedRoutes.splice(idx, 1, tag)
      } else {
        this.tagsView.visitedRoutes.push(tag)
      }
    },
    deleteTagsViewVisitedRoutes(
      route: RouteLocationNormalizedLoaded,
      ops: { router: any; route: any }
    ) {
      const visitedRoutes = this.tagsView.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        console.log(111, findItem, idx, ops)
        if (ops.route.name === findItem.name) {
          if (idx + 1 <= this.tagsView.visitedRoutes.length - 1) {
            console.log(0)
            ops.router.push({ ...this.tagsView.visitedRoutes[idx + 1] })
          } else if (idx - 1 >= 0) {
            console.log(1, this.tagsView.visitedRoutes[idx - 1])
            ops.router.push({ ...this.tagsView.visitedRoutes[idx - 1] })
          } else {
            console.log(2)
            ops.router.push({ path: '/' })
          }
        }
        this.tagsView.visitedRoutes.splice(idx, 1)
      }
    },
    deleteTagsViewOtherRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const tag = { path: route.path, name: route.name, meta: route.meta, query: route.query }
      this.tagsView.visitedRoutes = [tag]
    },
    deleteTagsViewLeftRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const visitedRoutes: RouteLocationNormalizedLoaded[] = this.tagsView.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.tagsView.visitedRoutes = visitedRoutes.slice(idx)
      }
    },
    deleteTagsViewRightRoutes(route: RouteLocationNormalizedLoaded) {
      if (!route) return
      const visitedRoutes: RouteLocationNormalizedLoaded[] = this.tagsView.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
        this.tagsView.visitedRoutes = visitedRoutes.slice(0, idx + 1)
      }
    }
  },
  persist: [
    {
      paths: [],
      storage: localStorage
    },
    {
      paths: ['config', 'navMenu', 'tagsView'],
      storage: sessionStorage
    }
  ]
})
