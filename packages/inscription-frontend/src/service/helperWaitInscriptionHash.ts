/* eslint-disable ts/no-use-before-define */
/* eslint-disable no-async-promise-executor */
import { getInscriptionHashSome } from '@/api'

export function helperWaitInscriptionHash(hash: string) {
  return new Promise<void>(async (resolve, reject) => {
    let count = 0
    async function load() {
      const { data } = await getInscriptionHashSome({ hash })
      if (data) {
        clearInterval(timer)
        resolve()
      }
    }
    async function run() {
      if (count === 4) {
        clearInterval(timer)
        reject(new Error('timeout'))
      }
      else {
        await load()
        count++
      }
    }
    const timer = setInterval(run, 3000)
    run()
  })
}
