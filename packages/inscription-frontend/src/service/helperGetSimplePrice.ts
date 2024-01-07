export interface GetSimplePriceQuery {
  ids: string
  vs: string
}

export interface GetSimplePriceResponse {
  [key: string]: Record<string, string>
}

export async function helperGetSimplePrice(paths: GetSimplePriceQuery, config?: RequestInit) {
  const baseURL = `https://api.coingecko.com/api/v3`
  const entries = Object.entries({
    vs_currencies: paths.vs,
    ids: paths.ids,
  })
  const _query_ = `?${new URLSearchParams(entries).toString()}`

  try {
    const response = await fetch(`${baseURL}/simple/price${_query_}`, {
      ...config,
    })
    return response.json() as Promise<GetSimplePriceResponse>
  }
  catch (error) {
    return { mxc: { usd: '0.00978101' } }
  }
}
