"use client";

import { handleApiError } from "@/errors/handle-api-error";
import { http } from "@/services/http";

import type { ApiCancellationResult } from "./types";

export async function postOrderCancellationRequest(
  orderId: string,
): Promise<ApiCancellationResult> {
  const response = await http(
    `/orders/${encodeURIComponent(orderId)}/cancellation-request`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      auth: "admin",
    },
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
