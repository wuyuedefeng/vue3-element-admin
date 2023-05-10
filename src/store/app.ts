import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): any => ({
    config: {
      fixHeader: true
    },
    navMenu: {
      collapse: false,
      popperEffect: 'dark'
    }
  }),
  actions: {},
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
