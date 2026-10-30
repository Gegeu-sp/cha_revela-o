# Phase 0 Research: Correção do Palpite Manual e Valor Personalizado

## 1. Persistência de Palpites Manuais Confirmados no Firestore

- **Decision**: Realizar a gravação no Firestore em duas etapas atômicas quando `status !== 'pending'` (`addDoc` com `status: 'pending'` seguido imediatamente por `setDoc(..., { status: 'confirmed', confirmedAt }, { merge: true })`), além de atualizar `firestore.rules` para permitir `isManual == true && status in ['pending', 'confirmed']` em `allow create`.
- **Rationale**: As regras de segurança publicadas no Firestore bloqueavam `create` quando `status != 'pending'`. Ao falhar com `permission-denied`, o SDK do Firestore revertia o cache local e disparava `onSnapshot`, apagando também o fallback salvo no `localStorage`. A gravação em duas etapas funciona tanto com as regras antigas quanto com as novas regras publicadas, e a atualização otimista imediata de `cachedGuesses` garante exibição instantânea na tabela.
- **Alternatives considered**:
  - Alterar apenas `firestore.rules`: descartado como única solução porque qualquer atraso na propagação das regras manteria o erro; a combinação das duas abordagens oferece resiliência total.

## 2. Preservação de Valor Personalizado ("Outro Valor")

- **Decision**: Adicionar o campo numérico `#manual-total-amount` (`step="0.01"`, `min="0.01"`) no formulário "Adicionar Palpite Manual" e `#edit-total-amount` no modal "Editar Palpite", e modificar `addGuess()` em `js/db.js` para priorizar `guessData.totalAmount` quando fornecido e positivo.
- **Rationale**: Em `js/db.js`, a linha `const totalAmount = Math.max(0.01, quotas * unitPrice)` sobrescrevia qualquer `totalAmount` enviado. Agora o sistema calcula automaticamente `cotas × valor da cota` como sugestão inicial ao alterar a quantidade de cotas, mas preserva integralmente qualquer valor digitado manualmente pelo administrador.
- **Alternatives considered**:
  - Alterar apenas o preço unitário: descartado porque quando um convidado compra 2 ou 3 cotas e paga um valor arredondado (ex: R$ 40,00 por 3 cotas), digitar o Valor Total Pago diretamente é muito mais intuitivo e evita dízimas periódicas.

## 3. Redirecionamento e Visibilidade na Tabela de Registros

- **Decision**: Ao concluir o envio de `#admin-manual-guess-form`, redefinir `currentFilter = 'all'` caso estivesse em `'pending'`, atualizar o estilo dos botões de filtro, acionar `switchAdminTab('palpites')` e invocar explicitamente `renderAdminGuessesTable()`, `updatePendingBadge()` e `updateRaffleUI()`.
- **Rationale**: Garante que o administrador veja imediatamente o registro recém-adicionado no topo da tabela de palpites.
- **Alternatives considered**: Manter o filtro anterior (descartado pois causava a impressão de que o palpite confirmado não havia sido registrado quando o filtro "Aguardando Pix" estava ativo).
