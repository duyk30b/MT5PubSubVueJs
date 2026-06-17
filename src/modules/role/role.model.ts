import { BaseModel } from '../_base/base.model'
import { User } from '../user'
import { UserRole } from '../user-role/user-role.model'

export class Role extends BaseModel {
  id: number
  roleCode: string
  name: string
  permissionIds: string
  isActive: 0 | 1
  updatedAt: number

  userRoleList?: UserRole[]

  static init(s?: Role): Role {
    const ins = new Role()
    ins._localId = String(s?._localId || Math.random().toString(36).substring(2))
    ins.id = s?.id || 0
    ins.roleCode = s?.roleCode || ''
    ins.name = s?.name || ''
    ins.permissionIds = s?.permissionIds || JSON.stringify([])
    ins.isActive = s?.isActive || 1
    ins.updatedAt = s?.updatedAt || Date.now()
    ins.userRoleList = s?.userRoleList || []
    return ins
  }

  static blank(): Role {
    const ins = Role.init()
    return ins
  }

  static basic(source: Role) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: Role = Object.assign(new Role(), cleaned)
    return target
  }

  static basicList(sources: Role[]): Role[] {
    return sources.map((i) => Role.basic(i))
  }

  static from(source: Role) {
    const target = Role.basic(source)
    if (target.userRoleList) {
      target.userRoleList = UserRole.basicList(target.userRoleList)
      target.userRoleList.forEach((userRole) => {
        userRole.role = userRole.role ? Role.basic(userRole.role) : userRole.role
        userRole.user = userRole.user ? User.basic(userRole.user) : userRole.user
      })
    }
    return target
  }

  static fromList(sourceList: Role[]): Role[] {
    return sourceList.map((i) => Role.from(i))
  }
}
