import { CONFIG } from '../config'
import { LocalStorageCore } from '../core/local_storage/local_storage_core'
import { SocketBase } from '../core/socket/socket.base'
import { setupFetchApi } from './setup_fetchapi'

const setupContainer = () => {
  setupFetchApi()
  // ========== SocketBase Setup ==========
  SocketBase.init({
    baseURL: CONFIG.API_BASE_URL,
    token: LocalStorageCore.getAccessToken(),
    mode: CONFIG.MODE,
  })
  SocketBase.connect()
}

export { setupContainer }
