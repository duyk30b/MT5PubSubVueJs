export class FetchAPIBase {
  private timeout?: number
  private baseURL: string
  private headers: Headers

  private interceptors: {
    request: ((requestInit: RequestInit) => Promise<any>)[]
    response: ((requestInit: RequestInit, response: Response) => Promise<any>)[]
    responseError: ((error: any) => Promise<any>)[]
  } = { request: [], response: [], responseError: [] }

  constructor(input: { baseURL: string; timeout?: number }) {
    this.baseURL = input.baseURL
    this.timeout = input.timeout
    this.headers = new Headers()
    this.headers.set('Content-Type', 'application/json')
  }

  setHeader(header: Headers) {
    this.headers = header
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
    params?: Record<string, any>
    cache?: RequestCache
  }): Promise<any> {
    try {
      const fullURL = new URL(input.url, this.baseURL)
      if (input.params) {
        fullURL.search = new URLSearchParams(input.params).toString()
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

  async get(url: string, params?: Record<string, any>): Promise<any> {
    const response = await this.request({ url, method: 'GET', params })
    return response
  }

  async post(url: string, body?: Record<string, any>): Promise<any> {
    const response = await this.request({ url, method: 'POST', body })
    return response
  }

  async put(url: string, body?: Record<string, any>): Promise<any> {
    const response = await this.request({ url, method: 'PUT', body })
    return response
  }

  async patch(url: string, body?: Record<string, any>): Promise<any> {
    const response = await this.request({ url, method: 'PATCH', body })
    return response
  }

  async delete(url: string, params?: Record<string, any>): Promise<any> {
    const response = await this.request({ url, method: 'DELETE', params })
    return response
  }
}
