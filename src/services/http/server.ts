"use server";

import { cookies } from "next/headers";

import { StorageKey } from "@/enum/storage-key.enum";

import { resolveServerApiBaseUrl } from "./api-base-url";
import { HttpOptions } from "./types";

export async function serverFetch(url: string, init?: HttpOptions) {
  const cookieStore = await cookies();

  const auth = init?.auth ?? "admin";

  let token: string | undefined;

  if (auth === "admin") {
    token =
      cookieStore.get(StorageKey.ACCESS_TOKEN)?.value ??
      cookieStore.get(StorageKey.PUBLIC_ACCESS_TOKEN)?.value;
  }

  if (auth === "public") {
    token = cookieStore.get(StorageKey.PUBLIC_ACCESS_TOKEN)?.value;
  }

  const headers = new Headers(init?.headers);

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { auth: _auth, ...fetchInit } = init ?? {};
  void _auth;
  const baseUrl = resolveServerApiBaseUrl();

  return fetch(`${baseUrl}${url}`, {
    ...fetchInit,
    headers,
  });
}
