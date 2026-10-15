# Tasks: Gestão Completa de Rifa e Bolão com Painel Administrativo

**Feature**: `001-rifa-bolao-admin` | **Branch**: `001-rifa-bolao-admin` | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação da estrutura de pastas, estilos e inclusão de dependências leves via CDN.

- [X] T001 Criar diretórios de código fonte `js/` e `css/` conforme o plano de implementação
- [X] T002 [P] Adicionar scripts CDN do Firebase v10 Modular e Canvas Confetti no cabeçalho de `index.html`
- [X] T003 [P] Criar folha de estilos `css/animations.css` com estilos para barras de progresso animadas, modais e efeitos de destaque

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de dados, autenticação e gerenciamento de estado que bloqueia todas as User Stories.

**⚠️ CRITICAL**: Nenhuma User Story pode ser iniciada antes da conclusão desta fase.

- [X] T004 Implementar configuração do Firebase e detector de modo demonstração (fallback LocalStorage) em `js/config.js`
- [X] T005 Implementar camada de dados com operações do Firestore e adapter de persistência local em `js/db.js`
- [X] T006 [P] Implementar serviço de autenticação do administrador (login por e-mail/senha e observador de sessão) em `js/auth.js`
- [X] T007 [P] Implementar store de estado reativo e cálculos de cotas, percentuais e arrecadação em `js/state.js`

**Checkpoint**: Fundação pronta - a implementação das User Stories pode prosseguir.

---

## Phase 3: User Story 1 - Validação e Gestão de Pagamentos pelo Administrador (Priority: P1) 🎯 MVP

**Goal**: Permitir que os pais realizem login com e-mail/senha, visualizem a lista de palpites pendentes, confirmem pagamentos via Pix, editem registros incorretos e adicionem palpites manuais.

**Independent Test**: Realizar login no painel administrativo, confirmar um palpite com status "Aguardando Pix" e verificar se o status muda para "Confirmado" e o total arrecadado é recalculado.

### Implementation for User Story 1

- [X] T008 [P] [US1] Criar modal de login do administrador com campos de e-mail e senha e botão de gatilho discreto em `index.html`
- [X] T009 [P] [US1] Criar estrutura visual do painel administrativo com abas e tabela de gestão de palpites em `index.html`
- [X] T010 [US1] Implementar controlador de login, logout e visibilidade do painel administrativo em `js/admin.js`
- [X] T011 [US1] Implementar ação de confirmação de pagamento (`confirmGuessPayment`) alterando status de `"pending"` para `"confirmed"` em `js/admin.js`
- [X] T012 [US1] Implementar modal de edição de palpites e exclusão de registros (`editGuess`, `cancelOrDeleteGuess`) em `js/admin.js`
- [X] T013 [US1] Implementar formulário para adição manual de palpites pagos em dinheiro (`addManualGuess`) em `js/admin.js`

**Checkpoint**: User Story 1 (MVP) 100% funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Configuração Personalizável do Evento (Priority: P2)

**Goal**: Permitir que os pais configurem o valor unitário da cota da rifa, data prevista de nascimento, chave Pix, titular e percentuais de premiação, com exibição de contagem regressiva na interface pública.

**Independent Test**: Alterar o valor da cota para R$ 20,00 e a data prevista de nascimento nas configurações e verificar se a página pública reflete imediatamente o novo valor e o contador regressivo.

### Implementation for User Story 2

- [X] T014 [P] [US2] Adicionar aba de configurações do evento no painel com formulário para cota, data prevista, chave Pix e premiação em `index.html`
- [X] T015 [US2] Implementar função de salvar e carregar configurações (`updateEventConfig`) com validação de dados em `js/admin.js`
- [X] T016 [P] [US2] Implementar componente de contagem regressiva (`initCountdown`) calculando dias, horas e minutos até o nascimento em `js/countdown.js`
- [X] T017 [US2] Integrar exibição dinâmica das configurações (valor da cota atualizado, botão de cópia Pix e contador) na página principal em `index.html`

**Checkpoint**: User Stories 1 e 2 funcionando de forma integrada e independente.

---

## Phase 5: User Story 3 - Participação na Rifa com Seleção de Múltiplas Cotas (Priority: P3)

**Goal**: Permitir que os convidados escolham a quantidade de cotas desejadas na rifa, vejam o cálculo automático do valor devido, submetam o voto e abram o WhatsApp com a mensagem formatada para envio do comprovante.

**Independent Test**: Selecionar 3 cotas a R$ 20,00 no formulário, submeter e verificar o registro na tabela com status "Aguardando Pix" e o link de WhatsApp formatado para R$ 60,00.

### Implementation for User Story 3

- [X] T018 [P] [US3] Atualizar formulário público de palpite com seletor de cotas (1, 2, 3, 5 ou personalizada) e cálculo de valor total em `index.html`
- [X] T019 [US3] Implementar envio de palpites (`submitGuestGuess`) com sanitização XSS e criação com status `"pending"` em `js/app.js`
- [X] T020 [US3] Implementar gerador de link para WhatsApp (`generateWhatsAppProofUrl`) com dados completos do comprovante em `js/app.js`
- [X] T021 [US3] Atualizar tabela pública para exibir número de cotas e distintivos visuais de status ("Aguardando Pix" vs "Confirmado") em `index.html`

