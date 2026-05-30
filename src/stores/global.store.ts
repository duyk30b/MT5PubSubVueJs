import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 900,
      loading: false,
      percent: 0,
    }
  },
  getters: {},
  actions: {},
})
