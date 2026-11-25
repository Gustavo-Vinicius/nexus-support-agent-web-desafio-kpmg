/**
 * Base URL do backend usada em Server Components / Route Handlers.
 * Prefere API_URL (runtime) e cai em NEXT_PUBLIC_API_URL (build).
 */
export function resolveServerApiBaseUrl(): string {
  const baseUrl = (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    ""
  ).replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error(
      "API_URL (ou NEXT_PUBLIC_API_URL) não configurada no servidor.",
    );
  }

  return baseUrl;
}
