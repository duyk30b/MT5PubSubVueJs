import { FetchApi } from '@/core/fetch_api'
import { Mt5AccountGetOneQuery, Mt5AccountGetQuery } from './mt5_account.dto'
import { Mt5Account } from './mt5_account.model'

export class Mt5AccountApi {
  static async list(): Promise<Mt5Account[]> {
    const response = await FetchApi.get('/mt5_account/list')
    return Mt5Account.fromList(response.mt5AccountList)
  }

  static async getOne(options: Mt5AccountGetOneQuery): Promise<Mt5Account> {
    const query = Mt5AccountGetQuery.toQuery(options || {})

    const response = await FetchApi.get(`/mt5_account/get_one`, { query })
    return Mt5Account.from(response.mt5Account || Mt5Account.blank())
  }

  static async createOne(body: { mt5Account: Mt5Account; programName: string }) {
    const { mt5Account, programName } = body
    const response = await FetchApi.post('/mt5_account/create', {
      body: {
        mt5Account: {
          accountType: mt5Account.accountType,
          accountLogin: mt5Account.accountLogin,
          accountName: mt5Account.accountName,
          accountServer: mt5Account.accountServer,
          accountPassword: mt5Account.accountPassword,
          description: mt5Account.description,
          copyMasterLogin: mt5Account.copyMasterLogin,
          copyMultiplier: mt5Account.copyMultiplier,
        },
        programName: programName,
      },
    })
    return Mt5Account.from(response.mt5Account)
  }

  static async updateOne(body: { id: number; mt5Account: Mt5Account; programName: string }) {
    const { id, mt5Account, programName } = body
    const response = await FetchApi.post(`/mt5_account/update/${id}`, {
      body: {
        mt5Account: {
          accountType: mt5Account.accountType,
          description: mt5Account.description,
          copyMasterLogin: mt5Account.copyMasterLogin,
          copyMultiplier: mt5Account.copyMultiplier,
        },
        programName: programName,
      },
    })
    return Mt5Account.from(response.mt5Account)
  }
}
