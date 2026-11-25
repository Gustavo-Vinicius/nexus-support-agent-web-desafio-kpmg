"use client";

import { handleApiError } from "@/errors/handle-api-error";
import { http } from "@/services/http";

export type HealthResponse = {
  status?: string;
  [key: string]: unknown;
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await http("/health", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    auth: "none",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
