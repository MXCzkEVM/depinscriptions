/**
 * @title geoscriptions
 * @description geoscriptions api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface MarketRawDto {
  tick: string;
  price: string;
  volume: string;
  sales: string;
  holders: string;
  totalVolume: string;
  totalSales: string;
  marketCap: string;
  listed: string;
}
export interface RecoveryBodyDto {
  password: string;
  value: string;
}
export interface HexagonDto {
  hex: string;
  tik: string;
  mit: number;
}
export interface InscriptionDto {
  number: number;
  hash: string;
  op: string;
  tick: string;
  json: string;
  from: string;
  to: string;
  time: string;
}
export interface HolderDto {
  id: number;
  tick: string;
  number: number;
  owner: string;
  value: number;
}
export interface TickDto {
  number: number;
  tick: string;
  minted: number;
  total: number;
  holders: number;
  creator: string;
  limit: number;
  deployHash: string;
  deployTime: string;
  lastTime: string;
  completedTime: string;
  trxs: number;
}
export interface InscriptionPageResponseDto {
  total: number;
  data: InscriptionDto[];
}
export interface InscriptionResponseDto {
  hash: string;
  creator: string;
  owner: string;
  from: string;
  to: string;
  number: number;
  supply: number;
  time: string;
  json: string;
  tick: string;
  holders: number;
}
export interface SomeResponseDto {
  data: boolean;
}
export interface HexagonPageResponseDto {
  total: number;
  data: HexagonDto[];
}
export interface HolderPageResponseDto {
  total: number;
  data: HolderDto[];
}
export interface TickPageResponseDto {
  total: number;
  data: TickDto[];
}
export interface TickDeployedResponseDto {
  data: string[];
}
export interface MarketPageResponseDto {
  total: number;
  data: MarketRawDto[];
  price: string;
}
export interface MarketDetailDto {
  tick: string;
  holders: string;
  price: string;
  volume: string;
  sales: string;
  limit: string;
  limitPrice: string;
}
export interface GetInscriptionQuery {
  owner?: string;
  limit?: number;
  page: number;
}
export interface GetInscriptionHashPath {
  hash: string;
}
export interface GetInscriptionSomeHashPath {
  hash: string;
}
export interface GetHexagonQuery {
  tick: string;
  limit?: number;
  page: number;
}
export interface GetHolderQuery {
  tick?: string;
  owner?: string;
  order?: string;
  limit?: number;
  page: number;
}
export interface GetTokenQuery {
  limit?: number;
  type: number;
  keyword: string;
  page: number;
}
export interface GetTokenSomeIdPath {
  id: string;
}
export interface GetTokenIdPath {
  id: string;
}
export interface GetMarketQuery {
  limit?: number;
  page: number;
}
export interface GetMarketIdPath {
  id: string;
}
