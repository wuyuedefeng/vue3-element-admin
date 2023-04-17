/// <reference types="vite/client" />

import type { App as VueApp, VNode } from 'vue'
declare module 'vue' {
  interface App extends VueApp {
    render: (vnode: VNode | null, container: Element) => void
  }
}

import type { Router as VueRouter, RouteRecord } from 'vue-router'
declare module 'vue-router' {
  interface Router extends VueRouter {
    getRoute: (routeName: string) => RouteRecord | undefined
    getParentRoute: (route: RouteRecord) => RouteRecord | undefined
  }
}

import type { AxiosRequestConfig as VueAxiosRequestConfig } from 'axios'
declare module 'axios' {
  interface AxiosRequestConfig extends VueAxiosRequestConfig {
    meta?: {
      retry: number /*times*/
      retryDelay: number /*ms*/
      curRetry: number /*times*/
      withProgressBar: boolean
      requestKey?: string
    }
  }
}

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