**Checkpoint**: User Stories 1, 2 e 3 operando de ponta a ponta.

---

## Phase 6: User Story 4 - Placar Animado e Ranking de Palpites (Priority: P4)

**Goal**: Proporcionar aos convidados um placar vibrante e animado da disputa Menino vs Menina com percentuais em tempo real, animações a 60 FPS e efeitos de celebração.

**Independent Test**: Confirmar um palpite pendente e observar a barra de porcentagem do placar se mover suavemente com efeito festivo de confetes.

### Implementation for User Story 4

- [X] T022 [P] [US4] Criar componente visual do placar da disputa (barras comparativas azul/rosa, percentuais e contadores) em `index.html`
- [X] T023 [US4] Implementar controlador de animação e recálculo do placar (`updateScoreboard`) com transições CSS fluidas em `js/ranking.js`
- [X] T024 [US4] Integrar disparador de efeitos festivos de confete (`triggerCelebration`) ao confirmar pagamentos em `js/ranking.js`
- [X] T025 [US4] Implementar destaques visuais para os maiores contribuidores e últimos palpites confirmados em `js/ranking.js`

**Checkpoint**: Todas as User Stories 1 a 4 completamente funcionais.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Integração final, polimento visual, segurança e validação ponta a ponta.

- [X] T026 [P] Orquestrar inicialização unificada e listeners reativos em tempo real em `js/app.js`
- [X] T027 [P] Realizar auditoria de sanitização XSS e refinamento de responsividade mobile (360px a 1080px) em `index.html` e `css/animations.css`
- [X] T028 Executar os 6 cenários de validação do arquivo `specs/001-rifa-bolao-admin/quickstart.md` para homologação final

---

## Phase 8: Paleta Personalizada, Sincronização em Nuvem e Enquadramento (Novos Requisitos)

**Purpose**: Aplicar a paleta de 6 cores em anexo, habilitar sincronização em tempo real entre dispositivos via Firebase e aperfeiçoar o enquadramento mobile e web.

- [X] T029 Configurar credenciais oficiais do Firebase Web SDK em `js/config.js` e habilitar regras/persistência em nuvem
- [X] T030 [P] Aplicar a nova paleta de cores (#3B0069, #8F56AD, #BE9ECF, #CEE1DF, #689D97, #03665A) no tema Tailwind e em `css/animations.css`
- [X] T031 [P] Refinar o enquadramento responsivo em `index.html` (containers limitados, tabela com scroll autocontido, modais e botões com área de toque de 44px)
- [X] T032 Adicionar badge visual de status de sincronização (Nuvem Ativa / Local) na interface
- [X] T033 Realizar testes E2E dos cenários 7 e 8 do `quickstart.md`
- [X] T034 Comitar e sincronizar alterações no repositório GitHub (`git push origin main`)
- [X] T035 Publicar em produção no Firebase Hosting (`firebase deploy --only hosting`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - inicia imediatamente.
- **Foundational (Phase 2)**: Depende da Phase 1 - BLOQUEIA todas as User Stories.
- **User Stories (Phase 3+)**: Dependem da Phase 2 concluída.
  - Sequência recomendada por prioridade: US1 (P1 - MVP) ➔ US2 (P2) ➔ US3 (P3) ➔ US4 (P4).
- **Polish (Phase 7)**: Depende da conclusão de todas as User Stories desejadas.

### User Story Dependencies

- **User Story 1 (P1)**: Depende apenas da Phase 2 (Foundational). Pode ser entregue isoladamente como MVP.
- **User Story 2 (P2)**: Depende da Phase 2. Integra-se com o painel da US1.
- **User Story 3 (P3)**: Depende da Phase 2 e consome as configurações da US2.
- **User Story 4 (P4)**: Depende da Phase 2 e consome os dados confirmados pela US1 e US3.

---

## Parallel Opportunities

- **Na Phase 1**: T002 e T003 podem ser executados em paralelo.
- **Na Phase 2**: T006 e T007 podem ser implementados em paralelo após T004 e T005.
- **Na Phase 3 (US1)**: T008 e T009 (marcação HTML) podem ser construídos em paralelo antes da lógica em `admin.js`.
- **Na Phase 4 (US2)**: T014 (HTML) e T016 (`countdown.js`) são independentes e paralelos.
- **Na Phase 5 (US3)**: T018 (HTML) pode ser criado em paralelo com T020 (`app.js`).
- **Na Phase 6 (US4)**: T022 (HTML) pode ser criado em paralelo com a lógica de `ranking.js`.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Completar Phase 1 (Setup) e Phase 2 (Foundational).
2. Implementar Phase 3 (User Story 1 - Painel Administrativo e Aprovação de Pagamentos).
3. **Validar MVP**: Os pais conseguem autenticar e confirmar palpites com total controle.

### Incremental Delivery
1. **Incremento 1 (MVP)**: Painel de gestão e aprovação de Pix (US1).
2. **Incremento 2**: Configuração flexível de cotas, chave Pix e data prevista com contagem regressiva (US2).
3. **Incremento 3**: Participação dos convidados com múltiplas cotas da rifa e mensagem no WhatsApp (US3).
4. **Incremento 4**: Placar interativo animado e efeitos visuais comemorativos (US4).
5. **Polimento**: Validação final de ponta a ponta via `quickstart.md`.
