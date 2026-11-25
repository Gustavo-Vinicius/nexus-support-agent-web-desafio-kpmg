import { clientFetch } from "./client";
import { serverFetch } from "./server";

export const http = typeof window === "undefined" ? serverFetch : clientFetch;
