import { LOCAL_STORAGE_KEYS } from '../local_storage/local_storage_keys'
import { DeviceInformation } from './device_info'
import { FetchAPIBase } from './fetch_api_base'

const FetchApiSetup = {
  baseURL: '',
  logout: async () => {},
  clientId: () => localStorage.getItem(LOCAL_STORAGE_KEYS.CLIENT_ID) || '',
  getRefreshToken: () => localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN) || '',
  getRefreshExp: () => Number(localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_EXP)) || 0,
  getAccessToken: () => localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) || '',
  getAccessExp: () => Number(localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_EXP)) || 0,
  removeAuth: async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_EXP)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_EXP)
  },
  refreshToken: async () => {},
  listenLoading: (loading: boolean) => {},
  listenPercent: (percent: number) => {},
  listenError: (error: any) => {},
  listenWarning: (error: any) => {},
}

const FetchApi = new FetchAPIBase({ baseURL: FetchApiSetup.baseURL, timeout: 10000 })
const FetchApiWithoutAuth = new FetchAPIBase({ baseURL: FetchApiSetup.baseURL, timeout: 10000 })

const headers = new Headers()
headers.set('Content-Type', 'application/json')
headers.set('x-os', DeviceInformation.platform)
headers.set('x-browser', DeviceInformation.browser)
headers.set('x-mobile', String(DeviceInformation.mobile))
headers.set('x-client-id', FetchApiSetup.clientId())

const headersWithoutAuth = new Headers(headers)

FetchApi.setHeader(headers)
FetchApiWithoutAuth.setHeader(headersWithoutAuth)

FetchApi.addRequestInterceptor(async (requestInit: RequestInit) => {
  if (!FetchApiSetup.getRefreshToken() || FetchApiSetup.getRefreshExp() - 60 * 1000 < Date.now()) {
    await FetchApiSetup.removeAuth()
    throw new Error('Session expired. Please log in again.')
  }
  if (!FetchApiSetup.getAccessToken()) {
    await FetchApiSetup.removeAuth()
    throw new Error('No access token. Please log in again.')
  }
  if (FetchApiSetup.getAccessExp() - 10 * 1000 < Date.now()) {
    await FetchApiSetup.refreshToken()
  }

  requestInit.headers!['Authorization'] = `Bearer ${FetchApiSetup.getAccessToken()}`
  FetchApiSetup.listenLoading(true)
  FetchApiSetup.listenPercent(30)
  return requestInit
})

FetchApi.addResponseInterceptor(async (requestInit: RequestInit, response: Response) => {
  FetchApiSetup.listenPercent(100)
  if (response.status === 401) {
    await FetchApiSetup.removeAuth()
    throw new Error('Unauthorized. Please log in again.')
  }
  if (response.status === 403) {
    throw new Error('Forbidden. You do not have permission to access this resource.')
  }
  if (response.status === 440) {
    await FetchApiSetup.refreshToken()
    if (!FetchApiSetup.getAccessToken()) {
      await FetchApiSetup.removeAuth()
      throw new Error('Session expired. Please log in again.')
    }
    requestInit.headers!['Authorization'] = `Bearer ${FetchApiSetup.getAccessToken()}`
    let retryResponse: Response = await fetch(response.url, requestInit)
    if (!retryResponse.ok) {
      const errorText = await retryResponse.text()
      throw new Error(`HTTP error! status: ${retryResponse.status}, message: ${errorText}`)
    }
    return retryResponse
  }
  if (response.status >= 400 && response.status < 500) {
    const errorText = await response.text()
    throw new Error(`Client error! status: ${response.status}, message: ${errorText}`)
  }
  if (response.status >= 500) {
    const errorText = await response.text()
    throw new Error(`Server error! status: ${response.status}, message: ${errorText}`)
  }
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }
  setTimeout(() => {
    FetchApiSetup.listenLoading(false)
    FetchApiSetup.listenPercent(0)
  }, 300)
  return response
})

FetchApi.addErrorInterceptor(async (error: any) => {
  FetchApiSetup.listenLoading(false)
  FetchApiSetup.listenPercent(0)
  FetchApiSetup.listenError(error)
  return error
})

export { FetchApi, FetchApiWithoutAuth, FetchApiSetup }
