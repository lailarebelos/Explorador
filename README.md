# Explorador de Pesquisas

Interface de chat com IA especializada em analisar dados de pesquisas normalizados pelo **Refinador** (arquivos `.xlsx` com abas `data` e `codebook`).

## Pré-requisitos

- Node.js 18+
- npm 9+
- Chave de API da Localiza LLM (`LOCALIZA_LLM_API_KEY`)

---

## Configuração e execução local

### 1. Clonar e instalar dependências

```bash
# Na raiz do projeto
npm install          # instala concurrently
npm run install:all  # instala backend e frontend
```

### 2. Configurar variáveis de ambiente

```bash
# Copie o exemplo para o arquivo real
cp backend/.env.example backend/.env
```

Edite `backend/.env` e adicione sua chave:

```env
LOCALIZA_LLM_API_KEY=sua_chave_aqui
PORT=3001
```

> **Nota:** O arquivo `backend/.env` já vem preenchido para desenvolvimento local.
> **Nunca commite `.env` com a chave real.**

### 3. Rodar o projeto

```bash
# Na raiz — inicia backend (porta 3001) e frontend (porta 5173) simultaneamente
npm run dev
```

Ou separadamente:

```bash
# Backend
cd backend && npm run dev

# Frontend (em outro terminal)
cd frontend && npm run dev
```

Acesse: **http://localhost:5173**

---

## Estrutura do projeto

```
agente-conversacional/
├── backend/
│   ├── src/
│   │   ├── index.ts                  # Servidor Express
│   │   ├── routes/
│   │   │   ├── upload.ts             # POST /api/upload
│   │   │   └── chat.ts               # POST /api/chat
│   │   ├── services/
│   │   │   ├── excelParser.ts        # Leitura e parsing do .xlsx
│   │   │   ├── statsService.ts       # Cálculos: média, correlação, regressão
│   │   │   └── llmService.ts         # Integração com Localiza LLM API
│   │   ├── utils/
│   │   │   └── contextBuilder.ts     # Monta contexto compacto para a IA
│   │   ├── store/
│   │   │   └── sessionStore.ts       # Armazenamento em memória por sessão
│   │   └── types/
│   │       └── index.ts              # Interfaces TypeScript
│   ├── .env                          # Variáveis de ambiente (não commitar)
│   ├── .env.example                  # Template de variáveis
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                  # Ponto de entrada React
│   │   ├── App.tsx                   # Componente raiz
│   │   ├── App.css                   # Estilos globais
│   │   ├── index.css                 # Reset e variáveis CSS
│   │   ├── components/
│   │   │   ├── UploadScreen.tsx      # Tela inicial de upload
│   │   │   ├── ChatInterface.tsx     # Interface de chat com sidebar
│   │   │   └── MessageBubble.tsx     # Bolha de mensagem com markdown
│   │   ├── services/
│   │   │   └── api.ts                # Chamadas HTTP ao backend
│   │   └── types/
│   │       └── index.ts              # Interfaces TypeScript
│   ├── index.html
│   ├── vite.config.ts                # Dev server com proxy para /api
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── .gitignore
├── package.json                      # Scripts raiz com concurrently
└── README.md
```

---

## Como usar

1. Acesse **http://localhost:5173**
2. Faça upload de um arquivo `.xlsx` gerado pelo Normalizador (com abas `data` e `codebook`)
3. O sistema exibirá um resumo do arquivo (respondentes, colunas, codebook)
4. Faça perguntas em linguagem natural na interface de chat

### Exemplos de perguntas

- "Qual é a média de satisfação geral?"
- "Existe correlação entre `nps` e `satisfacao_geral`?"
- "Gere um resumo executivo dos dados."
- "Crie uma fórmula Excel para calcular a média filtrada por departamento."
- "Quais colunas têm mais respostas ausentes?"
- "Faça uma regressão de `engajamento` em função de `lideranca`."

---

## Arquitetura de dados

Para não sobrecarregar o contexto da IA, o backend **pré-processa** os dados antes de cada chamada:

| O que é enviado à IA | Como é enviado |
|---|---|
| Codebook completo | Texto estruturado por coluna |
| Estatísticas de cada coluna | Média, mediana, DP, mín, máx, ausentes, distribuição 1-5 |
| Amostra de dados | Primeiras 8 linhas em JSON |
| Correlação / Regressão | Resultado calculado no backend (não envia dados brutos) |

---

## Endpoints da API

### `POST /api/upload`
Recebe o arquivo `.xlsx`, valida abas, armazena em sessão.

**Body:** `multipart/form-data` com campo `file`

**Resposta:**
```json
{
  "sessionId": "sess_...",
  "fileName": "pesquisa.xlsx",
  "rowCount": 342,
  "columnCount": 28,
  "codebookCount": 28
}
```

### `POST /api/chat`
Processa uma pergunta no contexto dos dados carregados.

**Body:**
```json
{
  "sessionId": "sess_...",
  "message": "Qual a média de satisfação?",
  "history": [{ "role": "user", "content": "..." }, ...]
}
```

**Resposta:**
```json
{ "response": "Resposta da IA em markdown..." }
```

---

## Deploy futuro

### Azure App Service (Backend)
```bash
cd backend
npm run build
# Faça deploy da pasta dist/ + package.json para o App Service
# Configure LOCALIZA_LLM_API_KEY nas Application Settings
```

### Azure Static Web Apps (Frontend)
```bash
cd frontend
npm run build
# Faça deploy da pasta dist/ para o Static Web App
# Configure as rotas de API para apontar para o backend
```

### Microsoft Entra ID (SSO)
O projeto foi estruturado para receber autenticação via MSAL futuramente.
Para ativar, adicione `@azure/msal-react` ao frontend e configure um middleware
de validação de JWT no Express usando `@azure/msal-node`.

### OneDrive / Microsoft Graph
Para leitura direta de arquivos do OneDrive, adicione o escopo `Files.Read`
ao fluxo MSAL e use o endpoint `https://graph.microsoft.com/v1.0/me/drive/items/{id}/content`
como alternativa ao upload manual.

---

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `LOCALIZA_LLM_API_KEY` | Chave de acesso à API de IA Localiza | — |
| `PORT` | Porta do servidor backend | `3001` |
