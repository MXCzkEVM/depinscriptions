import { dirname, join } from 'node:path'
import { cwd } from 'node:process'
import { ensureDir, readFile, writeFile } from 'fs-extra'

const INDEXER_SCAN_LAST_BLOCK_FILEPATH = join(cwd(), 'cache', '.indexer')
const INDEXER_NEST_DEFAULT_LAST_BLOCK = Number(process.env.NEST_DEFAULT_LAST_BLOCK!)

export async function setIndexerLastBlock(blockNumber: number) {
  if (Number.isNaN(blockNumber) || typeof blockNumber !== 'number')
    throw new Error(`setIndexerLastBlock Error ${blockNumber}`)
  await ensureDir(dirname(INDEXER_SCAN_LAST_BLOCK_FILEPATH))
  await writeFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, blockNumber.toString(), {
    flag: 'w',
  })
}

export async function getIndexerLastBlock() {
  try {
    return Number(await readFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, 'utf-8'))
  }
  catch (error) {
    return INDEXER_NEST_DEFAULT_LAST_BLOCK
  }
}
