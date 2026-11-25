"use client";

import { handleApiError } from "@/errors/handle-api-error";
import { isMockEnabled } from "@/lib/api";
import { http } from "@/services/http";

/**
 * DELETE /sessions/:sessionId (via proxy + Bearer).
 * No modo mock, apenas simula sucesso.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return;
  }

  const response = await http(`/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
    auth: "admin",
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
