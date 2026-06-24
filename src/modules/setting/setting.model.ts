import { BaseModel } from '../_base/base.model'

export enum SettingKey {
  MT5_CONTAINER_FOLDER_PATH = 'MT5_CONTAINER_FOLDER_PATH',
}

export const SettingKeyLabelMap: Record<SettingKey, string> = {
  [SettingKey.MT5_CONTAINER_FOLDER_PATH]: 'Thư mục chứa các folder cài đặt MT5',
}

export const SettingKeyExampleMap: Record<SettingKey, string> = {
  [SettingKey.MT5_CONTAINER_FOLDER_PATH]: 'C:\\Programs\\MetaTrader5',
}

export class Setting extends BaseModel {
  id: string
  key: SettingKey
  value: string

  static init(): Setting {
    const ins = new Setting()
    ins.id = ''
    ins.value = ''

    return ins
  }

  static blank(): Setting {
    const ins = Setting.init()
    return ins
  }

  static basic(source: Setting) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    cleaned._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    const target: Setting = Object.assign(new Setting(), cleaned)
    return target
  }

  static basicList(sources: Setting[]): Setting[] {
    return sources.map((i) => Setting.basic(i))
  }

  static from(source: Setting) {
    const target = Setting.basic(source)

    return target
  }

  static fromList(sourceList: Setting[]): Setting[] {
    return sourceList.map((i) => Setting.from(i))
  }

  static equal(a: Setting, b: Setting) {
    if (a.id != b.id) return false
    if (a.key != b.key) return false
    if (a.value != b.value) return false
    return true
  }
}
