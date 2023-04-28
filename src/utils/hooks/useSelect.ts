import { reactive } from 'vue'
import { asyncDebounce } from '@/utils/libs/asyncDebounce'
export const useSelect = (options: SelectOptions) => {
  const debounceOnload = asyncDebounce(options.onLoad || (async () => {}), 500)

  const state = reactive<Select>({
    isLoading: false,
    options: options.options || [],
    async onLoad(query?: any, ...args: any[]) {
      try {
        state.isLoading = true
        await debounceOnload(query, ...args)
      } finally {
        state.isLoading = false
      }
    }
  })
  return state
}

export interface SelectOptions {
  options?: any[]
  onLoad?: (query?: any, ...args: any[]) => Promise<void>
}

export interface Select extends SelectOptions {
  isLoading: boolean
}
