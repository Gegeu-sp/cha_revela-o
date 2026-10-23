# Feature Specification: Blindagem de Segurança, Proteção de Dados e Controle de Acesso

**Feature Branch**: `004-seguranca-e-blindagem`

**Created**: 2026-10-23

**Status**: Ready for Planning

**Input**: User description: "fazer toda parte de segurança"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Blindagem das Regras de Segurança do Banco de Dados Cloud Firestore (Priority: P1)

Como organizador do bolão, quero que o banco de dados em nuvem (Cloud Firestore) possua regras estritas de segurança que impeçam qualquer usuário não autenticado ou atacante de deletar palpites, alterar configurações do evento (chave Pix, nomes dos bebês, preços de cotas) ou manipular o histórico de sorteios, permitindo ao público geral apenas a criação de palpites com campos rigorosamente validados e a leitura dos dados essenciais para o placar.

**Why this priority**: É a vulnerabilidade mais crítica do sistema atualmente (`allow delete: if true` e `allow write: if true`), expondo o evento a risco de perda de dados, exclusão maliciosa de apostas e alteração fraudulenta de chave Pix.

**Independent Test**: Tentar executar operações maliciosas a partir do console do navegador ou chamadas diretas ao Firestore (como `deleteDoc` em palpites, sobrescrita em `settings` ou gravação em `draws`), confirmando que o banco rejeita com erro `PERMISSION_DENIED`.

**Acceptance Scenarios**:

1. **Given** um usuário anônimo acessa o site, **When** tenta deletar ou alterar o status de um palpite existente na coleção `guesses`, **Then** o Firestore bloqueia a operação imediatamente com erro de permissão negada.
2. **Given** um usuário anônimo tenta alterar o documento de configuração na coleção `settings` (ex: trocar a chave Pix ou nomes), **When** a solicitação é enviada, **Then** a gravação é terminantemente bloqueada pelo Firestore.
3. **Given** um participante envia um novo palpite pelo formulário público, **When** o documento é submetido para criação, **Then** o Firestore valida que todos os campos obrigatórios estão presentes, que o status inicial é obrigatoriamente `pending`, que o valor de cotas é positivo e que o gênero é estritamente `boy` ou `girl`.
4. **Given** um invasor tenta forjar dados na coleção `draws`, **When** envia um registro de ganhador sem autorização administrativa, **Then** o Firestore rejeita a gravação.

---

### User Story 2 - Fortalecimento da Autenticação dos Pais e Proteção Contra Força Bruta (Priority: P2)

Como pai/mãe ou organizador oficial, quero acessar a Área dos Pais através de um mecanismo de autenticação robusto e protegido, que elimine senhas genéricas expostas em código (como `admin123` e `admin`), utilize verificação criptográfica segura (hash SHA-256), bloqueie tentativas repetidas de adivinhação de senha (proteção contra força bruta) e desconecte a sessão automaticamente após período de inatividade.

**Why this priority**: Impede que convidados ou estranhos descubram senhas fracas pré-configuradas e assumam o controle do painel administrativo, validem palpites falsos ou alterem premiações.

**Independent Test**: Tentar logar com credenciais erradas consecutivamente e verificar o bloqueio temporário (lockout); tentar logar com as senhas padrão anteriores (`admin123`, `admin`) e verificar recusa; autenticar com a credencial segura dos pais e conferir a persistência protegida da sessão.

**Acceptance Scenarios**:

1. **Given** um usuário acessa o modal de login administrativo, **When** digita senhas padrão genéricas anteriores (`admin`, `admin123`), **Then** o sistema rejeita o acesso e exibe mensagem de erro amigável.
2. **Given** um usuário tenta adivinhar a senha errando 5 vezes consecutivas, **When** submete a 5ª tentativa incorreta, **Then** o sistema aplica um bloqueio temporário (lockout de 5 minutos), desabilitando novas tentativas e alertando o usuário.
3. **Given** a senha administrativa é configurada ou verificada, **When** armazenada ou comparada, **Then** utiliza algoritmo criptográfico de hash unidirecional (SHA-256 via Web Crypto API), nunca persistindo senhas em texto puro.
4. **Given** o organizador está autenticado no painel, **When** a aba ou janela permanece inativa por mais de 30 minutos, **Then** a sessão expira com segurança, exigindo reautenticação.

