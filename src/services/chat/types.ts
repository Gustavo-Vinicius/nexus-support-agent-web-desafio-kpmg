export type ChatSendRequest = {
  sessionId: string;
  message: string;
};

export type ChatAwaitingConfirmation = {
  orderId: string;
  prompt: string;
};

/** Resposta real de POST /chat (Nexus Support Agent API). */
export type ChatSendResponse = {
  reply: string;
  threadId: string;
  awaitingConfirmation?: ChatAwaitingConfirmation;
};

export type ChatApiErrorBody = {
  error: string;
  message?: string;
  details?: unknown;
};
