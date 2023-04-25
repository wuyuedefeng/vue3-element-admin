import type { Router, RouteRecord, RouteRecordRaw } from 'vue-router'

export const useRoute = (route: RouteRecordRaw): RouteRecordRaw => {
  const { component, ...finalRoute } = route

  // component
  if (typeof route['component'] === 'function') {
    ;(finalRoute as any)['component'] = async () => {
      const module = await (route as any)['component']()
      module.default.name = route.name
      return module
    }
  } else {
    ;(finalRoute as any)['component'] = component
  }

  return finalRoute as RouteRecordRaw
}

export const useRoutes = (routes: RouteRecordRaw[]) => {
  const iterateUseRoute = (route: RouteRecordRaw): RouteRecordRaw => {
    if (route.children?.length) {
      route.children = route.children.map((childRoute: RouteRecordRaw) =>
        iterateUseRoute(childRoute)
      )
    }
    return useRoute(route)
  }
  return routes.map((route) => iterateUseRoute(route))
}

export const useProxy = (router: Router) => {
  const proxyRouter = new Proxy(router, {
    get(object, key, ...args) {
      if (key === 'getRoute') {
        return function (routeName: string): RouteRecord | undefined {
          const routes = object.getRoutes()
          return routes.find((route) => route.name === routeName)
        }
      } else if (key === 'getParentRoute') {
        return function (route: RouteRecord): RouteRecord | undefined {
          const parentRouteName = (route.name as string)?.split('/').slice(0, -1).join('/')
          return parentRouteName ? (proxyRouter as any)['getRoute'](parentRouteName) : undefined
        }
      } else {
        return Reflect.get(object, key, ...args)
      }
    }
  })
  return proxyRouter
}
