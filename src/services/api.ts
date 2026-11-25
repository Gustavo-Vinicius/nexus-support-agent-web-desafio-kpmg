export const api = {
  get baseUrl() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL não foi configurada nas variáveis de ambiente.",
      );
    }

    return API_URL.replace(/\/+$/, "");
  },
};
