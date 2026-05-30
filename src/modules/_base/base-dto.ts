export type FullResponse<T = any> = {
  meta: { time: string; uid: number; clientId: string }
  data: T
  message: string
  args?: Record<string, any>
}
