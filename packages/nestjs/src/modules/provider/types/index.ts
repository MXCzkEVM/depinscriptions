import { Block, TransactionResponse } from 'ethers'

export interface BlockWithTransactions extends Omit<Block, 'transactions'> {
  transactions: Array<TransactionResponse>
}
