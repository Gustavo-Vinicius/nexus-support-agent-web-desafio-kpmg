export type MockUser = {
  userId: string;
  token: string;
  summary: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    userId: "customer-001",
    token: "token-001",
    summary: "2 pedidos · 12345 atrasado",
  },
  {
    userId: "customer-002",
    token: "token-002",
    summary: "1 pedido · 22222 enviado",
  },
];
