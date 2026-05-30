import { FetchApi } from '@/core/fetch_api'
import type { FullResponse } from '../_base/base-dto'
import { RoleDetailQuery, RoleGetQuery, RoleListQuery, RolePaginationQuery } from './role.dto'
import { Role } from './role.model'

export class RoleApi {
  static async pagination(options: RolePaginationQuery) {
    const params = RoleGetQuery.toQuery(options)

    const response = await FetchApi.get('/role/pagination', { params })
    const { data, meta } = response as FullResponse
    return {
      roleList: Role.fromList(data.roleList),
      total: data.total,
      page: data.page,
      limit: data.limit,
    }
  }

  static async list(options: RoleListQuery): Promise<Role[]> {
    const params = RoleGetQuery.toQuery(options)

    const response = await FetchApi.get('/role/list', { params })
    const { data } = response as FullResponse
    return Role.fromList(data)
  }

  static async detail(id: number, options: RoleDetailQuery): Promise<Role> {
    const params = RoleGetQuery.toQuery(options)
    const response = await FetchApi.get(`/role/detail/${id}`, { params })
    const { data } = response as FullResponse<{ role: any }>

    return Role.from(data.role)
  }

  static async createOne(role: Role, userIdList: number[]) {
    const response = await FetchApi.post('/role/create', {
      name: role.name,
      roleCode: role.roleCode || '',
      permissionIds: role.permissionIds,
      isActive: role.isActive,

      userIdList,
    })
    const { data } = response as FullResponse<{ role: any }>

    return Role.from(data.role)
  }

  static async updateOne(id: number, role: Role, userIdList: number[]) {
    const response = await FetchApi.post(`/role/update/${id}`, {
      name: role.name,
      roleCode: role.roleCode || '',
      permissionIds: role.permissionIds,
      isActive: role.isActive,

      userIdList,
    })
    const { data } = response as FullResponse<{ role: any }>

    return Role.from(data.role)
  }

  static async destroyOne(id: number) {
    const response = await FetchApi.post(`/role/destroy/${id}`)
    const result = response as FullResponse<{ roleId: number }>

    return result
  }
}
