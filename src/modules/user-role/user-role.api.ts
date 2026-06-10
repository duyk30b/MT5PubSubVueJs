import { FetchApi } from '@/core/fetch_api'
import { UserRole } from './user-role.model'

export class UserRoleApi {
  static async list(): Promise<UserRole[]> {
    const response = await FetchApi.get('/user-role/list')
    return UserRole.fromList(response.userRoleList)
  }
}
