import { AlertStore } from './common/vue-alert'
import { CONFIG } from './config'
import { FetchApi, FetchApiBasic, FetchApiSetup } from './core/fetch_api'
import { LocalStorageCore } from './core/local_storage/local_storage_core'
import { LOCAL_STORAGE_KEYS } from './core/local_storage/local_storage_keys'
import { SocketBase } from './core/socket/socket.base'
import { AuthApi } from './modules/auth/auth.api'

const setupContainer = () => {
  // ========== FetchApi Setup ==========
  FetchApiSetup.clientId = () => localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENT_ID) || ''
  FetchApiSetup.getAccessExp = LocalStorageCore.getAccessExp
  FetchApiSetup.getAccessToken = LocalStorageCore.getAccessToken
  FetchApiSetup.getRefreshExp = LocalStorageCore.getRefreshExp
  FetchApiSetup.getRefreshToken = LocalStorageCore.getRefreshToken
  FetchApiSetup.removeAuth = LocalStorageCore.removeToken
  FetchApiSetup.setAccessToken = LocalStorageCore.setAccessToken
  FetchApiSetup.refreshToken = (() => {
    const start = async () => {
      const refreshToken = FetchApiSetup.getRefreshToken()
      if (!refreshToken) {
        FetchApiSetup.removeAuth()
        return
      }
      try {
        const data = await AuthApi.refreshToken(refreshToken)
        FetchApiSetup.setAccessToken(data)
      } catch (error: any) {
        FetchApiSetup.removeAuth()
      }
    }
    let fetching: any = null
    return async () => {
      if (!fetching) fetching = start()
      await fetching
      fetching = null
    }
  })()
  FetchApiSetup.logout = async () => {
    try {
      await AuthApi.logout(LocalStorageCore.getRefreshToken() || '')
    } catch (error: any) {
      // AlertStore.addError(error.message)
    } finally {
      FetchApiSetup.removeAuth()
    }
  }
  FetchApiSetup.listenLoading = (loading: boolean) => {
    // LoadingStore.setLoading(loading)
  }
  FetchApiSetup.listenPercent = (percent: number) => {
    // LoadingStore.setPercent(percent)
  }
  FetchApiSetup.listenError = (error: any) => {
    AlertStore.addError(error.message)
  }
  FetchApiSetup.listenWarning = (error: any) => {
    // AlertStore.addWarning(error.message)
  }

  FetchApi.init({ baseURL: CONFIG.API_BASE_URL, timeout: 30000 })
  FetchApiBasic.init({ baseURL: CONFIG.API_BASE_URL, timeout: 30000 })

  // ========== SocketBase Setup ==========
  SocketBase.init({
    baseURL: CONFIG.API_BASE_URL,
    token: LocalStorageCore.getAccessToken(),
    mode: CONFIG.MODE,
  })
  SocketBase.connect()
}

export { setupContainer }
