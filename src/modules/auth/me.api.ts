import { FetchApi } from '@/core/fetch_api'
import type { FullResponse } from '../_base/base-dto'
import { Permission } from '../permission/permission.model'
import { User } from '../user/user.model'

export class MeApi {
  static async data() {
    const response = await FetchApi.get('/me/data')
    return {
      permissionAll: Permission.fromList(response.permissionAll),
      permissionIds: response.permissionIds,
      settingMap: response.settingMap as Record<string, any>,
      user: User.from(response.user),
    }
  }

  static async info() {
    const response = await FetchApi.get('/me/info')
    const data = response.data as any
    return User.from(data.user)
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    const response = await FetchApi.post('/me/change-password', {
      body: { oldPassword, newPassword },
    })
    const { data } = response.data as FullResponse<boolean>
    return data
  }
}
