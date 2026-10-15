# Data Model: Gestão Completa de Rifa e Bolão

**Feature**: `001-rifa-bolao-admin`
**Date**: 2026-10-14
**Status**: Complete

## 1. Entidades Principais

### 1.1 `EventConfig` (Configuração do Evento)
Armazenada no Firestore no documento único `settings/event_config` ou em `localStorage` no modo demo.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `title` | string | Sim | Título da página ou do evento | `"Bolão de Chá Revelação"` |
| `boyBabyName` | string | Sim | Nome oficial escolhido para o Menino | `"Lucca"` |
| `girlBabyName` | string | Sim | Nome oficial escolhido para a Menina | `"Maya"` |
| `expectedBirthDate` | string (ISO Date) | Sim | Data prevista de nascimento (YYYY-MM-DD) | `"2026-11-20"` |
| `quotaPrice` | number | Sim | Valor unitário em reais por cota da rifa | `15.00` |
| `pixKey` | string | Sim | Chave Pix para recebimento | `"charevelacao@email.com"` |
| `pixReceiverName` | string | Sim | Nome do titular da conta bancária | `"Mamãe & Papai"` |
| `pixCity` | string | Não | Cidade do titular para montagem do Pix padrão | `"São Paulo"` |
| `prizePercentage` | number | Sim | Percentual arrecadado destinado à premiação | `50` (50%) |
| `eventStatus` | string | Sim | Status do evento: `'active'`, `'closed'`, `'revealed'` | `'active'` |
| `revealedGender` | string | Não | Gênero revelado: `'boy'`, `'girl'`, ou `null` | `null` |
| `updatedAt` | timestamp | Sim | Data e hora da última modificação | `2026-10-14T15:00:00Z` |

---

### 1.2 `Guess` (Palpite / Cota da Rifa)
Armazenada na coleção do Firestore `guesses/{guessId}`.

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `id` | string | Sim | Identificador único do palpite | `"guess_abc123"` |
| `guestName` | string | Sim | Nome completo do convidado | `"Tia Carla"` |
| `whatsapp` | string | Sim | Telefone / WhatsApp para contato | `"(11) 98765-4321"` |
| `gender` | string | Sim | Escolha do palpite: `'boy'` ou `'girl'` | `'girl'` |
| `babyNameChosen` | string | Sim | Nome do bebê no momento do voto | `"Maya"` |
| `quotasCount` | number | Sim | Quantidade de cotas compradas | `2` |
| `unitPrice` | number | Sim | Valor unitário da cota no momento da compra | `15.00` |
| `totalAmount` | number | Sim | Valor total a pagar (`quotasCount * unitPrice`) | `30.00` |
| `status` | string | Sim | Status do pagamento: `'pending'`, `'confirmed'`, `'cancelled'` | `'pending'` |
| `isManual` | boolean | Sim | Indica se foi inserido manualmente pelo admin | `false` |
| `notes` | string | Não | Observações da mãe/pai | `"Pix conferido no extrato"` |
| `createdAt` | timestamp | Sim | Data e hora de envio | `2026-10-14T15:30:00Z` |
| `confirmedAt` | timestamp | Não | Data e hora da confirmação pelo admin | `null` |

---

## 2. Operação de Reinicialização (Reset do Bolão)

### `resetAllGuesses()`
- Exclui todos os documentos da coleção `guesses` (ou zera a lista local).
- Preserva as configurações do evento (`EventConfig`).
- Recalcula e zera todos os contadores de palpites, arrecadação e porcentagens do placar.
- Requer autorização de administrador autenticado.
