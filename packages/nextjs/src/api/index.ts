/**
 * @title geoscriptions
 * @description geoscriptions api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import * as Types from "./index.type";

export const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * @method get
 * @tags hexagon
 */
export async function getHexagon(query: Types.GetHexagonQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/hexagon${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.HexagonPageResponse>;
}
/**
 * @method get
 * @tags inscription
 */
export async function getInscriptionInscription(query: Types.GetInscriptionInscriptionQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/inscription/inscription${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.InscriptionPageResponse>;
}
/**
 * @method get
 * @tags inscription
 */
export async function getInscriptionInscriptionHash(paths: Types.GetInscriptionInscriptionHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription/inscription/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<Types.InscriptionResponse>;
}
/**
 * @method get
 * @tags inscription
 */
export async function getInscriptionInscriptionSomeHash(paths: Types.GetInscriptionInscriptionSomeHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription/inscription/some/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<Types.ExistResponse>;
}
/**
 * @method get
 * @tags market
 */
export async function getMarket(query: Types.GetMarketQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/market${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.MarketPageResponse>;
}
/**
 * @method get
 * @tags market
 */
export async function getMarketId(paths: Types.GetMarketIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/market/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.MarketDetail>;
}
/**
 * @method get
 * @tags order
 */
export async function getOrder(query: Types.GetOrderQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/order${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.OrderPageResponse>;
}
/**
 * @method get
 * @tags order
 */
export async function getOrderRecord(query: Types.GetOrderRecordQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/order/record${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.OrderPageResponse>;
}
/**
 * @method get
 * @tags order
 */
export async function getOrderListed(query: Types.GetOrderListedQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/order/listed${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.OrderPageResponse>;
}
/**
 * @method post
 * @tags recovery
 */
export async function postRecoveryTick(config?: RequestInit) {
  const response = await fetch(`${baseURL}/recovery/tick`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
/**
 * @method post
 * @tags recovery
 */
export async function postRecoveryInscription(config?: RequestInit) {
  const response = await fetch(`${baseURL}/recovery/inscription`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
/**
 * @method get
 * @tags token
 */
export async function getToken(query: Types.GetTokenQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/token${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.TokenPageResponse>;
}
/**
 * @method get
 * @tags token
 */
export async function getTokenDeployed(config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/deployed`, {
    ...config,
  });
  return response.json() as Promise<Types.TokenDeployedResponse>;
}
/**
 * @method get
 * @tags token
 */
export async function getTokenSomeId(paths: Types.GetTokenSomeIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/some/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.ExistResponse>;
}
/**
 * @method get
 * @tags token
 */
export async function getTokenId(paths: Types.GetTokenIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.Token>;
}
