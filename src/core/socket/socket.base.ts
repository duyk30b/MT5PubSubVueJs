import io, { Socket } from 'socket.io-client'
import { SocketService } from './socket.service'
import { SOCKET_EVENT } from './socket.variable'

export class SocketBase {
  static token: string = ''
  static baseURL: string = ''
  static socket: Socket
  static timeout: number = 10000
  static mode: 'development' | 'production' | 'test' = 'production'

  static init(options: {
    baseURL: string
    token: string
    timeout?: number
    mode?: 'development' | 'production' | 'test'
  }) {
    SocketBase.token = options.token
    SocketBase.baseURL = options.baseURL
    if (options.timeout) {
      SocketBase.timeout = options.timeout
    }
    if (options.mode) {
      SocketBase.mode = options.mode
    }
  }

  static connect() {
    SocketBase.socket = io(SocketBase.baseURL, {
      transports: ['websocket'],
      auth: { token: SocketBase.token },
      timeout: SocketBase.timeout,
    })

    SocketBase.socket.on('connect', () => {
      console.log('Socket Connected')
    })
    SocketBase.socket.on('disconnect', () => {
      console.log('Socket Disconnect')
    })

    SocketBase.socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message)
    })

    if (SocketBase.mode === 'development') {
      SocketBase.socket.onAny((event, ...args) => {
        // console.log(`Socket listen event: ${event}`, args)
      })
    }

    SocketBase.socket.on(SOCKET_EVENT.SERVER_EMIT_DEMO, (data) => {
      SocketService.listenServerEmitDemo(data)
    })

    SocketBase.socket.on(SOCKET_EVENT.MASTER_DATA_CHANGE, (data) => {
      SocketService.masterDataChange(data)
    })

    SocketBase.socket.on(SOCKET_EVENT.SOCKET_MT5_PROGRAM_DATA, (data) => {
      SocketService.listenMt5ProgramData(data)
    })
  }

  static disconnect() {
    if (SocketBase.socket) {
      SocketBase.socket.disconnect()
    }
  }

  static reconnect(options: { token: string }) {
    if (SocketBase.socket) {
      SocketBase.socket.disconnect()
    }
    SocketBase.token = options.token
    SocketBase.connect()
  }
}
