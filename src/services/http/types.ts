export type HttpAuthContext = "admin" | "public" | "none";

export const HTTP_AUTH_HEADER = "x-auth-context";

export const HTTP_AUTH_QUERY = "__auth";

export type HttpOptions = RequestInit & {
  auth?: HttpAuthContext;
};
