/**
 * @title geoscriptions
 * @description geoscriptions api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface Hexagon {
  hex: string;
  tik: string;
  mit: number;
}
export interface HexagonPageResponse {
  total: number;
  data: Hexagon[];
}
export interface Inscription {
  number: number;
  hash: string;
  op: string;
  tick: string;
  json: string;
  from: string;
  to: string;
  time: string;
}
export interface InscriptionPageResponse {
  total: number;
  data: Inscription[];
}
export interface InscriptionResponse {
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
export interface ExistResponse {
  data: boolean;
}
export interface MarketRaw {
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
export interface MarketPageResponse {
  total: number;
  data: MarketRaw[];
  price: string;
}
export interface MarketDetail {
  tick: string;
  price: string;
  volume: string;
  sales: string;
  holders: string;
  limit: string;
  limitPrice: string;
}
export interface Order {
  number: number;
  hash: string;
  tick: string;
  maker: string;
  amount: number;
  price: string;
  status: number;
  time: string;
  lastTime: string;
  expiration: string;
  buyer: string;
  json: string;
}
export interface OrderPageResponse {
  total: number;
  data: Order[];
}
export interface RecoveryBody {
  password: string;
  value: string;
}
export interface Token {
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
export interface TokenPageResponse {
  total: number;
  data: Token[];
}
export interface TokenDeployedResponse {
  data: string[];
}
export interface GetHexagonQuery {
  tick: string;
  limit?: number;
  page: number;
}
export interface GetInscriptionInscriptionQuery {
  owner?: string;
  op?: string[];
  limit?: number;
  page: number;
}
export interface GetInscriptionInscriptionHashPath {
  hash: string;
}
export interface GetInscriptionInscriptionSomeHashPath {
  hash: string;
}
export interface GetMarketQuery {
  limit?: number;
  page: number;
}
export interface GetMarketIdPath {
  id: string;
}
export interface GetOrderQuery {
  status?: string[];
  tick?: string;
  owner?: string;
  limit?: number;
  page: number;
}
export interface GetOrderRecordQuery {
  status?: string[];
  tick?: string;
  limit?: number;
  page: number;
}
export interface GetOrderListedQuery {
  tick?: string;
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
