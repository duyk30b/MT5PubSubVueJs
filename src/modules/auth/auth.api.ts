import { FetchApi, FetchApiWithoutAuth } from '@/core/fetch_api'
import { User } from '../user'
import type { LoginDto } from './auth.dto'

export class AuthApi {
  static async login(body: LoginDto) {
    const response = await FetchApiWithoutAuth.post(`auth/login`, body)
    const data = response.data as {
      user: any
      accessToken: string
      accessExp: number
      refreshToken: string
      refreshExp: number
    }
    return {
      user: User.from(data.user),
      accessToken: data.accessToken as string,
      accessExp: data.accessExp as number,
      refreshToken: data.refreshToken as string,
      refreshExp: data.refreshExp as number,
    }
  }

  static async refreshToken(refreshToken: string) {
    const response = await FetchApiWithoutAuth.post(`auth/refresh_token`, { refreshToken })
    const data = response.data as { accessToken: string; accessExp: number }
    return data
  }

  static async logout(refreshToken: string) {
    const response = await FetchApi.post(`auth/logout`, { refreshToken })
    const data = response.data as { detail: string }
    return data
  }
}
