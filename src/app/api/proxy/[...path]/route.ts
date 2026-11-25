import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { StorageKey } from "@/enum/storage-key.enum";
import { resolveServerApiBaseUrl } from "@/services/http/api-base-url";
import {
  HTTP_AUTH_HEADER,
  HTTP_AUTH_QUERY,
  HttpAuthContext,
} from "@/services/http/types";

function resolveAuthContext(request: NextRequest): HttpAuthContext {
  const authHeader = request.headers.get(HTTP_AUTH_HEADER);
  const authQuery = request.nextUrl.searchParams.get(HTTP_AUTH_QUERY);
  const auth = authHeader ?? authQuery;

  if (auth === "public" || auth === "admin" || auth === "none") {
    return auth;
  }

  return "admin";
}

async function readResponsePayload(response: Response): Promise<{
  isJson: boolean;
  body: unknown;
  raw: string;
}> {
  const raw = await response.text();

  if (!raw.trim()) {
    return { isJson: false, body: undefined, raw };
  }

  try {
    return { isJson: true, body: JSON.parse(raw), raw };
  } catch {
    return { isJson: false, body: undefined, raw };
  }
}

async function handler(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const cookieStore = await cookies();
  const { path } = await params;
  const endpoint = path.join("/");

  const requestUrl = new URL(request.url);
  const apiSearchParams = new URLSearchParams(requestUrl.search);
  apiSearchParams.delete(HTTP_AUTH_QUERY);
  const queryString = apiSearchParams.toString();

  let apiBase = "";
  try {
    apiBase = resolveServerApiBaseUrl();
  } catch {
    return Response.json(
      {
        message: "API_URL não configurada no servidor.",
        _proxy: {
          endpoint,
          method: request.method,
          status: 500,
        },
      },
      { status: 500 },
    );
  }

  const apiUrl = `${apiBase}/${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const publicToken = cookieStore.get(StorageKey.PUBLIC_ACCESS_TOKEN)?.value;
  const adminToken = cookieStore.get(StorageKey.ACCESS_TOKEN)?.value;
  const authContext = resolveAuthContext(request);

  const token =
    authContext === "public"
      ? publicToken
      : authContext === "admin"
        ? (adminToken ?? publicToken)
        : undefined;

  if (authContext === "admin" && !token) {
    return Response.json(
      {
        message: "Não autenticado.",
        _proxy: {
          endpoint,
          method: request.method,
          status: 401,
          reason: "ACCESS_TOKEN/PUBLIC_ACCESS_TOKEN ausente no cookie.",
        },
      },
      { status: 401 },
    );
  }

  const isBodylessMethod =
    request.method === "GET" || request.method === "HEAD";

  const requestBody = isBodylessMethod
    ? undefined
    : await request.arrayBuffer();

  let response: Response;

  try {
    response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        Accept: request.headers.get("accept") ?? "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(request.headers.get("content-type")
          ? { "Content-Type": request.headers.get("content-type")! }
          : {}),
      },
      body:
        requestBody && requestBody.byteLength > 0 ? requestBody : undefined,
    });
  } catch (error) {
    console.error("[proxy] Falha ao chamar API:", {
      apiUrl,
      method: request.method,
      error,
    });

    return Response.json(
      {
        message: "Não foi possível conectar à API.",
        _proxy: {
          endpoint,
          method: request.method,
          status: 502,
          reason:
            error instanceof Error
              ? error.message
              : "Erro de rede desconhecido.",
        },
      },
      { status: 502 },
    );
  }

  const { isJson, body, raw } = await readResponsePayload(response);

  if (!response.ok) {
    return Response.json(
      body && typeof body === "object"
        ? body
        : { message: raw || "Erro ao comunicar com a API." },
      { status: response.status },
    );
  }

  if (isJson && body !== undefined) {
    return Response.json(body, { status: response.status });
  }

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(raw, {
    status: response.status,
    headers,
  });
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
