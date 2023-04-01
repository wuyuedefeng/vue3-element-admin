import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): any => ({
    authInfo: null,
    userInfo: null
  }),
  getters: {
    isLogin: (state) => !state.authInfo
  },
  actions: {
    setAuthInfo(authInfo: any): void {
      this.authInfo = authInfo
    },
    setUserInfo(userInfo: any): void {
      this.userInfo = userInfo
    }
  }
})
