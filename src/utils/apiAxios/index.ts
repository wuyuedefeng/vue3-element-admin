import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import NProgress from 'nprogress'
import 'element-plus/es/components/notification/style/css'
import { ElNotification } from 'element-plus'
import { supportAxiosRequestKey } from './supportAxiosRequestKey'

// 创建 apiAxios 实例
const apiAxios = new Proxy(
  axios.create({
    // https://cn.vitejs.dev/guide/env-and-mode.html
    baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/',
    timeout: 1000 * 60
    // paramsSerializer: (params) => qs.stringify(params, { indices: false }),
  }),
  {
    get(target, ...args) {
      return Reflect.get(target, ...args) || Reflect.get(axios, ...args)
    }
  }
)

// 设置 post 请求头
apiAxios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截 - default
apiAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.meta = {
    retry: 0 /*times*/,
    retryDelay: 100 /*ms*/,
    curRetry: 0 /*times*/,
    withProgressBar: false,
    withSuccessMessage: '',
    ...config?.meta
  }
  if (config.meta!.withProgressBar) {
    NProgress.start()
  }
  return config
})
// 请求拦截 - custom
apiAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return Promise.resolve(config)
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截 - default
apiAxios.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.meta?.withProgressBar) {
      NProgress.done()
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.config.meta?.withProgressBar) {
      NProgress.done()
    }
    // 请求失败
    const config: InternalAxiosRequestConfig | undefined = error.config
    if (axios.isCancel(error)) {
      // 是否主动取消
      return console.error('主动取消')
    } else if (config?.meta && config.meta.curRetry < config!.meta.retry) {
      // 是否需要重试
      config.meta.curRetry++
      return new Promise((resolve) => {
        setTimeout(() => {
          console.warn(`${config!.url},请求重试: ${config.meta?.curRetry}次`)
          resolve(apiAxios(config!))
        }, config.meta?.retryDelay)
      })
    }

    return Promise.reject(error)
  }
)
// 响应拦截 - custom
apiAxios.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    if (response.config.meta?.withSuccessMessage) {
      ElNotification.success({ message: response.config.meta.withSuccessMessage })
    }
    return Promise.resolve(response)
  },
  (error: AxiosError) => {
    if (!/^2/.test(`${error.status}`)) {
      let errorMessage = ''
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request Timeout'
      } else {
        errorMessage = 'Network error'
      }
      ElNotification.error({ message: errorMessage })
    }
    return Promise.reject(error)
  }
)

supportAxiosRequestKey(apiAxios)
export default apiAxios
