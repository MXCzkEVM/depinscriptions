import { FetchRequest } from 'ethers'
import { httpsOverHttp } from 'tunnel'

export function registerEthersFetchProxy() {
  const fetchRequest = FetchRequest.createGetUrlFunc({
    agent: httpsOverHttp({
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    }),
  })

  FetchRequest.registerGetUrl(fetchRequest)
}
