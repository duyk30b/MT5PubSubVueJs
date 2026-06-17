import { LOCAL_STORAGE_KEYS } from './local_storage_keys'

export class LocalStorageCore {
  static setToken(data: {
    accessToken: string
    accessExp: number
    refreshToken: string
    refreshExp: number
  }) {
    const { accessToken, refreshToken, accessExp, refreshExp } = data
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_EXP, accessExp.toString())
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_EXP, refreshExp.toString())
  }

  static removeToken() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_EXP)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_EXP)
  }

  static setAccessToken(data: { accessToken: string; accessExp: number }) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_EXP, data.accessExp.toString())
  }

  static getAccessToken() {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) || ''
  }

  static getAccessExp() {
    return Number(localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_EXP) || 0)
  }

  static getRefreshToken() {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN) || ''
  }

  static getRefreshExp() {
    return Number(localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_EXP) || 0)
  }

  static setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  static getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  static removeItem(key: string) {
    localStorage.removeItem(key)
  }

  static clear() {
    localStorage.clear()
  }
}
