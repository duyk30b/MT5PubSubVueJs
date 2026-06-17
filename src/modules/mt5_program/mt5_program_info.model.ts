import { Mt5Account } from '../mt5_account'
import { MT5ProgramData } from './mt5_program_data.model'

export class MT5ProgramInfo {
  program_name: string
  mt5_account: Mt5Account
  data: MT5ProgramData
  error_list: string[]
  log_list: string[]

  get isOpening() {
    return this.data?.exe_process?.is_running ?? false
  }

  static basic(source: MT5ProgramInfo) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramInfo = Object.assign(new MT5ProgramInfo(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramInfo[]): MT5ProgramInfo[] {
    return sources.map((i) => MT5ProgramInfo.basic(i))
  }

  static from(source: MT5ProgramInfo) {
    const target = MT5ProgramInfo.basic(source)
    if (source.data) {
      target.data = MT5ProgramData.basic(source.data)
    }
    if (source.mt5_account) {
      target.mt5_account = Mt5Account.basic(source.mt5_account)
    }
    if (source.error_list) {
      target.error_list = [...source.error_list]
    }
    if (source.log_list) {
      target.log_list = [...source.log_list]
    }
    return target
  }

  static fromList(sourceList: MT5ProgramInfo[]): MT5ProgramInfo[] {
    return sourceList.map((i) => MT5ProgramInfo.from(i))
  }
}
