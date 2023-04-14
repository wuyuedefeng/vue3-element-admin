import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
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
    },
    clearLoginInfo() {
      this.setUserInfo(null)
      this.setAuthInfo(null)
    }
  }
})
