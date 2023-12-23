/**
 * @title
 * @description
 * @swagger 3.0.0
 * @version 1.0.0
 */

import * as Types from "./index.type";

export const baseURL = "http://localhost:4000/";

/**
 * @method get
 * @tags app-controller
 */
export async function getInscription(config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription`, {
    ...config,
  });
  return response.json() as Promise<any>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getInscriptionHash(paths: Types.GetInscriptionHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/inscription/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<any>;
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
  return response.json() as Promise<any>;
}
/**
 * @method get
 * @tags app-controller
 */
export async function getToken(config?: RequestInit) {
  const response = await fetch(`${baseURL}/token`, {
    ...config,
  });
  return response.json() as Promise<any>;
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
