/**
 * @title geoscriptions
 * @description geoscriptions api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import * as Types from "./index.type";

export const baseURL = "http://localhost:4000";

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
export async function getHolder(query: Types.GetHolderQuery, config?: RequestInit) {
  const _query_ = `?${new URLSearchParams(Object.entries(query)).toString()}`;
  const response = await fetch(`${baseURL}/holder${_query_}`, {
    ...config,
  });
  return response.json() as Promise<Types.HoldersResponseDto>;
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
export async function getMarket(config?: RequestInit) {
  const response = await fetch(`${baseURL}/market`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
