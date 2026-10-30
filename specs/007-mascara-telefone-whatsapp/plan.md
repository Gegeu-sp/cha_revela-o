# Implementation Plan: Máscara Automática de Telefone/WhatsApp em Tempo Real

**Branch**: `007-mascara-telefone-whatsapp` | **Date**: 2026-10-30 | **Spec**: [spec.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/007-mascara-telefone-whatsapp/spec.md)

**Input**: Feature specification from `/specs/007-mascara-telefone-whatsapp/spec.md`

## Summary

Implementar formatação automática em tempo real no padrão brasileiro `(DD) XXXXX-XXXX` para todos os campos de telefone/WhatsApp da aplicação (`#whatsapp` no formulário público, `#manual-whatsapp` na aba Adicionar Manual e `#edit-whatsapp` no modal Editar Palpite). A solução utiliza as funções utilitárias `formatPhoneInput` e `attachPhoneMask` em `js/auth.js`, atributos mobile-first (`type="tel" inputmode="tel" maxlength="15" autocomplete="tel"`) em `index.html`, e formatação automática ao abrir o modal de edição em `js/admin.js`.

## Technical Context

**Language/Version**: HTML5, CSS3 (Tailwind CSS CDN), JavaScript ES6+ Modules

**Primary Dependencies**: Vanilla JavaScript ES6 Modules (Zero-Build)

**Storage**: Cloud Firestore (`guesses`) + `localStorage` (`bolao_guesses`)

**Testing**: Validação automatizada via Node.js ES Modules (casos de digitação progressiva, colagem com `+55`, 10 e 11 dígitos)

**Target Platform**: Web Mobile-First (iOS Safari, Android Chrome) e Desktop Browsers via Firebase Hosting (`https://rifa-bolao.web.app`)

**Project Type**: Single-Page Web Application (Zero-Build Static Architecture)

**Performance Goals**: Formatação instantânea (< 1ms por tecla digitada) sem travamento de cursor

**Constraints**: Sem bibliotecas externas de máscara; compatível com Backspace e colagem da área de transferência

**Scale/Scope**: 3 campos de entrada de telefone na aplicação pública e administrativa

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicidade e Autossuficiência (Zero-Build & Lightweight Architecture)**: **PASS** — Função pura em ES6 nativo sem dependências externas.
- **II. Experiência Mobile-First e Acessibilidade (Mobile-First & Delightful UX)**: **PASS** — Uso de `type="tel"` e `inputmode="tel"` aciona o teclado numérico nativo em celulares.
- **III. Sanitização de Input e Integridade de Dados (Data Integrity & Sanitization)**: **PASS** — Remove caracteres não numéricos (`\D`), remove DDI `55` excedente na colagem e limita a 11 dígitos.
- **IV. Transparência de Regras e Premiação (Fair Play & Transparency)**: **PASS** — Mantém a máscara de privacidade (`maskPhone`) nas listagens.
- **V. Integração Social e Fluxo Descomplicado via WhatsApp (Social Integration)**: **PASS** — Garante números padronizados para disparo de links `wa.me` e `api.whatsapp.com`.

## Project Structure

### Documentation (this feature)

```text
specs/007-mascara-telefone-whatsapp/
├── plan.md              # Plano de implementação
├── research.md          # Decisões técnicas de formatação (Phase 0)
├── data-model.md        # Regras de validação e formato do campo whatsapp (Phase 1)
├── quickstart.md        # Guia de validação rápida (Phase 1)
├── contracts/           # Contrato dos campos de telefone (Phase 1)
│   └── phone-mask-contract.md
└── tasks.md             # Lista de tarefas concluídas
```

### Source Code (repository root)

```text
index.html               # Campos #whatsapp, #manual-whatsapp e #edit-whatsapp com type="tel" e maxlength="15"
js/
├── auth.js              # Funções formatPhoneInput(value) e attachPhoneMask(inputEl)
├── app.js               # Conexão de attachPhoneMask ao formulário público (#whatsapp)
└── admin.js             # Conexão de attachPhoneMask ao cadastro manual (#manual-whatsapp) e modal de edição (#edit-whatsapp)
```

**Structure Decision**: Centralizar `formatPhoneInput` e `attachPhoneMask` junto a `maskPhone` em `js/auth.js` e reutilizar em `js/app.js` e `js/admin.js`.

## Complexity Tracking

Nenhuma violação da Constituição.
