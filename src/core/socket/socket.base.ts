import io, { Socket } from 'socket.io-client'
import { CONFIG } from '../../config'
import { SocketService } from './socket.service'
import { SOCKET_EVENT } from './socket.variable'
import { LOCAL_STORAGE_KEYS } from '../local_storage/local_storage_keys'

export class SocketBase {
  static socket: Socket

  static connect() {
    SocketBase.socket = io(CONFIG.API_BASE_URL, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN) },
      timeout: 10000,
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

    if (CONFIG.MODE === 'development') {
      SocketBase.socket.onAny((event, ...args) => {
        console.log(`Socket listen event: ${event}`, args)
      })
    }

    SocketBase.socket.on(SOCKET_EVENT.SERVER_EMIT_DEMO, (data) => {
      SocketService.listenServerEmitDemo(data)
    })
  }

  static disconnect() {
    if (SocketBase.socket) {
      SocketBase.socket.disconnect()
    }
  }

  static reconnect() {
    if (SocketBase.socket) {
      SocketBase.socket.disconnect()
      SocketBase.socket.auth = { token: localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN) }
      SocketBase.connect()
    }
  }
}
