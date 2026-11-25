"use client";

import { handleApiError } from "@/errors/handle-api-error";
import { http } from "@/services/http";

import type { ApiOrder } from "./types";

export async function getOrderById(orderId: string): Promise<ApiOrder> {
  const response = await http(`/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    auth: "admin",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
