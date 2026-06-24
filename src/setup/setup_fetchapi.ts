import { DeviceInformation } from '@/core/fetch_api/device_info'
import { CONFIG } from '../config'
import { FetchApi, FetchApiBasic } from '../core/fetch_api'
import { LocalStorageCore } from '../core/local_storage/local_storage_core'
import { LOCAL_STORAGE_KEYS } from '../core/local_storage/local_storage_keys'
import { AuthApi } from '../modules/auth/auth.api'

export const setupFetchApi = () => {
  const FetchApiConfig = {
    clientId: () => localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENT_ID) || '',
    getAccessExp: () => LocalStorageCore.getAccessExp(),
    getAccessToken: () => LocalStorageCore.getAccessToken(),
    getRefreshExp: () => LocalStorageCore.getRefreshExp(),
    getRefreshToken: () => LocalStorageCore.getRefreshToken(),
    removeAuth: () => LocalStorageCore.removeToken(),
    setAccessToken: (data: any) => LocalStorageCore.setAccessToken(data),
    refreshToken: (() => {
      const start = async () => {
        const refreshToken = FetchApiConfig.getRefreshToken()
        if (!refreshToken) {
          FetchApiConfig.removeAuth()
          return
        }
        try {
          const data = await AuthApi.refreshToken(refreshToken)
          FetchApiConfig.setAccessToken(data)
        } catch (error: any) {
          FetchApiConfig.removeAuth()
        }
      }
      let fetching: any = null
      return async () => {
        if (!fetching) fetching = start()
        await fetching
        fetching = null
      }
    })(),
    logout: async () => {
      try {
        await AuthApi.logout(LocalStorageCore.getRefreshToken() || '')
      } catch (error: any) {
        // AlertStore.addError(error.message)
      } finally {
        FetchApiConfig.removeAuth()
      }
    },
    listenLoading: (loading: boolean) => {},
    listenPercent: (percent: number) => {},
    listenError: (error: any) => {},
    listenWarning: (error: any) => {},
  }

  FetchApi.init({ baseURL: CONFIG.API_BASE_URL, timeout: 30000 })
  FetchApiBasic.init({ baseURL: CONFIG.API_BASE_URL, timeout: 30000 })

  const headers = {
    'Content-Type': 'application/json',
    'X-OS': DeviceInformation.platform,
    'X-Browser': DeviceInformation.browser,
    'X-Mobile': String(DeviceInformation.mobile),
    'X-Client-ID': FetchApiConfig.clientId(),
  }

  FetchApiBasic.setHeader({ ...headers })
  FetchApi.setHeader({ ...headers })

  FetchApi.addRequestInterceptor(async (requestInit: RequestInit) => {
    if (
      !FetchApiConfig.getRefreshToken() ||
      FetchApiConfig.getRefreshExp() - 60 * 1000 < Date.now()
    ) {
      FetchApiConfig.removeAuth()
      throw new Error('Session expired. Please log in again.')
    }
    if (!FetchApiConfig.getAccessToken()) {
      FetchApiConfig.removeAuth()
      throw new Error('No access token. Please log in again.')
    }
    if (FetchApiConfig.getAccessExp() - 10 * 1000 < Date.now()) {
      await FetchApiConfig.refreshToken()
    }

    requestInit.headers!['Authorization'] = `Bearer ${FetchApiConfig.getAccessToken()}`
    FetchApiConfig.listenLoading(true)
    FetchApiConfig.listenPercent(30)
    return requestInit
  })

  FetchApi.addResponseInterceptor(async (requestInit: RequestInit, response: Response) => {
    FetchApiConfig.listenPercent(100)
    if (response.status === 401) {
      FetchApiConfig.removeAuth()
      throw new Error('Unauthorized. Please log in again.')
    }
    if (response.status === 403) {
      throw new Error('Forbidden. You do not have permission to access this resource.')
    }
    if (response.status === 440) {
      await FetchApiConfig.refreshToken()
      if (!FetchApiConfig.getAccessToken()) {
        FetchApiConfig.removeAuth()
        throw new Error('Session expired. Please log in again.')
      }
      requestInit.headers!['Authorization'] = `Bearer ${FetchApiConfig.getAccessToken()}`
      let retryResponse: Response = await fetch(response.url, requestInit)
      if (!retryResponse.ok) {
        const errorText = await retryResponse.text()
        throw new Error(`HTTP error! status: ${retryResponse.status}, message: ${errorText}`)
      }
      return retryResponse
    }
    if (response.status >= 400 && response.status < 500) {
      const errorText = await response.text()
      const errorData = errorText ? JSON.parse(errorText) : null
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}, message: ${errorText}`,
      )
    }
    if (response.status >= 500) {
      const errorText = await response.text()
      const errorData = errorText ? JSON.parse(errorText) : null
      throw new Error(
        errorData?.message || `Server error! status: ${response.status}, message: ${errorText}`,
      )
    }
    if (!response.ok) {
      const errorText = await response.text()
      const errorData = errorText ? JSON.parse(errorText) : null
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}, message: ${errorText}`,
      )
    }
    setTimeout(() => {
      FetchApiConfig.listenLoading(false)
      FetchApiConfig.listenPercent(0)
    }, 300)
    return response
  })

  FetchApi.addErrorInterceptor(async (error: any) => {
    FetchApiConfig.listenLoading(false)
    FetchApiConfig.listenPercent(0)
    FetchApiConfig.listenError(error)
    return error
  })
}
