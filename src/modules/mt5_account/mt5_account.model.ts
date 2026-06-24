import { BaseModel } from '../_base/base.model'
import { Role } from '../role/role.model'

export enum Mt5AccountRole {
  Normal = 0,
  Master = 1,
  Follower = 2,
}

export enum Mt5AccountType {
  Unknown = 0,
  Demo = 1,
  ExnessCent = 2,
  ExnessStandard = 3,
  ExnessPro = 4,
  ExnessRaw = 5,
  ExnessZero = 6,
}

export class Mt5Account extends BaseModel {
  id: number
  accountRole: Mt5AccountRole
  accountType: Mt5AccountType
  accountLogin: number
  accountName: string
  accountServer: string
  accountPassword: string

  symbolSuffix: string
  timeCorrectionSeconds: number
  programName: string

  isOpening: boolean
  isCopying: boolean

  copyMultiplier: number
  copyMasterLogin: number
  description: string

  static init(s?: Mt5Account): Mt5Account {
    const ins = new Mt5Account()
    ins._localId = String(s?.id || Math.random().toString(36).substring(2))
    ins.id = s?.id || 0
    ins.accountRole = s?.accountRole || Mt5AccountRole.Normal
    ins.accountType = s?.accountType || Mt5AccountType.Unknown
    ins.accountName = s?.accountName || ''
    ins.accountServer = s?.accountServer || ''
    ins.accountLogin = s?.accountLogin || 0
    ins.accountPassword = s?.accountPassword || ''

    ins.symbolSuffix = s?.symbolSuffix || ''
    ins.timeCorrectionSeconds = s?.timeCorrectionSeconds || 0
    ins.programName = s?.programName || ''

    ins.isOpening = s?.isOpening || false
    ins.isCopying = s?.isCopying || false

    ins.copyMultiplier = s?.copyMultiplier || 1
    ins.copyMasterLogin = s?.copyMasterLogin || 0
    ins.description = s?.description || ''
    return ins
  }

  static blank(): Mt5Account {
    const ins = Mt5Account.init()
    return ins
  }

  static basic(source: Mt5Account) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: Mt5Account = Object.assign(new Mt5Account(), cleaned)
    return target
  }

  static basicList(sources: Mt5Account[]): Mt5Account[] {
    return sources.map((i) => Mt5Account.basic(i))
  }

  static from(source: Mt5Account) {
    const target = Mt5Account.basic(source)
    return target
  }

  static fromList(sourceList: Mt5Account[]) {
    return sourceList.map((i) => Mt5Account.from(i))
  }

  static equal(a: Mt5Account, b: Mt5Account) {
    if (a.id != b.id) return false
    if (a.accountRole != b.accountRole) return false
    if (a.accountType != b.accountType) return false
    if (a.accountName != b.accountName) return false
    if (a.accountServer != b.accountServer) return false
    if (a.accountLogin != b.accountLogin) return false
    if (a.accountPassword != b.accountPassword) return false

    if (a.symbolSuffix != b.symbolSuffix) return false
    if (a.timeCorrectionSeconds != b.timeCorrectionSeconds) return false
    if (a.programName != b.programName) return false

    if (a.isOpening != b.isOpening) return false
    if (a.isCopying != b.isCopying) return false

    if (a.copyMultiplier != b.copyMultiplier) return false
    if (a.copyMasterLogin != b.copyMasterLogin) return false
    if (a.description != b.description) return false
    return true
  }
}
