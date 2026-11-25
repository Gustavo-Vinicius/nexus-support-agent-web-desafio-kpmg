"use client";

import { handleApiError } from "@/errors/handle-api-error";
import { http } from "@/services/http";

import type { ChatSendRequest, ChatSendResponse } from "./types";

export async function postChatSend(
  body: ChatSendRequest,
): Promise<ChatSendResponse> {
  const response = await http("/chat", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    auth: "admin",
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
