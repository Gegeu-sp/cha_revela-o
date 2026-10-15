# Admin Interface Contract

**Feature**: `001-rifa-bolao-admin`
**Contract Version**: 1.0.0

## 1. Autenticação

### `loginAdmin(email, password)`
Autentica o pai ou a mãe no painel de administração via Firebase Auth.

- **Entrada**:
  ```json
  {
    "email": "mae@email.com",
    "password": "senha-segura"
  }
  ```
- **Retorno de Sucesso**:
  ```json
  {
    "success": true,
    "user": {
      "uid": "usr_9988",
      "email": "mae@email.com"
    }
  }
  ```
- **Erros Possíveis**: `auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password`.

### `logoutAdmin()`
Encerra a sessão administrativa atual e remove privilégios no cliente.

---

## 2. Gestão de Configuração do Evento

### `updateEventConfig(configData)`
Atualiza os parâmetros globais da rifa e do evento.

- **Entrada**:
  ```json
  {
    "title": "Bolão Chá Revelação - Lucca ou Maya?",
    "babyName": "Lucca ou Maya",
    "expectedBirthDate": "2026-11-20",
    "quotaPrice": 20.00,
    "pixKey": "mamae@pix.com.br",
    "pixReceiverName": "Mariana Silva",
    "prizePercentage": 50
  }
  ```
- **Retorno**: `{ "success": true, "updatedAt": "2026-10-14T15:45:00Z" }`

---

## 3. Gestão e Auditoria de Pagamentos

### `confirmGuessPayment(guessId)`
Altera o status de um palpite de `"pending"` para `"confirmed"`, registrando o timestamp de aprovação e recalculando contadores globais.

- **Entrada**: `{ "guessId": "guess_123" }`
- **Retorno**: `{ "success": true, "status": "confirmed", "confirmedAt": "2026-10-14T15:46:00Z" }`

### `editGuess(guessId, fieldsToUpdate)`
Permite aos pais corrigir nome digitado com erro, ajustar telefone, retificar o palpite ou a quantidade de cotas.

- **Entrada**:
  ```json
  {
    "guessId": "guess_123",
    "fields": {
      "guestName": "Tio João Carlos",
      "whatsapp": "(11) 99999-8888",
      "gender": "boy",
      "quotasCount": 3,
      "totalAmount": 60.00
    }
  }
  ```
- **Retorno**: `{ "success": true }`

### `cancelOrDeleteGuess(guessId, action)`
Cancela ou exclui um palpite indevido ou não pago.

- **Entrada**: `{ "guessId": "guess_123", "action": "delete" | "cancel" }`
- **Retorno**: `{ "success": true }`

### `addManualGuess(manualGuessData)`
Permite cadastrar palpites de familiares que pagaram diretamente em dinheiro ou por transferência externa.

- **Entrada**:
  ```json
  {
    "guestName": "Vovó Helena",
    "whatsapp": "(11) 98888-7777",
    "gender": "girl",
    "quotasCount": 5,
    "unitPrice": 20.00,
    "totalAmount": 100.00,
    "status": "confirmed",
    "isManual": true,
    "notes": "Pago em dinheiro vivo na casa da vovó"
  }
  ```
- **Retorno**: `{ "success": true, "guessId": "guess_manual_456" }`
