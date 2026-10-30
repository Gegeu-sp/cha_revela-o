# Tasks: Correção do Registro de Palpite Manual e Suporte a Valor Personalizado

**Input**: Design documents from `/specs/006-palpite-manual-valor/`

## Phase 1: Camada de Persistência e Regras do Firestore

- [x] T001 Atualizar `firestore.rules` para permitir criação de palpites manuais confirmados (`isManual == true && status in ['pending', 'confirmed']`)
- [x] T002 Atualizar `addGuess` em `js/db.js` para respeitar `totalAmount` personalizado (com suporte a decimais) e realizar gravação compatível no Firestore (`addDoc` + `setDoc`) com atualização imediata de `cachedGuesses` e `localStorage`
- [x] T003 Atualizar `onSnapshot` e `deduplicateGuesses` em `js/db.js` para preservar registros locais e evitar descarte indevido de cadastros manuais seguidos
- [x] T004 Atualizar `updateGuess` em `js/db.js` para atualizar o estado local imediatamente antes da sincronização em nuvem

## Phase 2: Interface e Controlador Administrativo (Cadastro Manual e Edição)

- [x] T005 Adicionar o campo `Valor Total Pago (R$)` (`#manual-total-amount`) na aba "Adicionar Palpite Manual" em `index.html`
- [x] T006 Substituir o campo de preço unitário restrito por `Valor Total Pago (R$)` (`#edit-total-amount`, `step="0.01"`) no modal "Editar Palpite" em `index.html`
- [x] T007 Atualizar o handler de `#admin-manual-guess-form` em `js/admin.js` para sincronizar cotas/valor, permitir valor personalizado, redefinir filtro para `all` e redirecionar imediatamente para a aba `palpites` renderizando a tabela
- [x] T008 Atualizar `window.openEditGuessModal` e `#admin-edit-guess-form` em `js/admin.js` para carregar e salvar `totalAmount` personalizado

## Phase 3: Verificação, Deploy Firebase e GitHub

- [x] T009 Validar sintaxe e comportamento de `addGuess` e `getComputedState` com valores personalizados
- [x] T010 Publicar regras e hospedagem no Firebase (`firebase deploy`) e atualizar repositório no GitHub (`git commit` + `git push origin main`)
