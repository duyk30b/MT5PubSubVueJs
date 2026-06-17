import { FetchApi } from '@/core/fetch_api'
import { UserDetailQuery, UserGetQuery, UserListQuery, UserPaginationQuery } from './user.dto'
import { User } from './user.model'

export class UserApi {
  static async pagination(options: UserPaginationQuery) {
    const query = UserGetQuery.toQuery(options)
    const response = await FetchApi.get('/user/pagination', { query })
    return {
      userList: User.fromList(response.userList),
      total: response.total,
      page: response.page,
      limit: response.limit,
    }
  }

  static async list(options: UserListQuery): Promise<User[]> {
    const query = UserGetQuery.toQuery(options)

    const response = await FetchApi.get('/user/list', { query })
    return User.fromList(response.userList)
  }

  static async detail(id: number, options?: UserDetailQuery): Promise<User> {
    const query = UserGetQuery.toQuery(options || {})

    const response = await FetchApi.get(`/user/detail/${id}`, { query })
    return User.from(response.user)
  }

  static async createOne(body: {
    user: User
    roleIdList: number[]
    account: { username: string; password: string }
  }) {
    const { user, account, roleIdList } = body
    const response = await FetchApi.post('/user/create', {
      body: {
        user: {
          phone: user.phone,
          fullName: user.fullName,
          birthday: user.birthday,
          gender: user.gender,
          isActive: user.isActive,
        },
        account,
        roleIdList,
      },
    })
    return User.from(response.user)
  }

  static async updateOne(
    id: number,
    body: {
      user: User
      account?: { username: string; password: string }
      roleIdList?: number[]
      roomIdList?: number[]
    },
  ) {
    const { user, account, roleIdList, roomIdList } = body
    const response = await FetchApi.post(`/user/update/${id}`, {
      body: {
        user: {
          phone: user.phone,
          fullName: user.fullName,
          birthday: user.birthday,
          gender: user.gender,
          isActive: user.isActive,
        },
        account,
        roomIdList,
        roleIdList,
      },
    })
    return User.from(response.user)
  }

  static async deleteOne(id: number) {
    const response = await FetchApi.post(`/user/delete/${id}`, { body: {} })
    return response.userId as number
  }

  static async deviceLogout(userId: number, clientId: string) {
    const response = await FetchApi.post(`/user/device-logout/${userId}`, { body: { clientId } })
    return response
  }
}
