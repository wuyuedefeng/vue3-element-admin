import { reactive } from 'vue'

export function useLoading() {
  let self: any = null
  const state = reactive<Loading>({
    value: false,
    data: null,
    async load(executor: () => Promise<any>) {
      console.assert(!!executor, '必须传递执行器')
      try {
        self.value = true
        self.data = await executor()
        return self.data
      } catch (e) {
        self.data = null
      } finally {
        self.value = false
      }
    }
  })
  self = state
  return state
}

export interface Loading {
  value: boolean
  data: any
  load: (executor: () => Promise<any>) => Promise<any>
}
