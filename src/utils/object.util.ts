export class ESObject {
  static getNestedValue(obj: Record<string, any>, keyPath: string): any {
    return keyPath.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object') {
        return acc[key]
      }
      return undefined
    }, obj)
  }
}
