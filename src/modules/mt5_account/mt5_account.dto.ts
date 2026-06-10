import { OmitClass, PickClass } from '@/utils/typescript.util'
import type { ConditionNumber, ConditionString } from '../_base/base-condition'

export class Mt5AccountGetQuery {
  page?: number
  limit?: number
  relation?: {}

  filter?: {
    accountLogin?: number | ConditionNumber
    accountName?: string | ConditionString
    accountServer?: string | ConditionString
  }

  sort?: {
    id?: 'ASC' | 'DESC'
  }

  static toQuery(instance: Partial<Mt5AccountGetQuery>) {
    return {
      page: instance?.page,
      limit: instance?.limit,
      relation: instance.relation ? JSON.stringify(instance.relation) : undefined,
      filter: instance.filter ? JSON.stringify(instance.filter) : undefined,
      sort: instance.sort ? JSON.stringify(instance.sort) : undefined,
    }
  }
}

export class Mt5AccountPaginationQuery extends Mt5AccountGetQuery {}
export class Mt5AccountListQuery extends OmitClass(Mt5AccountGetQuery, ['page']) {}
export class Mt5AccountGetOneQuery extends PickClass(Mt5AccountGetQuery, ['filter', 'relation']) {}
export class Mt5AccountDetailQuery extends PickClass(Mt5AccountGetQuery, ['relation']) {}
