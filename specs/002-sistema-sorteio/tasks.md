# Tasks: Sistema de Sorteio do Bolão, Título Oficial e Créditos de Autoria

**Feature Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização e estrutura de módulos para o sorteio e novas configurações

- [X] T001 Criar módulo `js/raffle.js` com exportações base para a urna virtual e motor de sorteio
- [X] T002 Atualizar importações modulares em `js/app.js` e `js/admin.js` para integrar o novo serviço de sorteio

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de dados, reatividade e animações necessárias para suportar as histórias de usuário

⚠️ **CRITICAL**: Nenhuma história de usuário do sorteio pode ser implementada sem a conclusão desta fase

- [X] T003 [P] Implementar persistência de sorteios em `js/db.js` com funções `saveDraw`, `getDrawHistory`, `resetDrawHistory` e sincronização realtime `subscribeToDraws` no Firestore e LocalStorage
- [X] T004 [P] Atualizar store reativo em `js/state.js` para registrar lista de sorteios realizados e expor contadores no estado computado
- [X] T005 [P] Adicionar estilos e animações CSS da roleta de suspense, pulso do vencedor e desfoque em `css/animations.css`

**Checkpoint**: Camada de dados e animações pronta - implementação das histórias de usuário desbloqueada

---

## Phase 3: User Story 1 - Realização do Sorteio Festivo com Animação e Revelação do Ganhador (Priority: P1) 🎯 MVP

**Goal**: Permitir ao organizador configurar parâmetros do sorteio, rodar a roleta com suspense de 3-5s, disparar confetes e revelar o ganhador com botão direto para WhatsApp

**Independent Test**: Com ao menos 2 palpites confirmados, abrir o painel de sorteio, selecionar o modo "Todos os Confirmados", clicar em "Sortear Agora", aguardar a desaceleração da roleta e verificar o vencedor e o botão de WhatsApp

- [X] T006 [P] [US1] Implementar algoritmo de urna ponderada por cotas `buildRaffleTickets()` e amostragem aleatória segura `selectWinningTicket()` com suporte a filtros em `js/raffle.js`
- [X] T007 [P] [US1] Implementar gerador de link direto para WhatsApp `createWhatsAppCelebrationLink()` com mensagem de felicitações personalizada em `js/raffle.js`
- [X] T008 [US1] Adicionar interface do Sorteio (aba/seletor de modalidade, visor da roleta animada e Cartão do Vencedor) no painel administrativo em `index.html`
- [X] T009 [US1] Integrar controlador da roleta com desaceleração exponencial em 3-5s, efeito sonoro/visual, disparo de confetes via `canvas-confetti` e persistência do ganhador em `js/admin.js`
- [X] T010 [US1] Adicionar botão de atalho e navegação para a tela de Sorteio no cabeçalho do Painel dos Pais em `index.html` e `js/admin.js`

**Checkpoint**: User Story 1 funcional e testável como MVP completo do sorteio

---

## Phase 4: User Story 2 - Histórico e Auditoria dos Sorteios Realizados (Priority: P2)

**Goal**: Garantir transparência registrando cada vencedor sorteado com data, hora e modalidade, permitindo consultar ganhadores anteriores e evitar sorteios duplicados

**Independent Test**: Concluir um sorteio, recarregar a página e confirmar que o histórico mantém o vencedor registrado e que novo sorteio desconsidera o ganhador anterior quando ativado o filtro

- [X] T011 [P] [US2] Criar visualização de histórico de sorteios realizados na interface do painel em `index.html`
- [X] T012 [US2] Implementar renderização reativa do histórico de ganhadores com carimbo de data/hora e atalho de WhatsApp em `js/admin.js`
- [X] T013 [US2] Implementar filtro de exclusão de ganhadores anteriores (`excludePreviousWinners`) na montagem da urna e botão de confirmação para zerar histórico de testes em `js/admin.js`

**Checkpoint**: Histórico e auditoria de sorteios totalmente operacionais e persistentes

---

## Phase 5: User Story 3 - Atualização do Título Principal da Página Hero (Priority: P3)

**Goal**: Atualizar a frase de destaque principal no Hero para "Qual é o seu palpite para o nosso bebê?", integrando o visual acolhedor e responsivo

**Independent Test**: Abrir a página inicial em celular e desktop e validar visualmente o título "Qual é o seu palpite para o nosso bebê?" com gradiente estilizado

