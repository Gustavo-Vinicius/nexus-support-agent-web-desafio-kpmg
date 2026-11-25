export type MockUser = {
  userId: string;
  token: string;
  summary: string;
};

/** Tokens alinhados à API (AUTH_TOKENS=customer-001:tok_a,customer-002:tok_b). */
export const MOCK_USERS: MockUser[] = [
  {
    userId: "customer-001",
    token: "tok_a",
    summary: "2 pedidos · 12345 atrasado",
  },
  {
    userId: "customer-002",
    token: "tok_b",
    summary: "1 pedido · 99999 em processamento",
  },
];

export function getUserByToken(token: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.token === token);
}

export function getUserById(userId: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.userId === userId);
}

export function userInitials(userId: string) {
  if (userId.endsWith("001")) {
    return "C1";
  }
  if (userId.endsWith("002")) {
    return "C2";
  }
  return userId.slice(0, 2).toUpperCase();
}
