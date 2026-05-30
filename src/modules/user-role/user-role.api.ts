import { FetchApi } from '@/core/fetch_api'
import type { FullResponse } from '../_base/base-dto'
import { UserRole } from './user-role.model'

export class UserRoleApi {
  static async list(): Promise<UserRole[]> {
    const response = await FetchApi.get('/user-role/list')
    const { data } = response.data as FullResponse
    return UserRole.fromList(data)
  }
}
