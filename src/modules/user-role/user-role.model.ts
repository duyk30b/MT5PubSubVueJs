import { BaseModel } from '../_base/base.model'
import { Role } from '../role/role.model'
import { User } from '../user/user.model'

export class UserRole extends BaseModel {
  id: number | null

  userId: number
  roleId: number

  role?: Role
  user?: User

  static init(s?: UserRole): UserRole {
    const ins = new UserRole()
    ins._localId = String(s?.id || Math.random().toString(36).substring(2))

    ins.id = s?.id || 0
    ins.userId = s?.userId || 0
    ins.roleId = s?.roleId || 0

    ins.role = s?.role
    ins.user = s?.user
    return ins
  }

  static blank(): UserRole {
    const ins = UserRole.init()
    return ins
  }

  static basic(source: UserRole) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: UserRole = Object.assign(new UserRole(), cleaned)
    return target
  }

  static basicList(sources: UserRole[]): UserRole[] {
    return sources.map((i) => UserRole.basic(i))
  }

  static from(source: UserRole) {
    const target = UserRole.basic(source)
    if (source.user) {
      target.user = User.basic(source.user)
    }
    if (source.role) {
      target.role = Role.basic(source.role)
    }
    return target
  }

  static fromList(sourceList: UserRole[]) {
    return sourceList.map((i) => UserRole.from(i))
  }
}
