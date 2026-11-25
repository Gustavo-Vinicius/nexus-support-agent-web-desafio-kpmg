"use client";

import { BASE_PATH } from "@/config";

import { HTTP_AUTH_HEADER, HTTP_AUTH_QUERY, HttpOptions } from "./types";

function appendAuthToUrl(url: string, auth: string) {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${HTTP_AUTH_QUERY}=${auth}`;
}

export async function clientFetch(url: string, init?: HttpOptions) {
  const headers = new Headers(init?.headers);

  const { auth, ...fetchInit } = init ?? {};

  let requestUrl = url;

  if (auth) {
    headers.set(HTTP_AUTH_HEADER, auth);
    requestUrl = appendAuthToUrl(url, auth);
  }

  return fetch(`${BASE_PATH}/api/proxy${requestUrl}`, {
    ...fetchInit,
    headers,
    credentials: "include",
  });
}
