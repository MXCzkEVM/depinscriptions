export function fetchResponseIntercept(callback: (response: Response) => Response | Promise<Response>) {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    let [resource, config ] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    // response interceptor here
    return callback(response);
  };
}