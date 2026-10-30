# Tasks: Máscara Automática de Telefone/WhatsApp em Tempo Real

**Input**: Design documents from `/specs/007-mascara-telefone-whatsapp/`

## Phase 1: Utilitário de Formatação e Máscara

- [x] T001 Implementar `formatPhoneInput(value)` e `attachPhoneMask(inputEl)` em `js/auth.js` com suporte a `(DD) XXXXX-XXXX`, Backspace fluido e remoção de DDI `+55`

## Phase 2: Integração nos Formulários Público e Administrativo

- [x] T002 Atualizar os inputs `#whatsapp`, `#manual-whatsapp` e `#edit-whatsapp` em `index.html` com `type="tel"`, `inputmode="tel"`, `maxlength="15"` e `autocomplete="tel"`
- [x] T003 Conectar `attachPhoneMask` ao campo `#whatsapp` em `js/app.js`
- [x] T004 Conectar `attachPhoneMask` aos campos `#manual-whatsapp` e `#edit-whatsapp` e formatar o valor inicial em `window.openEditGuessModal` em `js/admin.js`

## Phase 3: Verificação, Commit no GitHub e Deploy no Firebase

- [x] T005 Validar `formatPhoneInput` com casos de teste automatizados em Node.js
- [x] T006 Realizar commit, `git push origin main` para o GitHub e `firebase deploy` para atualizar o site oficial
