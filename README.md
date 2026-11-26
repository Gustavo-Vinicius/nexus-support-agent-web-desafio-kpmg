# Nexus Support Agent — Frontend

Interface web do **Nexus Support Agent**: chat de atendimento ao cliente da Nexus Commerce, com respostas fundamentadas em pedidos e base de conhecimento.

## Screenshots

### Abertura seleção de cliente

![Tela de abertura com autenticação simulada](<img width="1318" height="911" alt="image" src="https://github.com/user-attachments/assets/68f13187-9a98-4c72-9ba3-bc0eb28c71e7" />)

### Chat — estado inicial

![Chat com sugestões de perguntas](<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/3513247f-74a2-4942-b1d4-fe04777c1834" />)

### Consulta de pedido

![Resposta com card do pedido 12345](<img width="1916" height="909" alt="image" src="https://github.com/user-attachments/assets/e3968dfa-fcef-4c89-be6c-351b8e1bf92f" />)

### Confirmação de cancelamento

![Fluxo de confirmação de cancelamento](<img width="1913" height="909" alt="image" src="https://github.com/user-attachments/assets/77759bcf-c900-45b9-8b34-b0fcda0fe46a" />)

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **react-markdown** (respostas do assistente)
- Proxy server-side em `/api/proxy` (evita CORS no browser)

## Funcionalidades

- Tela inicial com seleção de cliente simulado (`customer-001` / `customer-002`)
- Chat com histórico de sessões (sidebar), nova conversa e exclusão de sessão
- Renderização de Markdown, cards de pedido e chips de tools
- Fluxo de confirmação de cancelamento de pedido
- Modo **mock** local ou integração com a **API real**

## Pré-requisitos

- Node.js 20+
- Yarn ou npm
- API Nexus rodando (quando `NEXT_PUBLIC_USE_MOCK=false`)

## Setup

```bash
# instalar dependências
yarn

# configurar ambiente
cp .env.example .env
```

Edite o `.env`:

```env
# URL da API Nexus (não use a mesma porta do Next.js)
# Ex.: API em 3333 e front em 3000
NEXT_PUBLIC_API_URL=http://localhost:3333

# true = mock local | false = API real via /api/proxy
NEXT_PUBLIC_USE_MOCK=false
```

## Scripts

```bash
yarn dev      # http://localhost:3000
yarn build    # build de produção
yarn start    # sobe o build
yarn lint     # ESLint
```

## Como usar

1. Abra `http://localhost:3000`
2. Selecione um cliente simulado e inicie a conversa
3. No chat, consulte pedidos, status e solicite cancelamento quando disponível

Tokens alinhados à API:

| Cliente        | Token  |
|----------------|--------|
| `customer-001` | `tok_a` |
| `customer-002` | `tok_b` |

## Estrutura

```text
src/
├── app/                 # rotas (/, /chat) e proxy /api/proxy
├── components/chat/     # UI do chat
├── hooks/               # useChat, useSessions
├── lib/                 # auth, mock, session storage, tipos
├── services/            # chat, orders, sessions, http
├── config/              # rotas e base path
├── errors/              # erros de API
└── styles/              # globals.css
```

## Modo mock vs API real

| Variável | Comportamento |
|----------|----------------|
| `NEXT_PUBLIC_USE_MOCK=true` | Respostas e pedidos vêm de `src/lib/mockApi.ts` / `mockOrders.ts` |
| `NEXT_PUBLIC_USE_MOCK=false` | O browser chama `/api/proxy/...`, que encaminha para `NEXT_PUBLIC_API_URL` |

No modo real, a API precisa estar acessível na URL configurada. O front **não** deve compartilhar a porta da API.

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Abertura — escolha do cliente |
| `/chat` | Interface do chat |
| `/api/proxy/[...path]` | Proxy autenticado para a API |

## Observações

- Sessão (token, userId, sessionId) fica em `sessionStorage`
- O status “Modelo online / indisponível” no header reflete a disponibilidade do backend (ou mock)
- Variáveis `NEXT_PUBLIC_*` são embutidas no build — altere o `.env` e reinicie o `yarn dev` após mudanças
