# Tasks: Substituição de Ícones de Gênero (Barra de Peso e Boneca) e Alinhamento Visual Responsivo

**Feature Branch**: `003-icones-e-alinhamento` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação do ambiente e alinhamento de tokens visuais

- [X] T001 Mapear tokens canônicos de ícones (`🏋️` e `🪆`) e tags de gênero em `specs/003-icones-e-alinhamento/contracts/ui-alignment-tokens.md`
- [X] T002 [P] Adicionar classes utilitárias de alinhamento ortogonal (0deg) e baseline de texto com ícones em `css/animations.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura base de estilo e classes utilitárias que bloqueiam a estilização e substituição das histórias de usuário

⚠️ **CRITICAL**: A substituição e o alinhamento visual dependem da garantia de retidão e classes flexíveis padronizadas

- [X] T003 [P] Garantir reset global de ângulo ortogonal (0deg, sem skew ou rotações indesejadas) em `css/animations.css`
- [X] T004 [P] Criar classes utilitárias para centralização vertical harmoniosa de ícones e tipografia (`inline-flex items-center`) em `css/animations.css`

**Checkpoint**: Camada base de estilos e regras ortogonais pronta - implementação das histórias de usuário desbloqueada

---

## Phase 3: User Story 1 - Substituição Global de Ícones de Gênero (Priority: P1) 🎯 MVP

**Goal**: Substituir todas as ocorrências de 🌿 e 🌸 por barra de peso (`🏋️`) e boneca (`🪆`) em todos os componentes estáticos do DOM, templates de script, dropdowns e mensagens do WhatsApp

**Independent Test**: Navegar por todas as seções (cabeçalho, placar, formulário, painel administrativo, roleta de sorteio, ranking e mensagens geradas) e comprovar visualmente que nenhuma ocorrência de 🌿 ou 🌸 permanece visível, tendo sido 100% substituídas por 🏋️ e 🪆

- [X] T005 [P] [US1] Substituir ícones 🌿 e 🌸 por 🏋️ e 🪆 no cabeçalho e na logo principal em `index.html`
- [X] T006 [P] [US1] Substituir ícones 🌿 e 🌸 por 🏋️ e 🪆 nos cartões do Time Menino e Time Menina na seção Placar da Disputa em `index.html`
- [X] T007 [P] [US1] Substituir ícones 🌿 e 🌸 por 🏋️ e 🪆 nos botões de seleção de palpite do formulário oficial em `index.html`
- [X] T008 [P] [US1] Substituir ícones 🌿 e 🌸 por 🏋️ e 🪆 nos rótulos de configuração e nas opções `<option>` de todos os seletores dropdown da Área dos Pais em `index.html`
- [X] T009 [P] [US1] Atualizar badges de gênero na tabela de palpites e identificadores de voto da Área dos Pais em `js/admin.js`
- [X] T010 [P] [US1] Atualizar texto da mensagem de confirmação de palpite codificada para envio no WhatsApp em `js/app.js`
- [X] T011 [P] [US1] Atualizar identificação de voto do ganhador e mensagens festivas do módulo de sorteio em `js/raffle.js`
- [X] T012 [P] [US1] Atualizar avisos de liderança e linhas de colaboradores no ranking em `js/ranking.js`

**Checkpoint**: User Story 1 completa e testável como MVP - 100% dos ícones substituídos em toda a aplicação

---

## Phase 4: User Story 2 - Alinhamento Visual, Retidão e Harmonia Tipográfica em Web e Mobile (Priority: P2)

**Goal**: Ajustar o enquadramento, ângulo da página (0deg) e alinhamento das letras e ícones tanto no navegador desktop quanto em smartphones, eliminando quebras tortas ou overflow

**Independent Test**: Inspecionar a interface em resoluções mobile (360px a 428px) e desktop (1024px+), verificando que o cabeçalho dos bebês não quebra de forma assimétrica, os cartões de voto e placar têm alturas equivalentes e todos os textos estão centrados e nivelados

- [X] T013 [P] [US2] Ajustar o alinhamento flexível e contenção responsiva do container `#hero-baby-names` no cabeçalho em `index.html`
- [X] T014 [P] [US2] Equalizar a altura, simetria e alinhamento vertical dos cartões de Menino e Menina no Placar da Disputa em `index.html`
- [X] T015 [P] [US2] Padronizar altura mínima, centralização de texto e espaçamento uniforme dos botões de palpite do formulário em `index.html`
- [X] T016 [US2] Validar e refinar o alinhamento de títulos, subtítulos e badges garantindo ângulo reto e harmonia visual em `index.html` e `css/animations.css`

**Checkpoint**: Alinhamento ortogonal e tipográfico impecável em todos os dispositivos móveis e desktops

---

## Phase 5: User Story 3 - Preservação Cirúrgica das Regras e Operações Existentes (Priority: P3)

**Goal**: Assegurar que as chaves de banco de dados (`boy`, `girl`), o cálculo de cotas, a validação de pagamentos Pix e o motor do sorteio ponderado permaneçam intactos sem qualquer regressão funcional

**Independent Test**: Realizar uma aposta de teste, verificar o cálculo dinâmico do valor das cotas e checar se o console do navegador permanece livre de erros

- [X] T017 [US3] Validar que as chaves canônicas de dados (`boy` e `girl`) continuam operando perfeitamente nas funções de submissão em `js/app.js` e `js/db.js`
- [X] T018 [US3] Validar que as rotinas de cálculo de percentual, contagem de cotas e sorteio operam normalmente em `js/raffle.js` e `js/admin.js`

**Checkpoint**: Todas as operações funcionais preservadas com zero impacto ou regressão

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de limpeza, integridade de código e validação ponta a ponta

- [X] T019 [P] Executar busca automatizada via ripgrep para assegurar zero ocorrências residuais de `🌿` ou `🌸` em `index.html` e na pasta `js/`
- [X] T020 Executar os cenários do guia de validação rápida em `specs/003-icones-e-alinhamento/quickstart.md` confirmando excelência visual

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - inicia imediatamente
- **Foundational (Phase 2)**: Depende do Setup - bloqueia as histórias de usuário
- **User Story 1 (Phase 3)**: Depende da Fase Foundational - constitui o MVP principal
- **User Story 2 (Phase 4)**: Depende da Fase Foundational e pode ser implementada em paralelo com US1
- **User Story 3 (Phase 5)**: Depende da conclusão de US1 e US2 para validação de integridade
- **Polish (Phase 6)**: Depende de todas as histórias concluídas

### Parallel Opportunities

- `T005`, `T006`, `T007`, `T008` (edits em blocos distintos de `index.html`) podem ser agrupados harmonicamente
- `T009` (`js/admin.js`), `T010` (`js/app.js`), `T011` (`js/raffle.js`) e `T012` (`js/ranking.js`) são em arquivos completamente independentes e podem ser executados em paralelo [P]
- `T013`, `T014`, `T015` representam ajustes de simetria e alinhamento em componentes específicos

---

## Implementation Strategy

### MVP First (User Story 1)
1. Completar Setup e Foundational (T001-T004)
2. Completar User Story 1 (T005-T012)
3. **VALIDAR MVP**: Verificar que todos os ícones foram substituídos por 🏋️ e 🪆
4. Aplicar User Story 2 (T013-T016): Alinhamento e retidão responsiva
5. Validar integridade e ausência de regressões (T017-T020)
