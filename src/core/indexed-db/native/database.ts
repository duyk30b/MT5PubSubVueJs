import { BaseIndexedDB } from './_base.indexed_db'

export const MeaDatabase = new BaseIndexedDB({
  databaseName: 'MeaDatabase',
  version: 1,
  collections: [{ storeName: 'RefreshTime', keyPath: 'code' }],
})
