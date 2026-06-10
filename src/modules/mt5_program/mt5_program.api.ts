import { FetchApi } from '@/core/fetch_api'

export class MT5ProgramApi {
  static async refreshAll() {
    const response = await FetchApi.post(`/mt5_program/refresh_all`)
    return response
  }

  static async openAll() {
    const response = await FetchApi.post(`/mt5_program/open_all`)
    return response
  }

  static async closeAll() {
    const response = await FetchApi.post(`/mt5_program/close_all`)
    return response
  }

  static async refresh(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/refresh/${params.program_name}`)
    return response
  }

  static async open(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/open/${params.program_name}`)
    return response
  }

  static async close(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/close/${params.program_name}`)
    return response
  }
  
  static async copyEnabled(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/copy_enabled/${params.program_name}`)
    return response
  }

  static async copyDisabled(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/copy_disabled/${params.program_name}`)
    return response
  }

  static async setting(body: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/setting/`, { body })
    return response
  }

  static async clearLog(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/clear_log/${params.program_name}`)
    return response
  }

  static async clearError(params: { program_name: string }) {
    const response = await FetchApi.post(`/mt5_program/clear_error/${params.program_name}`)
    return response
  }
}
