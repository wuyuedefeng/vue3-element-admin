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
    deleteTagsViewVisitedRoutes(route: RouteLocationNormalizedLoaded) {
      const visitedRoutes = this.tagsView.visitedRoutes
      const findItem = visitedRoutes.find(
        (view: RouteLocationNormalizedLoaded) => view.path === route.path
      )
      if (findItem) {
        const idx = visitedRoutes.indexOf(findItem)
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
