export class MT5ProgramAccountInfo {
  login: number
  trade_mode: number
  leverage: number
  limit_orders: number
  margin_so_mode: number
  trade_allowed: boolean
  trade_expert: boolean
  margin_mode: number
  currency_digits: number
  fifo_close: boolean
  balance: number
  credit: number
  profit: number
  equity: number
  margin: number
  margin_free: number
  margin_level: number
  margin_so_call: number
  margin_so_so: number
  margin_initial: number
  margin_maintenance: number
  assets: number
  liabilities: number
  commission_blocked: number
  name: string
  server: string
  currency: string
  company: string

  static basic(source: MT5ProgramAccountInfo) {
    const cleaned = Object.fromEntries(
      Object.entries(source ?? {}).filter(([, v]) => v !== undefined),
    )
    const target: MT5ProgramAccountInfo = Object.assign(new MT5ProgramAccountInfo(), cleaned)
    return target
  }

  static basicList(sources: MT5ProgramAccountInfo[]): MT5ProgramAccountInfo[] {
    return sources.map((i) => MT5ProgramAccountInfo.basic(i))
  }

  static from(source: MT5ProgramAccountInfo) {
    const target = MT5ProgramAccountInfo.basic(source)
    return target
  }

  static fromList(sourceList: MT5ProgramAccountInfo[]): MT5ProgramAccountInfo[] {
    return sourceList.map((i) => MT5ProgramAccountInfo.from(i))
  }
}
