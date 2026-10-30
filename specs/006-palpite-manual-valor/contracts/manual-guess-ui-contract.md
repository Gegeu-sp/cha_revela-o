# UI & Persistence Contract: Adicionar e Editar Palpite Manual

## 1. Formulário `#admin-manual-guess-form` (`index.html` / `js/admin.js`)

### Inputs
- `#manual-guest-name`: `text`, `required`, `minlength="2"`
- `#manual-whatsapp`: `text`, opcional
- `#manual-gender`: `select` (`boy` | `girl`)
- `#manual-quotas`: `number`, `min="1"`, `max="100"`, `value="1"`, `required`
- `#manual-total-amount`: `number`, `step="0.01"`, `min="0.01"`, `value="15.00"`, `required`
- `#manual-notes`: `text`, opcional

### Comportamento Reativo
1. Ao alterar `#manual-quotas`, se o administrador ainda não tiver editado manualmente `#manual-total-amount`, o campo `#manual-total-amount` é atualizado automaticamente para `(quotas * config.quotaPrice).toFixed(2)`.
2. Ao digitar qualquer valor em `#manual-total-amount`, o valor personalizado é preservado (`manualAmountCustomized = true`).
3. Ao submeter o formulário:
   - Chama `addGuess({ guestName, whatsapp, gender, babyNameChosen, quotasCount, unitPrice, totalAmount, status: 'confirmed', isManual: true, notes })`.
   - Limpa o formulário e restaura `#manual-total-amount` para o valor de 1 cota padrão.
   - Se `currentFilter === 'pending'`, redefine `currentFilter = 'all'`.
   - Muda para a aba `palpites` (`switchAdminTab('palpites')`) e atualiza imediatamente a tabela (`renderAdminGuessesTable()`), o badge de pendentes e a urna de sorteio.

## 2. Modal `#admin-edit-guess-form` (`index.html` / `js/admin.js`)

### Inputs
- `#edit-quotas`: `number`, `min="1"`, `max="100"`, `required`
- `#edit-total-amount`: `number`, `step="0.01"`, `min="0.01"`, `required`
- `#edit-status`: `select` (`pending` | `confirmed` | `cancelled`)
- `#edit-notes`: `text`

### Comportamento Reativo
1. Ao abrir `window.openEditGuessModal(guessId)`, preenche `#edit-total-amount` com `Number(g.totalAmount).toFixed(2)`.
2. Ao salvar, envia `totalAmount` e `unitPrice = Number((totalAmount / quotasCount).toFixed(2))` para `updateGuess(guessId, fields)`.
