import * as path from 'node:path'
import * as fs from 'fs-extra'

const marketFragment = fs.readJSONSync(path.join(__dirname, './jsonc/market.json'))

export {
  marketFragment,
}
