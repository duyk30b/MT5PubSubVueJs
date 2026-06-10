export class MT5ProgramPositionInfo {
  ticket: number
  time: number
  time_msc: number
  time_update: number
  time_update_msc: number
  type: number
  magic: number
  identifier: number
  reason: number
  volume: number
  price_open: number
  sl: number
  tp: number
  price_current: number
  swap: number
  profit: number
  symbol: string
  comment: string
  external_id: string

  static basic(source: MT5ProgramPositionInfo) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramPositionInfo = Object.assign(new MT5ProgramPositionInfo(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramPositionInfo[]): MT5ProgramPositionInfo[] {
    return sources.map((i) => MT5ProgramPositionInfo.basic(i))
  }

  static from(source: MT5ProgramPositionInfo) {
    const target = MT5ProgramPositionInfo.basic(source)
    return target
  }

  static fromList(sourceList: MT5ProgramPositionInfo[]): MT5ProgramPositionInfo[] {
    return sourceList.map((i) => MT5ProgramPositionInfo.from(i))
  }
}
