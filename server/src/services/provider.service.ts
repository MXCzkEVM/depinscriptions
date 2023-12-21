import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockTag, JsonRpcProvider, Block, TransactionResponse } from 'ethers';
import { arange } from '@hairy/utils';

export interface BlockWithTransactions extends Omit<Block, 'transactions'> {
  transactions: Array<TransactionResponse>;
}
@Injectable()
export class jsonProviderService {
  private provider: JsonRpcProvider;
  constructor(private config: ConfigService) {
    this.provider = new JsonRpcProvider(config.get('CHAIN_JSON_PROVIDER_URL'));
  }

  async getLastBlockNumber() {
    return this.provider.getBlockNumber();
  }

  getBlockByArangeWithTransactions(start: number, end: number) {
    return Promise.all(
      arange(start, end).map((index) => this.getBlockWithTransactions(index)),
    );
  }

  async getBlockWithTransactions(
    block: BlockTag,
  ): Promise<BlockWithTransactions> {
    const response = await this.provider.getBlock(block, true);
    const transactions = await this.getTransactions([...response.transactions]);
    return { ...response, transactions } as BlockWithTransactions;
  }

  async getTransactions(transactions: string[]) {
    return Promise.all(
      transactions.map((hash) => this.provider.getTransaction(hash)),
    );
  }
  async getTransaction(hash: string) {
    return this.provider.getTransaction(hash);
  }
}
