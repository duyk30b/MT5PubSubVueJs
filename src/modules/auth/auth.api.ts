import { FetchApi, FetchApiBasic } from '@/core/fetch_api'
import { User } from '../user'

export class AuthApi {
  static async login(body: { username: string; password: string }) {
    const response = await FetchApiBasic.post(`auth/login`, { body })
    return {
      user: User.from(response.user),
      accessToken: response.accessToken as string,
      accessExp: response.accessExp as number,
      refreshToken: response.refreshToken as string,
      refreshExp: response.refreshExp as number,
    }
  }

  static async refreshToken(refreshToken: string) {
    const response = await FetchApiBasic.post(`auth/refresh_token`, {
      body: { refreshToken },
    })
    return response as { accessToken: string; accessExp: number }
  }

  static async logout(refreshToken: string) {
    const response = await FetchApi.post(`auth/logout`, { body: { refreshToken } })
    return response as { detail: string }
  }
}
