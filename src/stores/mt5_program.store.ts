import type { MT5ProgramData } from '@/modules/mt5_program/mt5_program_data.model'
import { defineStore } from 'pinia'

export const useMt5ProgramStore = defineStore('mt5Program', {
  state: () => {
    return {
      event_time: '',
      mt5ProgramDataList: [] as MT5ProgramData[],
    }
  },
  getters: {},
  actions: {},
})
