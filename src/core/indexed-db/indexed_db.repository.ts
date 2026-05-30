import { BaseDexieRepository } from './dexie/_base_dexie.repository'
import { IndexedDBConnection, RefreshTime } from './indexed_db.connection'

export const RefreshTimeDB = new BaseDexieRepository<RefreshTime>(
  IndexedDBConnection,
  'RefreshTime',
)
