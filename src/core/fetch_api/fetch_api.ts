import { DeviceInformation } from './device_info'
import { FetchAPIBase } from './fetch_api_base'

const FetchApiSetup = {
  clientId: () => '',
  getAccessExp: () => 0,
  getAccessToken: () => '',
  getRefreshExp: () => 0,
  getRefreshToken: () => '',
  removeAuth: () => {},
  setAccessToken: (data: any) => {},
  refreshToken: async () => {},
  logout: async () => {},
  listenLoading: (loading: boolean) => {},
  listenPercent: (percent: number) => {},
  listenError: (error: any) => {},
  listenWarning: (error: any) => {},
}

const FetchApi = new FetchAPIBase()
const FetchApiBasic = new FetchAPIBase()

const headers = {
  'Content-Type': 'application/json',
  'x-os': DeviceInformation.platform,
  'x-browser': DeviceInformation.browser,
  'x-mobile': String(DeviceInformation.mobile),
  'x-client-id': FetchApiSetup.clientId(),
}

FetchApiBasic.setHeader({ ...headers })
FetchApi.setHeader({ ...headers })

FetchApi.addRequestInterceptor(async (requestInit: RequestInit) => {
  if (!FetchApiSetup.getRefreshToken() || FetchApiSetup.getRefreshExp() - 60 * 1000 < Date.now()) {
    FetchApiSetup.removeAuth()
    throw new Error('Session expired. Please log in again.')
  }
  if (!FetchApiSetup.getAccessToken()) {
    FetchApiSetup.removeAuth()
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
    FetchApiSetup.removeAuth()
    throw new Error('Unauthorized. Please log in again.')
  }
  if (response.status === 403) {
    throw new Error('Forbidden. You do not have permission to access this resource.')
  }
  if (response.status === 440) {
    await FetchApiSetup.refreshToken()
    if (!FetchApiSetup.getAccessToken()) {
      FetchApiSetup.removeAuth()
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
    const errorData = errorText ? JSON.parse(errorText) : null
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}, message: ${errorText}`)
  }
  if (response.status >= 500) {
    const errorText = await response.text()
    const errorData = errorText ? JSON.parse(errorText) : null
    throw new Error(errorData?.message || `Server error! status: ${response.status}, message: ${errorText}`)
  }
  if (!response.ok) {
    const errorText = await response.text()
    const errorData = errorText ? JSON.parse(errorText) : null
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}, message: ${errorText}`)
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

export { FetchApi, FetchApiBasic, FetchApiSetup }
