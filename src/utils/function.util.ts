export class ESFunction {
  static sleep = async (time: number) => {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(time)
      }, time),
    )
  }

  static runTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${timeout}ms`)), timeout),
    )
    return Promise.race([promise, timeoutPromise])
  }

  static debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout> | null

    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout)

      timeout = setTimeout(() => {
        func(...args)
        timeout = null
      }, delay)
    }
  }

  static throttle = (func: (...args: any[]) => void, delay: number) => {
    let lastCall = 0

    return function (...args: any[]) {
      const now = new Date().getTime()

      if (now - lastCall >= delay) {
        lastCall = now
        return func(...args)
      }
    }
  }

  static debounceAsync = <T>(func: (...args: any[]) => Promise<T>, delay: number) => {
    let state = 0

    return async (...args: any[]): Promise<T | null> => {
      state++
      const current = state
      await ESFunction.sleep(delay)
      if (current !== state) return null // Hiểu đơn giản là sau khi ngủ dậy thì thấy thằng khác cướp mất state rồi
      return await func(...args)
    }
  }

  static throttleAsync = (func: (...args: any[]) => Promise<any>, delay: number) => {
    let state = 0

    return async (...args: any[]): Promise<any> => {
      if (state !== 0) return null // Hiểu đơn giản là state đang bị thằng khác xử lý rồi
      state++
      const result = await func(...args)
      ESFunction.sleep(delay)
        .then((e) => (state = 0))
        .catch((e) => (state = 0)) // Xử lý xong mới nhả state ra
      return result
    }
  }

  static singleFlight<T>(func: () => Promise<T>) {
    let promise: Promise<T> | null = null

    return async (options?: { refresh: boolean }) => {
      if (!promise || options?.refresh) {
        promise = func()
      }

      try {
        const result = await promise
        return result
      } finally {
        promise = null
      }
    }
  }
}
