import fs from 'node:fs/promises'
import path = require('path')
import { cwd } from 'node:process'

const INDEXER_SCAN_LAST_BLOCK_FILEPATH = path.join(cwd(), 'cache', '.indexer')
const INDEXER_DEFAULT_LAST_BLOCK = 10246699

export async function setIndexerLastBlock(blockNumber: number) {
  if (Number.isNaN(blockNumber) || typeof blockNumber !== 'number')
    throw new Error('setIndexerLastBlock Error')
  await fs.writeFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, blockNumber.toString(), {
    flag: 'w',
  })
}

export async function getIndexerLastBlock() {
  try {
    return Number(fs.readFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, 'utf-8'))
  }
  catch (error) {
    return INDEXER_DEFAULT_LAST_BLOCK
  }
}
