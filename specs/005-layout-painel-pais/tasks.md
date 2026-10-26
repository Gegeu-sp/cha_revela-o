# Tasks: Reformulação do Layout e Navegação das Abas do Painel dos Pais

**Feature**: `005-layout-painel-pais` | **Date**: 2026-10-26 | **Spec**: [spec.md](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/specs/005-layout-painel-pais/spec.md) | **Plan**: [plan.md](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/specs/005-layout-painel-pais/plan.md)

---

## Phase 1: Setup

**Purpose**: Preparar utilitários de estilo e base para navegação moderna sem scrollbar nativa

- [X] T001 [P] Adicionar classe utilitária `.no-scrollbar` em `css/animations.css` para permitir rolagem por toque invisível sem barras de rolagem cinzas nativas
- [X] T002 Verificar estrutura do modal `#admin-dashboard-modal` e classes ativas em `index.html`

---

## Phase 2: Foundational (Pré-requisitos Compartilhados)

**Purpose**: Estruturar a barra de controle segmentado antes de atualizar a lógica JavaScript

- [X] T003 Redesenhar o container de abas em `index.html` substituindo o layout antigo com borda inferior pelo container Segmented Control (`bg-slate-200/70 p-1 rounded-2xl flex-nowrap`) conforme [admin-tabs-contract.md](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/specs/005-layout-painel-pais/contracts/admin-tabs-contract.md)

---

## Phase 3: User Story 1 - Navegação por Abas Clara, Ergonômica e 100% Visível (Priority: P1) 🎯 MVP

**Goal**: Transformar os botões de abas em pílulas isoladas com cantos arredondados, eliminando todas as linhas cinzas de corte e garantindo visibilidade total para todas as 4 abas (`Palpites & Pix`, `Nomes & Configurações`, `Adicionar Manual` e `Sorteio do Bolão`).

**Independent Test**: Abrir o Painel dos Pais, verificar que nenhuma linha cinza atravessa o texto das abas e alternar entre cada uma das 4 abas conferindo que o destaque branco da pílula ativa acompanha a seleção.

- [X] T004 [US1] Atualizar marcação dos 4 botões de abas (`#tab-btn-palpites`, `#tab-btn-config`, `#tab-btn-manual`, `#tab-btn-sorteio`) em `index.html` com o estilo pílula arredondada (`rounded-xl px-4 py-2 font-semibold whitespace-nowrap`)
- [X] T005 [US1] Atualizar a função `switchAdminTab(targetTab)` em `js/admin.js` para alternar perfeitamente as classes de estado ativo (`bg-white text-[#3B0069] shadow-xs font-bold`) e inativo (`text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold`)
- [X] T006 [US1] Sincronizar atributos de acessibilidade (`role="tab"`, `aria-selected`) e classes de foco em `js/admin.js`

**Checkpoint**: Todas as 4 abas estão 100% legíveis, sem recortes de borda e com resposta visual instantânea.

---

## Phase 4: User Story 2 - Harmonização do Cabeçalho e Ações do Painel (Priority: P2)

**Goal**: Limpar o topo do modal removendo o botão redundante de atalho para Sorteio e organizando o título, contador de pendências, status da nuvem e botão sair/fechar.

**Independent Test**: Conferir o topo do modal em telas desktop e mobile, garantindo alinhamento vertical limpo sem quebras feias de linha.

- [X] T007 [US2] Remover o botão redundante de atalho `#btn-quick-raffle` do cabeçalho em `index.html`, direcionando o fluxo do sorteio exclusivamente para a aba de primeiro nível "Sorteio do Bolão"
- [X] T008 [US2] Harmonizar o espaçamento do badge de nuvem, botão sair e botão de fechar (`items-center gap-2`) no cabeçalho em `index.html`
- [X] T009 [US2] Ajustar o listener de `#btn-quick-raffle` em `js/admin.js` para garantir compatibilidade caso o botão não esteja no DOM

---

## Phase 5: User Story 3 - Respiração Visual e Enquadramento do Conteúdo Interno (Priority: P3)

**Goal**: Ajustar o espaçamento interno superior de cada painel de conteúdo (`.admin-tab-pane`), evitando que o conteúdo cole na barra de abas ou sofra compressão pela barra de rolagem.

**Independent Test**: Rolar o modal verticalmente e confirmar que a barra de navegação fica fixa com respiro confortável e sem corte na aba da direita.

- [X] T010 [US3] Adicionar padding superior de respiro (`pt-4 sm:pt-6`) e espaçamento refinado nos containers de conteúdo em `index.html`
- [X] T011 [US3] Garantir que o container de abas utilize `overflow-x-auto no-scrollbar` com margem à direita para que "Sorteio do Bolão" nunca encoste na barra de rolagem vertical

---

## Phase 6: Polish & Deploy Validation

**Purpose**: Testes finais, validação de cenários do quickstart e deploy em produção

- [X] T012 Validar cenários do [quickstart.md](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/specs/005-layout-painel-pais/quickstart.md) em resoluções Desktop e Mobile
- [X] T013 Publicar as alterações no Firebase Hosting (`firebase deploy --only hosting`) e sincronizar com o GitHub (`git commit` e `git push`)
