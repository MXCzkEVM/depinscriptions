export type FetchResponseInterceptFn = (response: Response) => Response | Promise<Response>

export function fetchResponseIntercept(callback: FetchResponseInterceptFn) {
  const { fetch: originalFetch } = window
  window.fetch = async (...args) => {
    const [resource, config] = args
    // request interceptor here
    const response = await originalFetch(resource, config)
    // response interceptor here
    return callback(response)
  }
}