---

### User Story 3 - Proteção de Privacidade dos Participantes e Mascaramento de Dados Sensíveis (Priority: P3)

Como participante do bolão, quero que meus dados pessoais (especialmente número de WhatsApp e comprovantes) não fiquem expostos abertamente para raspadores de dados ou outros visitantes na internet, sendo exibidos na tabela pública apenas com meu nome e palpite, com qualquer referência de contato adequadamente mascarada.

**Why this priority**: Atende às diretrizes de privacidade e proteção de dados (LGPD), assegurando que o chá revelação seja um ambiente seguro para toda a família e amigos convidados.

**Independent Test**: Inspecionar a tabela pública de palpites e o ranking no código-fonte e na rede do navegador, confirmando que números de telefone não são visíveis publicamente de forma desnecessária e que textos exibidos sofrem sanitização estrita contra XSS.

**Acceptance Scenarios**:

1. **Given** qualquer visitante acessa a tabela pública de palpites ou ranking, **When** visualiza as apostas registradas, **Then** apenas o nome do participante, o palpite escolhido e o número de cotas são exibidos, sem revelar números de telefone.
2. **Given** a renderização de nomes de participantes com caracteres especiais ou scripts maliciosos (ex: `<script>`), **When** o sistema desenha a tabela ou ranking no DOM, **Then** todos os textos passam por sanitização rigorosa (`escapeHtml` / `textContent`), neutralizando ataques XSS.

---

### User Story 4 - Proteção Contra Spam no Formulário de Palpites e Headers de Segurança HTTP (Priority: P4)

Como organizador e usuário da plataforma, quero que o formulário de envio de palpites possua mecanismos invisíveis anti-robô (honeypot e limitação de taxa por cliente) e que o site responda com cabeçalhos HTTP de segurança recomendados (CSP, X-Frame-Options, X-Content-Type-Options), protegendo a plataforma contra ataques de injeção, framing (clickjacking) e disparos massivos automatizados.

**Why this priority**: Evita que spammers poluam o bolão com centenas de palpites falsos e blinda a aplicação na camada de transporte web do Firebase Hosting.

**Independent Test**: Tentar preencher o campo oculto honeypot e submeter o formulário (deve falhar silenciosamente sem poluir o banco); testar submissão em rajada consecutiva (deve aplicar rate limit no cliente); verificar os headers de resposta HTTP no Firebase Hosting.

**Acceptance Scenarios**:

