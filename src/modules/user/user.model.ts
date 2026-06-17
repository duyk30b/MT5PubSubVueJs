import { BaseModel } from '../_base/base.model'
import { Role } from '../role/role.model'
import { UserRole } from '../user-role/user-role.model'
import Device from './device.model'

export enum UserType {
  Root = 0,
  Admin = 1,
  User = 2,
}

export class User extends BaseModel {
  id: number
  username: string
  password: string
  secret: string

  fullName: string
  phone: string
  birthday?: number
  gender?: number

  imageIds: string
  userType: UserType
  isActive: 1 | 0 // Trạng thái

  updatedAt?: number
  deletedAt?: number

  userRoleList?: UserRole[]
  devices?: Device[]

  static init(s?: User): User {
    const ins = new User()
    ins._localId = String(s?.id || Math.random().toString(36).substring(2))
    ins.id = s?.id || 0
    ins.username = s?.username || ''
    ins.password = s?.password || ''
    ins.secret = s?.secret || ''

    ins.fullName = s?.fullName || ''
    ins.phone = s?.phone || ''
    ins.birthday = s?.birthday
    ins.gender = s?.gender

    ins.imageIds = s?.imageIds || ''
    ins.userType = s?.userType || UserType.User
    ins.isActive = s?.isActive || 1

    ins.updatedAt = s?.updatedAt
    ins.deletedAt = s?.deletedAt

    ins.userRoleList = s?.userRoleList || []
    ins.devices = s?.devices || []

    return ins
  }

  static blank(): User {
    const ins = User.init()
    return ins
  }

  static basic(source: User) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: User = Object.assign(new User(), cleaned)
    return target
  }

  static basicList(sources: User[]): User[] {
    return sources.map((i) => User.basic(i))
  }

  static from(source: User) {
    const target = User.basic(source)
    if (source.userRoleList) {
      target.userRoleList = UserRole.basicList(source.userRoleList)
      target.userRoleList.forEach((userRole) => {
        userRole.role = userRole.role ? Role.basic(userRole.role) : userRole.role
        // userRole.user = userRole.user ? User.basic(userRole.user) : userRole.user
      })
    }
    if (source.devices) {
      target.devices = Device.basicList(source.devices)
    }
    return target
  }

  static fromList(sourceList: User[]) {
    return sourceList.map((i) => User.from(i))
  }

  static equal(a: User, b: User) {
    if (a.id != b.id) return false
    if (a.username != b.username) return false
    // if (a.password != b.password) return false

    if (a.fullName != b.fullName) return false
    if (a.phone != b.phone) return false

    if (a.birthday != b.birthday) return false
    if (a.gender != b.gender) return false
    if (a.imageIds != b.imageIds) return false
    if (a.userType != b.userType) return false
    if (a.isActive != b.isActive) return false
    return true
  }
}
