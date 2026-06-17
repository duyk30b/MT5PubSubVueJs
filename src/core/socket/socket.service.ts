import { MT5ProgramInfo } from '@/modules/mt5_program/mt5_program_info.model'
import { useMt5ProgramStore } from '@/stores/mt5_program.store'

export class SocketService {
  static listenServerEmitDemo(data: any) {
    console.log('🚀 ~ file: socket.service.ts:3 ~ listenServerEmitDemo ~ data:', data)
  }

  static async masterDataChange(data: { laboratory: boolean; laboratoryGroup: boolean }) {}

  static async listenMt5ProgramInfo(data: { event_time: string; mt5_program_info_list: any[] }) {
    const mt5ProgramStore = useMt5ProgramStore()
    mt5ProgramStore.event_time = data.event_time
    mt5ProgramStore.mt5ProgramInfoList = MT5ProgramInfo.fromList(data.mt5_program_info_list)
  }
}
