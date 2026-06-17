import { BaseModel } from '../_base/base.model'
import type { PermissionId } from './permission.enum'

export enum PermissionStatus {
  BLOCK = -1,
  NORMAL = 0,
  PUBLIC = 1,
}

export class Permission extends BaseModel {
  id: PermissionId
  level: number
  code: keyof typeof PermissionId
  name: string
  parentId: PermissionId | 0
  rootId: PermissionId
  pathId: string
  isActive: 0 | 1

  children: Permission[]

  static basic(source: Permission) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: Permission = Object.assign(new Permission(), cleaned)
    return target
  }

  static basicList(sources: Permission[]): Permission[] {
    return sources.map((i) => Permission.basic(i))
  }

  static from(source: Permission) {
    const target = Permission.basic(source)
    return target
  }

  static fromList(sourceList: Permission[]): Permission[] {
    return sourceList.map((i) => Permission.from(i))
  }
}
