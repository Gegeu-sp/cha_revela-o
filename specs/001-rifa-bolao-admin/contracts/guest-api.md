# Guest & Public Interface Contract

**Feature**: `001-rifa-bolao-admin`
**Contract Version**: 1.0.0

## 1. Submissão de Palpites pelo Convidado

### `submitGuestGuess(guessInput)`
Registra a intenção de participação do convidado no Firestore com status inicial `"pending"`.

- **Entrada**:
  ```json
  {
    "guestName": "Lucas Ferreira",
    "whatsapp": "(11) 91234-5678",
    "gender": "boy",
    "quotasCount": 2,
    "unitPrice": 15.00
  }
  ```
- **Processamento**:
  - Validação de integridade e sanitização de `guestName` (prevenção contra tags HTML e scripts maliciosos).
  - Cálculo de `totalAmount = quotasCount * unitPrice`.
  - Atribuição automática de `status = "pending"`, `isManual = false`, `createdAt = now()`.
- **Retorno de Sucesso**:
  ```json
  {
    "success": true,
    "guessId": "guess_789",
    "totalAmount": 30.00,
    "whatsAppUrl": "https://wa.me/5511999999999?text=..."
  }
  ```

---

## 2. Assinatura e Sincronização em Tempo Real

### `subscribeToEventConfig(callback)`
Estabelece listener reativo (`onSnapshot`) sobre o documento de configuração do evento.
- **Notifica quando**: O administrador altera valor de cota, chave Pix, data prevista de nascimento ou título.

### `subscribeToGuesses(callback)`
Estabelece listener reativo (`onSnapshot`) sobre a coleção de palpites ordenada por `createdAt desc`.
- **Notifica quando**: Qualquer novo palpite é submetido ou aprovado pelo administrador.
- **Dispara recálculo**:
  - Indicadores numéricos (Total de Palpites, Arrecadação, Prêmio).
  - Placar animado da disputa Menino vs Menina.
  - Tabela pública de participantes.

---

## 3. Integração com WhatsApp

### `generateWhatsAppProofUrl(guessData, eventConfig)`
Constrói link codificado URI para abertura imediata do aplicativo WhatsApp com o texto formatado para envio do comprovante Pix.

- **Formato da Mensagem Gerada**:
  ```text
  Olá! Acabei de registrar meu palpite no Bolão de Chá Revelação! 🍼✨
  
  👤 Nome: Lucas Ferreira
  💙 Palpite: É MENINO!
  🎟️ Cotas: 2 cota(s) (R$ 30,00 no total)
  
  Segue em anexo o comprovante da transferência Pix! 📸
  ```
