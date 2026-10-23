# Tasks: Blindagem de Segurança, Proteção de Dados e Controle de Acesso

**Branch**: `004-seguranca-e-blindagem` | **Date**: 2026-10-23 | **Spec**: [spec.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/spec.md) | **Plan**: [plan.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/plan.md)

---

## Phase 1: Setup (Shared Security Infrastructure)

**Purpose**: Preparação do ambiente e funções utilitárias compartilhadas de segurança e criptografia.

- [X] T001 Inspecionar configurações de segurança e registrar baseline de regras em `firestore.rules` e `firebase.json`
- [X] T002 [P] Implementar função utilitária criptográfica `computeSha256(str)` usando a Web Crypto API nativa em `js/auth.js`

---

## Phase 2: Foundational (Core Security Utilities & State)

**Purpose**: Estruturas de dados e estados de controle de acesso fundamentais para as histórias de usuário.

- [X] T003 [P] Implementar estrutura de estado `LoginAttemptTracker` (contagem de erros e timestamp de lockout) em `js/auth.js`
- [X] T004 [P] Implementar função utilitária de mascaramento de telefone `maskPhone(phone)` no padrão `(XX) X****-XXXX` em `js/auth.js`

**Checkpoint**: Infraestrutura básica pronta. A implementação das histórias de usuário pode prosseguir de forma independente.

---

## Phase 3: User Story 1 - Blindagem das Regras de Segurança do Cloud Firestore (Priority: P1) 🎯 MVP

**Goal**: Bloquear totalmente a deleção pública de palpites e escritas não autorizadas em `settings` e `draws`, exigindo validação estrita de esquema na criação de palpites no Firestore.

**Independent Test**: Executar chamadas de deleção e gravação não autorizadas a partir do console DevTools e verificar que o Firestore rejeita com erro `PERMISSION_DENIED`, conforme Cenários 1 e 2 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md).

### Implementation for User Story 1

- [X] T005 [US1] Atualizar `firestore.rules` para bloquear deleção pública (`allow delete: if request.auth != null;`) e aplicar validação rígida de esquema na criação de `guesses` (`guestName` [2-100], `gender in ['boy', 'girl']`, `quotasCount >= 1 && <= 100`, `status == 'pending'`, `totalAmount > 0`, rejeitar IDs mock)
- [X] T006 [P] [US1] Atualizar `firestore.rules` para restringir operações de escrita nas coleções `/settings/{settingId}` e `/draws/{drawId}` exclusivamente a usuários autenticados (`request.auth != null`)
- [X] T007 [US1] Ajustar o tratamento de erros em `js/db.js` para capturar falhas de `permission-denied` de forma resiliente, assegurando integridade com o cache local
- [X] T008 [US1] Validar a sintaxe e comportamento das regras do Firestore executando os testes de bloqueio de deleção e injeção de status inválido descritos no Cenário 1 e 2 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md)

**Checkpoint**: Neste ponto, o banco Cloud Firestore está 100% blindado contra deleção maliciosa e adulteração de dados. (MVP Concluído)

---

## Phase 4: User Story 2 - Fortalecimento da Autenticação dos Pais e Proteção Contra Força Bruta (Priority: P2)

**Goal**: Eliminar senhas genéricas hardcoded (`admin123`, `admin`), utilizar hash SHA-256 para verificação da credencial dos pais, bloquear tentativas consecutivas de força bruta (lockout de 5 minutos após 5 erros) e expirar sessões inativas após 30 minutos.

**Independent Test**: Tentar autenticar com senhas antigas e erradas 5 vezes seguidas e confirmar que o sistema bloqueia temporariamente o acesso com cronômetro regressivo, conforme Cenários 3 e 4 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md).

### Implementation for User Story 2

- [X] T009 [US2] Remover senhas padrão em texto claro (`admin123` e `admin`) e eliminar armazenamento de senhas em texto puro de `js/auth.js`
- [X] T010 [US2] Implementar verificação de credencial por hash SHA-256 via `computeSha256()` e suporte à redefinição segura de senha em `js/auth.js`
- [X] T011 [P] [US2] Implementar mecanismo de controle de taxa de erros com lockout temporário de 5 minutos (300.000ms) após 5 tentativas incorretas em `js/auth.js`
- [X] T012 [US2] Implementar controle de expiração automática da sessão administrativa dos pais após 30 minutos de inatividade em `js/auth.js`
- [X] T013 [US2] Atualizar a interface do modal de login administrativo em `js/admin.js` e `index.html` para exibir feedback de bloqueio com contagem regressiva e desabilitar o botão de submissão durante o lockout
- [X] T014 [US2] Validar o fluxo de autenticação segura e a mitigação de força bruta seguindo os passos dos Cenários 3 e 4 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md)

**Checkpoint**: A Área dos Pais está protegida contra adivinhação automatizada e credenciais fracas expostas.

---

## Phase 5: User Story 3 - Proteção de Privacidade dos Participantes e Mascaramento de Dados Sensíveis (Priority: P3)

