export class FetchAPIBase {
  private timeout?: number
  private baseURL: string
  private headers: Record<string, string>

  private interceptors: {
    request: ((requestInit: RequestInit) => Promise<any>)[]
    response: ((requestInit: RequestInit, response: Response) => Promise<any>)[]
    responseError: ((error: any) => Promise<any>)[]
  } = { request: [], response: [], responseError: [] }

  init(input: { baseURL: string; timeout?: number }) {
    this.baseURL = input.baseURL
    this.timeout = input.timeout
    this.headers = { 'Content-Type': 'application/json' }
  }

  setHeader(headers: Record<string, string>) {
    this.headers = headers
  }

  addRequestInterceptor(interceptor: (requestInit: RequestInit) => Promise<any>) {
    this.interceptors.request.push(interceptor)
  }

  addResponseInterceptor(
    interceptor: (requestInit: RequestInit, response: Response) => Promise<any>,
  ) {
    this.interceptors.response.push(interceptor)
  }

  addErrorInterceptor(interceptor: (error: any) => Promise<any>) {
    this.interceptors.responseError.push(interceptor)
  }

  async request(input: {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: Record<string, any>
    query?: Record<string, any>
    cache?: RequestCache
  }): Promise<any> {
    try {
      const fullURL = new URL(input.url, this.baseURL)
      if (input.query) {
        const queryCleaned = Object.fromEntries(
          Object.entries(input.query ?? {}).filter(([, v]) => v !== undefined),
        )
        fullURL.search = new URLSearchParams(queryCleaned).toString()
      }

      let requestInit: RequestInit = {
        method: input.method,
        headers: this.headers,
        cache: input.cache,
        signal: this.timeout ? AbortSignal.timeout(this.timeout) : undefined,
        body: input.body ? JSON.stringify(input.body) : undefined,
      }

      for (const interceptor of this.interceptors.request) {
        requestInit = await interceptor(requestInit)
      }

      let response: Response = await fetch(fullURL.toString(), requestInit)

      for (const interceptor of this.interceptors.response) {
        response = await interceptor(requestInit, response)
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseJSON = await response.json()
      return responseJSON
    } catch (error: any) {
      for (const interceptor of this.interceptors.responseError) {
        await interceptor(error)
      }
      throw error
    }
  }

  async get(
    url: string,
    options?: { query?: Record<string, any>; cache?: RequestCache },
  ): Promise<any> {
    const response = await this.request({
      url,
      method: 'GET',
      query: options?.query,
      cache: options?.cache,
    })
    return response
  }

  async post(
    url: string,
    options?: { body?: Record<string, any>; query?: Record<string, any>; cache?: RequestCache },
  ): Promise<any> {
    const response = await this.request({
      url,
      method: 'POST',
      body: options?.body,
      query: options?.query,
      cache: options?.cache,
    })
    return response
  }

  async put(
    url: string,
    options?: { body?: Record<string, any>; query?: Record<string, any>; cache?: RequestCache },
  ): Promise<any> {
    const response = await this.request({
      url,
      method: 'PUT',
      body: options?.body,
      query: options?.query,
      cache: options?.cache,
    })
    return response
  }

  async patch(
    url: string,
    options?: { body?: Record<string, any>; query?: Record<string, any> },
  ): Promise<any> {
    const response = await this.request({
      url,
      method: 'PATCH',
      body: options?.body,
      query: options?.query,
    })
    return response
  }

  async delete(url: string, options?: { query?: Record<string, any> }): Promise<any> {
    const response = await this.request({
      url,
      method: 'DELETE',
      query: options?.query,
    })
    return response
  }
}
