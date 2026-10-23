# Data Model: Blindagem de Segurança, Proteção de Dados e Controle de Acesso

**Feature Branch**: `004-seguranca-e-blindagem`  
**Date**: 2026-10-23  
**Status**: Completed  

---

## 1. Entities & Data Structures

### 1.1 SecurityConfig
Configurações e parâmetros globais de segurança da aplicação:

| Campo | Tipo | Descrição | Valor Padrão |
|-------|------|-----------|--------------|
| `adminPasswordHash` | `string` | Hash SHA-256 (64 hex chars) da senha dos pais | Hash de credencial inicial segura |
| `lockoutThreshold` | `number` | Tentativas consecutivas de erro antes do bloqueio | `5` |
| `lockoutDurationMs` | `number` | Duração do bloqueio temporário em milissegundos | `300000` (5 minutos) |
| `submissionCooldownMs` | `number` | Intervalo mínimo entre envios de palpites | `8000` (8 segundos) |
| `sessionTimeoutMs` | `number` | Tempo máximo de inatividade da sessão de admin | `1800000` (30 minutos) |

---

### 1.2 AdminAuthSession
Representação do estado de autenticação do administrador dos pais no cliente:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `uid` | `string` | Identificador único do administrador autenticado |
| `email` | `string` | E-mail ou identificador de acesso |
| `displayName` | `string` | Nome exibido na interface ("Administrador dos Pais") |
| `isAdmin` | `boolean` | Flag indicando privilégios administrativos (`true`) |
| `loginTimestamp` | `number` | Timestamp de início da sessão (epoch ms) |
| `lastActivityTimestamp` | `number` | Timestamp da última interação detectada (epoch ms) |

**Regras de Transição de Estado**:
- **Login com Sucesso**: `AdminAuthSession` é criada, `loginTimestamp` e `lastActivityTimestamp` são preenchidos com `Date.now()`.
- **Ação do Usuário**: `lastActivityTimestamp` é atualizado para `Date.now()`.
- **Inatividade (> 30 min)**: Sessão é invalidada automaticamente e o usuário é desconectado.
- **Logout Explícito**: Sessão é removida da memória e do armazenamento local.

---

### 1.3 LoginAttemptTracker
Rastreamento de tentativas de acesso para mitigação de força bruta:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `failedAttempts` | `number` | Contagem de erros consecutivos de senha |
| `lockedUntil` | `number \| null` | Timestamp (epoch ms) até quando novos logins estão bloqueados |

**Regras de Validação**:
- Se `Date.now() < lockedUntil`, tentativas de login são rejeitadas imediatamente com erro de bloqueio.
- Se `failedAttempts >= 5` e `lockedUntil == null`, define `lockedUntil = Date.now() + 300000`.
- Se `Date.now() >= lockedUntil`, o bloqueio expira e permite novas tentativas.
- Ao registrar login com sucesso, `failedAttempts` e `lockedUntil` são limpos (`0` e `null`).

---

### 1.4 GuessSubmissionValidation (Esquema de Criação de Palpite)
Esquema validado tanto no cliente quanto pelas regras do Cloud Firestore:

| Campo | Tipo | Regra de Validação | Descrição |
|-------|------|--------------------|-----------|
| `guestName` | `string` | Obrigatório; tamanho de 2 a 100 caracteres; caracteres sanitizados | Nome do participante |
| `whatsapp` | `string` | Formato numérico/telefone válido | Telefone para contato e validação |
| `gender` | `string` | Estritamente `'boy'` ou `'girl'` | Voto no sexo do bebê |
| `quotasCount` | `number` | Inteiro, mínimo 1, máximo 100 | Quantidade de cotas adquiridas |
| `unitPrice` | `number` | Número positivo coincidente com a cota do evento | Valor unitário da cota |
| `totalAmount` | `number` | Número positivo (`quotasCount * unitPrice`) | Valor total a transferir |
| `status` | `string` | Estritamente `'pending'` na criação | Estado inicial do palpite |
| `createdAt` | `string` | Formato ISO 8601 de data/hora | Carimbo de registro |
| `website_check` (Honeypot) | `string` | Deve ser rigorosamente vazia (`""`) | Campo invisível anti-robô |

---

### 1.5 PublicGuessProjection
Projeção de dados para consumo público (placar, ranking de maiores participantes e notificações):

| Campo | Tipo | Visibilidade Pública | Descrição |
|-------|------|----------------------|-----------|
| `id` | `string` | Pública | ID do palpite |
| `guestName` | `string` | Pública (Sanitizada via `escapeHtml`) | Nome do participante |
| `gender` | `'boy' \| 'girl'` | Pública | Palpite escolhido |
| `quotasCount` | `number` | Pública | Número de cotas |
| `totalAmount` | `number` | Pública | Total em R$ |
| `status` | `string` | Pública (`pending` / `confirmed`) | Situação do pagamento |
| `createdAt` | `string` | Pública | Data/hora |
| `whatsapp` | `string` | **NÃO EXPOSTO** (ou mascarado `(XX) 9****-XXXX`) | Privacidade protegida (LGPD) |
