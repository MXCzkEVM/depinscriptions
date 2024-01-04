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
 * @tags app-controller
 */
export async function getInscription(query: Types.GetInscriptionQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/inscription${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.InscriptionPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getInscriptionHash(paths: Types.GetInscriptionHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<Types.InscriptionResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getInscriptionSomeHash(paths: Types.GetInscriptionSomeHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription/some/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<Types.SomeResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getHexagon(query: Types.GetHexagonQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/hexagon${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.HexagonPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getHolder(query: Types.GetHolderQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/holder${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.HolderPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getToken(query: Types.GetTokenQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/token${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.TickPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getTokenDeployed(config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/deployed`, {
    ...config,
  });
  return response.json() as Promise<Types.TickDeployedResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getTokenSomeId(paths: Types.GetTokenSomeIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/some/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.SomeResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getTokenId(paths: Types.GetTokenIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/token/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.TickDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getMarket(query: Types.GetMarketQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/market${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.MarketPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getMarketId(paths: Types.GetMarketIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/market/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.MarketDetailDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getOrder(query: Types.GetOrderQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/order${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.OrderPageResponseDto>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getOrderListed(query: Types.GetOrderListedQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/order/listed${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.OrderPageResponseDto>;
}
/**
 * @method post
 * @tags app-controller
 */
export async function postRecoveryTick(config?: RequestInit) {
  const response = await fetch(`${baseURL}/recovery/tick`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
/**
 * @method post
 * @tags app-controller
 */
export async function postRecoveryInscription(config?: RequestInit) {
  const response = await fetch(`${baseURL}/recovery/inscription`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