**Goal**: Garantir que números de WhatsApp dos participantes não sejam expostos publicamente na interface do site (LGPD) e manter sanitização rigorosa contra XSS.

**Independent Test**: Inspecionar os elementos do DOM e requisições públicas de dados para assegurar que números de telefone não são exibidos abertamente para visitantes não autenticados.

### Implementation for User Story 3

- [X] T015 [P] [US3] Aplicar o mascaramento de telefone `maskPhone()` nos pontos de exibição de participantes em `js/admin.js` preservando o link seguro de WhatsApp apenas na visão administrativa
- [X] T016 [US3] Auditar e reforçar a sanitização estrita com `escapeHtml()` em todas as interpolações dinâmicas de nomes e textos em `js/ranking.js` e `js/admin.js`
- [X] T017 [US3] Verificar que o ranking e placar público em `index.html` e `js/ranking.js` exibem apenas `guestName`, `gender` e `quotasCount`, sem vazar contatos de telefone

**Checkpoint**: A privacidade e proteção de dados dos convidados está assegurada em todas as visualizações públicas.

---

## Phase 6: User Story 4 - Proteção Contra Spam no Formulário de Palpites e Headers de Segurança HTTP (Priority: P4)

**Goal**: Adicionar campo invisível anti-robô (honeypot) e cooldown de 8 segundos no formulário de palpites, além de configurar cabeçalhos de segurança HTTP no Firebase Hosting.

**Independent Test**: Simular o preenchimento do campo honeypot no formulário de palpites para confirmar descarte silencioso; testar envios imediatos consecutivos para confirmar cooldown; verificar cabeçalhos HTTP com `curl -I`, conforme Cenários 5, 6 e 7 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md).

### Implementation for User Story 4

- [X] T018 [P] [US4] Adicionar campo honeypot invisível (`#form-website-check`) com atributos de acessibilidade ocultos no formulário `#palpite-form` em `index.html`
- [X] T019 [US4] Implementar interceptação de spambot em `js/app.js` descartando a submissão sem gravar no Firestore caso o campo honeypot esteja preenchido
- [X] T020 [US4] Implementar controle de taxa por cliente com cooldown de 8 segundos entre envios sucessivos em `js/app.js` exibindo alerta informativo
- [X] T021 [P] [US4] Configurar cabeçalhos HTTP de segurança (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`) em `firebase.json`
- [X] T022 [US4] Validar honeypot, cooldown e cabeçalhos de segurança HTTP executando os Cenários 5, 6 e 7 de [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md)

**Checkpoint**: O formulário público está protegido contra spambots automatizados e o hosting está blindado contra Clickjacking e MIME Sniffing.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais integradas, testes de responsividade e deploy em produção.

- [X] T023 [P] Validar ergonomia e responsividade visual dos modais de segurança e alertas em resoluções mobile (360px a 428px) e desktop
- [X] T024 Fazer o deploy das regras do Firestore e configurações de hosting via Firebase CLI (`npx firebase-tools deploy --only firestore:rules,hosting`)
- [X] T025 Executar validação de fumaça na URL de produção (`https://rifa-bolao.web.app`) confirmando envio normal de palpites por convidados legítimos

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências prévias — início imediato.
- **Foundational (Phase 2)**: Depende da Fase 1 — BLOQUEIA a implementação das histórias de usuário.
- **User Story 1 (Phase 3 - P1 / MVP)**: Depende da Fase 2. Foco principal de blindagem do banco de dados.
- **User Story 2 (Phase 4 - P2)**: Depende da Fase 2. Foco no painel e autenticação dos pais.
- **User Story 3 (Phase 5 - P3)**: Depende da Fase 2. Foco na privacidade e proteção contra scraping de telefones.
- **User Story 4 (Phase 6 - P4)**: Depende da Fase 2. Foco no formulário público e cabeçalhos de rede.
- **Polish (Phase 7)**: Depende da conclusão de todas as histórias desejadas antes da entrega final.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Fase 1: Setup (`T001`, `T002`) - [CONCLUÍDO]
2. Concluir Fase 2: Foundational (`T003`, `T004`) - [CONCLUÍDO]
3. Concluir Fase 3: User Story 1 (`T005` a `T008`) - [CONCLUÍDO]
4. **VALIDAÇÃO MVP**: Regras ativas e compiladas sem erros no Cloud Firestore.

### Incremental Delivery

1. Setup + Foundational concluídos.
2. User Story 1 entregue ➔ Banco Cloud Firestore blindado (MVP).
3. User Story 2 entregue ➔ Área dos pais protegida com SHA-256 e lockout anti-força bruta.
4. User Story 3 entregue ➔ Telefones mascarados e privacidade resguardada.
5. User Story 4 entregue ➔ Formulário imune a robôs e cabeçalhos HTTP ativos.
6. Polish e Deploy ➔ Publicação final sincronizada no GitHub e Firebase Hosting com headers e regras ativas.
