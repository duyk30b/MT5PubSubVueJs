import { MT5ProgramAccountInfo } from './mt5_program_account_info.model'
import { MT5ProgramPositionInfo } from './mt5_program_position_info.model'
import { MT5ProgramProcessInfo } from './mt5_program_process_info.model'

export class MT5ProgramInformation {
  refresh_time: string
  path: string
  copy_enabled: boolean
  exe_process: MT5ProgramProcessInfo
  py_process: MT5ProgramProcessInfo
  account_info: MT5ProgramAccountInfo
  position_list: MT5ProgramPositionInfo[]

  static basic(source: MT5ProgramInformation) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramInformation = Object.assign(new MT5ProgramInformation(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramInformation[]): MT5ProgramInformation[] {
    return sources.map((i) => MT5ProgramInformation.basic(i))
  }

  static from(source: MT5ProgramInformation) {
    const target = MT5ProgramInformation.basic(source)
    if (source.exe_process) {
      target.exe_process = MT5ProgramProcessInfo.basic(source.exe_process)
    }
    if (source.py_process) {
      target.py_process = MT5ProgramProcessInfo.basic(source.py_process)
    }
    if (source.account_info) {
      target.account_info = MT5ProgramAccountInfo.basic(source.account_info)
    }
    if (source.position_list) {
      target.position_list = MT5ProgramPositionInfo.basicList(source.position_list)
    }
    return target
  }

  static fromList(sourceList: MT5ProgramInformation[]): MT5ProgramInformation[] {
    return sourceList.map((i) => MT5ProgramInformation.from(i))
  }
}
