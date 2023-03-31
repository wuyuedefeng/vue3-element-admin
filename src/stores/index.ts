import { createPinia as createVuePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const createPinia = () => {
  const pinia = createVuePinia()
  pinia.use(
    createPersistedState({
      storage: localStorage,
      key: (id) => `__persisted__${id}`,
      beforeRestore: (ctx) => {
        if (import.meta.env.DEV) {
          console.info(`beforeRestore: ${ctx.store.$id}`)
        }
      },
      afterRestore: (ctx) => {
        if (import.meta.env.DEV) {
          console.info(`afterRestore: ${ctx.store.$id}`)
        }
      }
    })
  )
  return pinia
}