- [X] T014 [P] [US3] Atualizar o elemento `h2#hero-title` em `index.html` para "Qual é o seu palpite para o <span class='text-palette-gradient'>nosso bebê?</span>"
- [X] T015 [P] [US3] Atualizar a tag `<title>`, meta description em `index.html` e a propriedade `title` em `js/config.js`
- [X] T016 [US3] Validar e ajustar o enquadramento responsivo e quebra de linha do novo título em resoluções de 320px a 1920px em `index.html`

**Checkpoint**: Título oficial atualizado perfeitamente em todas as telas

---

## Phase 6: User Story 4 - Identificação Explícita do Criador e Autor Argeu Rodrigues (Priority: P4)

**Goal**: Inserir a atribuição permanente de criador e autor Argeu Rodrigues no rodapé e metadados do projeto

**Independent Test**: Rolar até o rodapé da página inicial e verificar a presença destacada do texto "Criador e Autor: Argeu Rodrigues" e a meta tag correspondente no `<head>`

- [X] T017 [P] [US4] Adicionar a tag `<meta name="author" content="Argeu Rodrigues">` no cabeçalho `<head>` de `index.html`
- [X] T018 [US4] Atualizar o rodapé (`<footer>`) em `index.html` exibindo o crédito oficial "Criador e Autor: Argeu Rodrigues" com badge estilizado e harmonioso

**Checkpoint**: Créditos de autoria visíveis, elegantes e sem quebras de layout

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Segurança contra XSS, sanitização e validação ponta a ponta

- [X] T019 [P] Aplicar sanitização `escapeHtml` em todos os campos de exibição de nomes e notas do sorteio em `js/raffle.js` e `js/admin.js`
- [X] T020 Executar checklist de validação rápida do arquivo `specs/002-sistema-sorteio/quickstart.md` confirmando funcionamento integrado de todas as histórias

---

## Phase 8: User Story 5 - Integração do QR Code Pix Oficial InfinitePay (Priority: P1)

**Goal**: Inserir o QR Code oficial de pagamento Pix e o código Copia e Cola fornecido pelo organizador Argeu Rodrigues Pinto Fil, permitindo que os convidados escaneiem facilmente com a câmera do banco ou copiem o código Pix no celular

**Independent Test**: Acessar a seção de pagamento Pix, validar a renderização nítida do QR Code da InfinitePay, escanear com app bancário, e testar os botões de 1 clique para "Copiar Chave Pix" e "Copiar Código Pix Copia e Cola"

- [X] T021 [P] [US5] Gerar e otimizar a imagem do QR Code oficial em `assets/pix-qrcode.png` e atualizar configurações padrão em `js/config.js` e `js/db.js`
- [X] T022 [US5] Atualizar a seção `#pix-section` em `index.html` com apresentação visual de alto padrão, dados do titular Argeu Rodrigues Pinto Fil, instituição InfinitePay, e modal de ampliação
- [X] T023 [US5] Implementar helpers de cópia rápida do Pix Copia e Cola e Chave Pix com notificações toast e modal de visualização em `js/app.js` e `js/admin.js`
- [X] T024 [US5] Validar escaneamento do QR Code e cópia do código em desktop e mobile

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — execução imediata.
- **Foundational (Phase 2)**: Depende do Setup — bloqueia todas as histórias de usuário.
- **User Stories (Phases 3 a 6)**:
  - User Story 1 (P1): Depende da Fundação. Entrega o MVP.
  - User Story 2 (P2): Depende de US1 (exibe os vencedores gerados por US1).
  - User Story 3 (P3): Independente, pode ser executada em paralelo após Setup.
  - User Story 4 (P4): Independente, pode ser executada em paralelo após Setup.
- **Polish (Phase 7)**: Depende da implementação de todas as histórias.

### Parallel Opportunities

- `T003`, `T004`, `T005` podem ser executados em paralelo durante a Fundação.
- `T006`, `T007` podem ser desenvolvidos em paralelo no módulo `js/raffle.js`.
- `T014`, `T015`, `T017` podem ser executados em paralelo com as tarefas de interface.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Concluir Setup (T001, T002)
2. Concluir Foundational (T003 - T005)
3. Concluir User Story 1 (T006 - T010)
4. **Validar MVP**: Realizar sorteio demonstrativo com confetes e WhatsApp.

### Entrega Incremental
1. Base pronta + MVP de Sorteio
2. Adicionar Histórico e Auditoria (US2)
3. Atualizar Título Oficial (US3)
4. Inserir Crédito de Argeu Rodrigues (US4)
5. Revisão final e validação de segurança (Phase 7)
