import type { Mt5Account } from '../mt5_account'
import { MT5ProgramInformation } from './mt5_program_information.model'

export class MT5ProgramData {
  program_name: string
  account_setting: {
    program_name: string
    mt5_account: Mt5Account
  }
  information: MT5ProgramInformation
  error_list: string[]
  log_list: string[]

  get isOpening() {
    return this.information?.exe_process?.is_running ?? false
  }

  static basic(source: MT5ProgramData) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramData = Object.assign(new MT5ProgramData(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramData[]): MT5ProgramData[] {
    return sources.map((i) => MT5ProgramData.basic(i))
  }

  static from(source: MT5ProgramData) {
    const target = MT5ProgramData.basic(source)
    if (source.information) {
      target.information = MT5ProgramInformation.basic(source.information)
    }
    if (source.error_list) {
      target.error_list = [...source.error_list]
    }
    if (source.log_list) {
      target.log_list = [...source.log_list]
    }
    return target
  }

  static fromList(sourceList: MT5ProgramData[]): MT5ProgramData[] {
    return sourceList.map((i) => MT5ProgramData.from(i))
  }
}
