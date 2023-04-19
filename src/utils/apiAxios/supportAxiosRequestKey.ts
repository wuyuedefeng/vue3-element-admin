import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import axios from 'axios'

export const supportAxiosRequestKey = (apiAxios: AxiosInstance) => {
  const EXECUTOR_MAP: any = {}
  const createCancelToken = (config: InternalAxiosRequestConfig): void => {
    const requestKey = config.meta?.requestKey
    if (requestKey) {
      config.cancelToken = new axios.CancelToken((cancelExecutor: any) => {
        if (EXECUTOR_MAP[requestKey]) {
          EXECUTOR_MAP[requestKey]('cancel request with requestKey') // 取消掉之前的请求
        }
        EXECUTOR_MAP[requestKey] = cancelExecutor
      })
    }
  }
  const clearCancelToken = (config: InternalAxiosRequestConfig) => {
    const requestKey = config.meta?.requestKey
    if (requestKey) {
      delete EXECUTOR_MAP[requestKey]
    }
  }

  // 请求拦截
  ;(apiAxios as AxiosInstance).interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (config.meta?.requestKey && /get/i.test(config.method || 'get')) {
        createCancelToken(config)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截
  apiAxios.interceptors.response.use(
    (resp: AxiosResponse) => {
      // 请求成功
      if (resp.config?.meta?.requestKey) {
        clearCancelToken(resp.config)
      }
      return Promise.resolve(resp)
    },
    (error: AxiosError) => {
      // 请求失败
      if (error.config?.meta?.requestKey) {
        clearCancelToken(error.config)
      }
      return Promise.reject(error)
    }
  )
}
