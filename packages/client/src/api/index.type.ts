/**
 * @title
 * @description
 * @swagger 3.0.0
 * @version 1.0.0
 */

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
}
export interface HoldersResponseDto {
  data: HolderDto[];
}
export interface TickPageResponseDto {
  total: number;
  data: TickDto[];
}
export interface GetInscriptionHashPath {
  hash: string;
}
export interface GetHolderQuery {
  address: string;
}
