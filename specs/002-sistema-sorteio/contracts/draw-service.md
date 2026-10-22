# Contract: Serviço de Sorteio e Histórico (`js/raffle.js` & `js/db.js`)

**Feature Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16

---

## 1. Módulo do Motor de Sorteio (`js/raffle.js`)

### 1.1 `buildRaffleTickets(guesses, options, previousWinners)`
Gera a lista ponderada de bilhetes virtuais elegíveis para a urna.

**Parâmetros**:
- `guesses`: `Array<Guess>` — Lista de todos os palpites disponíveis no estado.
- `options`: `DrawOptions` — Parâmetros do sorteio (`mode`, `targetGender`, `excludePreviousWinners`).
- `previousWinners`: `Array<DrawResult>` — Lista de vencedores já sorteados anteriormente.

**Retorno**:
- `Array<VirtualTicket>`: Lista de bilhetes na urna, onde cada cota confirmada gera 1 bilhete.

---

### 1.2 `selectWinningTicket(tickets)`
Seleciona aleatoriamente um bilhete da urna utilizando amostragem criptograficamente balanceada.

**Parâmetros**:
- `tickets`: `Array<VirtualTicket>` — Lista não vazia de bilhetes na urna.

**Retorno**:
- `VirtualTicket`: O bilhete sorteado.

---

### 1.3 `createWhatsAppCelebrationLink(winner, prizeTitle)`
Gera a URL universal da API do WhatsApp com mensagem pré-formatada parabenizando o ganhador.

**Parâmetros**:
- `winner`: `DrawResult` — Dados do ganhador.
- `prizeTitle`: `string` — Título do prêmio.

**Retorno**:
- `string`: Link formatado (`https://api.whatsapp.com/send?phone=...&text=...`).

---

## 2. Extensão da Camada de Banco de Dados (`js/db.js`)

### 2.1 `saveDraw(drawData)`
Persiste o resultado do sorteio na coleção `draws` do Firestore (ou chave `bolao_draws` do LocalStorage em modo local).

**Parâmetros**:
- `drawData`: `Omit<DrawResult, 'id'>`

**Retorno**:
- `Promise<DrawResult>`: Objeto persistido contendo o `id` gerado.

---

### 2.2 `getDrawHistory()`
Recupera a lista de todos os sorteios já realizados, ordenados dos mais recentes para os mais antigos.

**Retorno**:
- `Promise<Array<DrawResult>>`

---

### 2.3 `resetDrawHistory()`
Exclui todos os registros de sorteios (usado pelo administrador para reiniciar dados antes do evento oficial).

**Retorno**:
- `Promise<void>`

---

### 2.4 `subscribeToDraws(callback)`
Registra um ouvinte em tempo real para atualizações na coleção de sorteios.

**Parâmetros**:
- `callback`: `(draws: Array<DrawResult>) => void`

**Retorno**:
- `() => void`: Função para cancelar a inscrição do listener.
