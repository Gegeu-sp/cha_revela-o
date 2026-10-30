# Implementation Plan: Correção do Registro de Palpite Manual e Suporte a Valor Personalizado

**Branch**: `006-palpite-manual-valor` | **Date**: 2026-10-30 | **Spec**: [spec.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/006-palpite-manual-valor/spec.md)

**Input**: Feature specification from `/specs/006-palpite-manual-valor/spec.md`

## Summary

Corrigir a falha de persistência e exibição do formulário administrativo "Adicionar Palpite Manual" e adicionar suporte completo a valores monetários personalizados ("outro valor") tanto no cadastro manual quanto no modal de edição de palpites. A abordagem técnica combina:
1. Criação em duas etapas compatível com regras de segurança do Firestore (`addDoc` com `status: 'pending'` seguido imediatamente por `setDoc` com `status: 'confirmed'`) e atualização das regras em `firestore.rules`.
2. Atualização otimista imediata de `cachedGuesses`, `localStorage` e listeners da UI em `js/db.js`, além de preservação de itens locais (`local_`) durante `onSnapshot`.
3. Inclusão do campo editável `Valor Total Pago (R$)` (`#manual-total-amount` e `#edit-total-amount`) em `index.html` e `js/admin.js`, respeitando `totalAmount` personalizado na camada de banco (`js/db.js`).
4. Redirecionamento automático para a aba `Palpites & Pix` com redefinição do filtro ativo para `Todos` quando necessário.

## Technical Context

**Language/Version**: HTML5, CSS3 (Tailwind CSS CDN), JavaScript ES6+ Modules

**Primary Dependencies**: Firebase JS SDK v10.13.0 (Cloud Firestore), Font Awesome 6.5.1, Canvas Confetti

**Storage**: Cloud Firestore (`guesses`, `settings`, `draws`) + `localStorage` (`bolao_guesses`, `bolao_event_settings`, `bolao_draws`)

**Testing**: Validação sintática e funcional automatizada via Node.js ES Modules + verificação em produção no Firebase Hosting

**Target Platform**: Web Mobile-First (iOS Safari, Android Chrome) e Desktop Browsers via Firebase Hosting (`https://rifa-bolao.web.app`)

**Project Type**: Single-Page Web Application (Zero-Build Static Architecture)

**Performance Goals**: Atualização instantânea (< 100ms) da tabela de registros e placar público após submissão manual

**Constraints**: Arquitetura Zero-Build (sem bundlers complexos), compatibilidade total com regras de segurança do Firestore em produção

**Scale/Scope**: Centenas de palpites simultâneos em tempo real para o evento de Chá Revelação

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicidade e Autossuficiência (Zero-Build & Lightweight Architecture)**: **PASS** — Mantém módulos ES6 nativos sem etapa de compilação.
- **II. Experiência Mobile-First e Acessibilidade (Mobile-First & Delightful UX)**: **PASS** — Campos numéricos com `step="0.01"`, feedback de carregamento no botão e redirecionamento automático para a lista de registros.
- **III. Sanitização de Input e Integridade de Dados (Data Integrity & Sanitization)**: **PASS** — Valida nome (`>= 2` caracteres), cotas (`1..100`), valor monetário estritamente positivo (`>= 0.01`) e escape de HTML na renderização.
- **IV. Transparência de Regras e Premiação (Fair Play & Transparency)**: **PASS** — Registra o valor exato contribuído por cada participante e reflete fielmente no Total Arrecadado, Prêmio Estimado e Ranking.
- **V. Integração Social e Fluxo Descomplicado via WhatsApp (Social Integration)**: **PASS** — Preserva links diretos de WhatsApp na listagem administrativa e no sorteio.

## Project Structure

### Documentation (this feature)

```text
specs/006-palpite-manual-valor/
├── plan.md              # Plano de implementação
├── research.md          # Pesquisa e decisões técnicas (Phase 0)
├── data-model.md        # Modelo de dados atualizado (Phase 1)
├── quickstart.md        # Guia de validação rápida (Phase 1)
├── contracts/           # Contratos de UI e persistência (Phase 1)
│   └── manual-guess-ui-contract.md
└── tasks.md             # Tarefas executadas e verificadas
```

### Source Code (repository root)

```text
index.html               # Interface principal, Aba Adicionar Manual e Modal Editar Palpite
firestore.rules          # Regras de segurança do Cloud Firestore
firebase.json            # Configuração de deploy do Firebase Hosting + Firestore
js/
├── app.js               # Orquestrador principal e visualização pública
├── admin.js             # Controlador do Painel dos Pais (cadastro manual, edição e filtros)
├── db.js                # Persistência híbrida Firestore + LocalStorage
├── state.js             # Store reativo e cálculos financeiros (Total Arrecadado / Prêmio)
├── ranking.js           # Placar Menino vs Menina e Top Contribuidores
├── raffle.js            # Motor de sorteio ponderado por cotas
├── auth.js              # Autenticação administrativa e proteção por hash
├── config.js            # Configurações padrão e credenciais Firebase
└── countdown.js         # Contagem regressiva do evento
```

**Structure Decision**: Mantida a estrutura enxuta Zero-Build na raiz do repositório, alterando diretamente `firestore.rules`, `index.html`, `js/db.js` e `js/admin.js`.

## Complexity Tracking

Nenhuma violação da Constituição.
