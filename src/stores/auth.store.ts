import { AlertStore } from '@/common/vue-alert'
import { IndexedDBConnection } from '@/core/indexed-db/indexed_db.connection'
import { LocalStorageCore } from '@/core/local_storage/local_storage_core'
import { AuthApi } from '@/modules/auth/auth.api'
import { MeApi } from '@/modules/auth/me.api'
import { User } from '@/modules/user'
import { ESFunction } from '@/utils'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): { user: User } => {
    return {
      user: User.blank(),
    }
  },
  getters: {
    isAuthenticated: (state) => Boolean(state.user.id),
  },
  actions: {
    async initMeData() {
      try {
        if (
          !LocalStorageCore.getRefreshToken() ||
          LocalStorageCore.getRefreshExp() - 60 * 1000 < Date.now()
        ) {
          await this.removeAuth()
        } else {
          const meData = await MeApi.data()
          this.user = meData.user
        }
      } catch (error) {
        await this.removeAuth()
      }
    },
    async removeAuth() {
      LocalStorageCore.removeToken()
      this.user = User.blank()
      await IndexedDBConnection.clear()
    },
    logout: ESFunction.singleFlight(async () => {
      try {
        const refreshToken = LocalStorageCore.getRefreshToken()
        if (refreshToken) {
          await AuthApi.logout(refreshToken)
        }
      } catch (error: any) {
        AlertStore.addError(error.message || 'Logout failed')
      }
    }),
  },
})
