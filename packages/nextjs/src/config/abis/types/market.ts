import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import {
  EventData,
  EventResponse,
  PromiEvent,
  TransactionReceipt,
  Web3ContractContext,
} from 'ethereum-abi-types-generator'

export interface CallOptions {
  from?: string
  gasPrice?: string
  gas?: number
}

export interface SendOptions {
  from: string
  value?: number | string | BN | BigNumber
  gasPrice?: string
  gas?: number
}

export interface EstimateGasOptions {
  from?: string
  value?: number | string | BN | BigNumber
  gas?: number
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>
  estimateGas(options: EstimateGasOptions): Promise<number>
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>
  encodeABI(): string
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>
  call(options: CallOptions): Promise<TCallReturn>
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>
  encodeABI(): string
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  Market,
  MarketMethodNames,
  MarketEventsContext,
  MarketEvents
>
export type MarketEvents =
  | 'Initialized'
  | 'OwnershipTransferred'
  | 'Upgraded'
  | 'inscription_msc20_transfer'
export interface MarketEventsContext {
  Initialized(
    parameters: {
      filter?: {}
      fromBlock?: number
      toBlock?: 'latest' | number
      topics?: string[]
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse
  OwnershipTransferred(
    parameters: {
      filter?: {
        previousOwner?: string | string[]
        newOwner?: string | string[]
      }
      fromBlock?: number
      toBlock?: 'latest' | number
      topics?: string[]
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse
  Upgraded(
    parameters: {
      filter?: { implementation?: string | string[] }
      fromBlock?: number
      toBlock?: 'latest' | number
      topics?: string[]
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse
  inscription_msc20_transfer(
    parameters: {
      filter?: {
        filter?: string | string[]
        from?: string | string[]
        to?: string | string[]
      }
      fromBlock?: number
      toBlock?: 'latest' | number
      topics?: string[]
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse
}
export type MarketMethodNames =
  | 'new'
  | 'UPGRADE_INTERFACE_VERSION'
  | 'fee'
  | 'initialize'
  | 'owner'
  | 'proxiableUUID'
  | 'purchase'
  | 'purchases'
  | 'renounceOwnership'
  | 'transferOwnership'
  | 'upgradeToAndCall'
  | 'verify'
  | 'withdraw'
export interface InitializedEventEmittedResponse {
  version: string
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface UpgradedEventEmittedResponse {
  implementation: string
}
export interface Inscription_msc20_transferEventEmittedResponse {
  filter: string
  id: string
  from: string
  to: string
  value: string
}
export interface OrderRequest {
  id: string
  maker: string
  amount: string
  price: string
  tick: string
}
export interface OrdersRequest {
  id: string
  maker: string
  amount: string
  price: string
  tick: string
}
export interface Market {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(): MethodReturnContext
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  UPGRADE_INTERFACE_VERSION(): MethodConstantReturnContext<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param price Type: uint256, Indexed: false
   */
  fee(price: string): MethodConstantReturnContext<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param initialOwner Type: address, Indexed: false
   * @param initialFeeBps Type: uint96, Indexed: false
   */
  initialize(initialOwner: string, initialFeeBps: string): MethodReturnContext
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  proxiableUUID(): MethodConstantReturnContext<string>
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param order Type: tuple, Indexed: false
   */
  purchase(order: OrderRequest): MethodPayableReturnContext
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param orders Type: tuple[], Indexed: false
   */
  purchases(orders: OrdersRequest[]): MethodPayableReturnContext
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string): MethodReturnContext
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param newImplementation Type: address, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  upgradeToAndCall(
    newImplementation: string,
    data: string | number[]
  ): MethodPayableReturnContext
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param msgHash Type: bytes32, Indexed: false
   * @param signature Type: bytes, Indexed: false
   */
  verify(
    msgHash: string | number[],
    signature: string | number[]
  ): MethodConstantReturnContext<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  withdraw(): MethodReturnContext
}
