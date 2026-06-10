import { FetchApi } from '@/core/fetch_api'
import { SettingGetQuery, type SettingGetListQuery } from './setting.dto'
import { Setting, SettingKey } from './setting.model'

export class SettingApi {
  static async list(options: SettingGetListQuery): Promise<Setting[]> {
    const query = SettingGetQuery.toQuery(options)

    const response = await FetchApi.get('/setting/list', { query })
    return Setting.fromList(response.settingList)
  }

  static async upsert(body: { key: SettingKey; value: any }) {
    const response = await FetchApi.post(`/setting/upsert`, {
      body: {
        key: body.key,
        value: body.value,
      },
    })
    return Setting.from(response.setting)
  }
}
