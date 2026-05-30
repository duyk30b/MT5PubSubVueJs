import { reactive } from 'vue'
import { LOCAL_STORAGE_KEYS } from './core/local_storage/local_storage_keys'

export const CONFIG = reactive({
  CLIENT_ID: '',
  MODE: import.meta.env.MODE as 'development' | 'production' | 'test',
  API_BASE_URL:
    import.meta.env.MODE === 'production'
      ? `https://api.mea.vn`
      : `http://${location.hostname}:20000`,
  BUILD_TIME: '',
})
;(window as any)._MEA_CONFIG = CONFIG
// CONFIG.API_BASE_URL = 'https://api.mea.vn'

const loadConfig = async () => {
  try {
    let CLIENT_ID = localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENT_ID)
    if (!CLIENT_ID) {
      CLIENT_ID = Math.random().toString(36).substring(2).toUpperCase()
      localStorage.setItem(LOCAL_STORAGE_KEYS.CLIENT_ID, CLIENT_ID)
    }
    CONFIG.CLIENT_ID = CLIENT_ID

    CONFIG.BUILD_TIME = new Date().toISOString()
  } catch (error) {
    console.log('🚀 ~ config.ts:28 ~ loadConfig ~ error:', error)
  }
}

loadConfig()
