import type { MT5ProgramInfo } from '@/modules/mt5_program/mt5_program_info.model'
import { defineStore } from 'pinia'

export const useMt5ProgramStore = defineStore('mt5Program', {
  state: () => {
    return {
      event_time: '',
      mt5ProgramInfoList: [] as MT5ProgramInfo[],
    }
  },
  getters: {},
  actions: {},
})
