import { FetchApi } from '@/core/fetch_api'
import type { FullResponse } from '../_base/base-dto'
import { PermissionGetQuery, PermissionListQuery } from './permission.dto'
import { Permission } from './permission.model'

export class PermissionApi {
  static async list(options: PermissionListQuery): Promise<Permission[]> {
    const query = PermissionGetQuery.toQuery(options)

    const response = await FetchApi.get('/permission/list', { query })
    const { data } = response.data as FullResponse
    return Permission.fromList(data)
  }

  static async initData() {
    const response = await FetchApi.post('/permission/init-data')
    const { data } = response.data as FullResponse<{ idsEffect: number[] }>
    return data
  }
}
