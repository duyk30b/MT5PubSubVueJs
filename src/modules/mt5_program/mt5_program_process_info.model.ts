export class MT5ProgramProcessInfo {
  pid: number
  name: string
  exe: string
  cmdline: string[]
  status: string
  create_time: number
  cpu_percent: number
  memory_mb: number
  memory_percent: number
  is_running: boolean

  static basic(source: MT5ProgramProcessInfo) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramProcessInfo = Object.assign(new MT5ProgramProcessInfo(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramProcessInfo[]): MT5ProgramProcessInfo[] {
    return sources.map((i) => MT5ProgramProcessInfo.basic(i))
  }

  static from(source: MT5ProgramProcessInfo) {
    const target = MT5ProgramProcessInfo.basic(source)
    return target
  }

  static fromList(sourceList: MT5ProgramProcessInfo[]): MT5ProgramProcessInfo[] {
    return sourceList.map((i) => MT5ProgramProcessInfo.from(i))
  }
}