1. **Given** um bot automatizado tenta enviar palpites preenchendo todos os campos da página, **When** preenche o campo invisível anti-spam (honeypot), **Then** o sistema ignora a requisição e não grava o documento no banco.
2. **Given** um usuário comum ou script tenta enviar múltiplos palpites em intervalos de segundos, **When** tenta o segundo envio imediato, **Then** o formulário aplica um intervalo de segurança (cooldown de 5 a 10 segundos) com feedback amigável.
3. **Given** o carregamento do site em navegadores modernos, **When** a resposta HTTP do Firebase Hosting é entregue, **Then** inclui cabeçalhos de segurança estritos (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

### Edge Cases

- **O que acontece se o organizador esquecer a nova senha administrativa?** O sistema deve fornecer mecanismo de recuperação ou chave de redefinição de emergência (master reset key) via prompt de segurança ou variáveis locais protegidas.
- **O que acontece se um participante tentar enviar um palpite com nome contendo tags HTML maliciosas ou emojis corrompidos?** A validação sanitiza a entrada no cliente e as regras do Firestore rejeitam strings vazias ou com formato irregular.
- **O que acontece se a conexão com o Firebase Auth ou Firestore falhar?** O sistema degrada graciosamente informando erro de rede com opção de tentar novamente, sem expor dados internos no console.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE atualizar as regras do Cloud Firestore (`firestore.rules`) para bloquear deleção de documentos por usuários públicos em todas as coleções.
- **FR-002**: O sistema DEVE restringir a escrita nas coleções `settings` e `draws` do Firestore exclusivamente a operações autenticadas ou controladas.
- **FR-003**: O sistema DEVE validar o esquema de documentos na criação de `guesses` no Firestore (campos obrigatórios: `guestName`, `gender`, `quotasCount`, `status` igual a 'pending', `totalAmount`).
- **FR-004**: O sistema DEVE remover senhas fracas hardcoded (`admin123` e `admin`) de `js/auth.js`.
- **FR-005**: O sistema DEVE implementar hash criptográfico SHA-256 na validação e armazenamento da credencial dos pais, não salvando senhas em texto claro no `localStorage`.
- **FR-006**: O sistema DEVE implementar proteção de bloqueio temporário (lockout) após 5 tentativas consecutivas de senha incorreta no login administrativo.
- **FR-007**: O sistema DEVE implementar campo anti-robô invisível (honeypot) e controle de taxa de submissão (cooldown) no formulário público de palpites.
- **FR-008**: O sistema DEVE garantir que números de telefone e dados de contato de participantes não sejam expostos publicamente a visitantes não logados.
- **FR-009**: O sistema DEVE adicionar cabeçalhos HTTP de segurança (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) nas configurações de hospedagem do `firebase.json`.
- **FR-010**: O sistema DEVE preservar estritamente a arquitetura Zero-Build e a usabilidade amigável do bolão para os convidados da família.

### Key Entities *(include if feature involves data)*

- **SecurityConfig**: Conjunto de parâmetros de proteção do sistema:
  - `adminPasswordHash`: Hash SHA-256 da senha oficial dos pais.
  - `lockoutThreshold`: Número máximo de tentativas com erro (5 tentativas).
  - `lockoutDurationMs`: Duração do bloqueio temporário (5 minutos = 300.000ms).
  - `submissionCooldownMs`: Tempo mínimo entre envios do mesmo dispositivo (8 segundos).
- **PublicGuessProjection**: Visão pública dos palpites no placar e na tabela (somente `guestName` sanitizado, `gender`, `quotasCount`, `status` e carimbo de tempo), sem expor números de telefone.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de tentativas de deleção não autorizada no Firestore são bloqueadas com erro `PERMISSION_DENIED`.
- **SC-002**: 100% de tentativas de escrita não autorizada em `settings` e `draws` são bloqueadas no banco de dados.
- **SC-003**: 0 ocorrências de senhas em texto puro no código-fonte e no armazenamento local (`localStorage`).
- **SC-004**: 100% dos formulários submetidos com honeypot preenchido são descartados sem criar registros fantasmas no banco.
- **SC-005**: 100% das respostas do Firebase Hosting passam a conter os cabeçalhos de proteção contra Clickjacking (`X-Frame-Options`) e MIME Sniffing (`X-Content-Type-Options`).
- **SC-006**: Zero impacto ou fricção para os convidados legítimos ao enviarem seus palpites e comprovantes via WhatsApp.

## Assumptions

- O bolão continuará funcionando com arquitetura Zero-Build estática no Firebase Hosting com Cloud Firestore.
- A autenticação dos pais continuará acessível de forma rápida e segura através de modal direto, sem exigir que os pais façam login com provedores OAuth de terceiros complexos, garantindo praticidade no momento festivo do chá revelação.
- A senha segura inicial dos pais será configurável ou inicializada com hash seguro, permitindo alteração fácil dentro da Área dos Pais após o primeiro login.
- O mascaramento de privacidade do WhatsApp protege os convidados contra coleta automatizada de números telefônicos.
