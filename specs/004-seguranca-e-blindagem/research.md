# Research: Blindagem de Segurança, Proteção de Dados e Controle de Acesso

**Feature Branch**: `004-seguranca-e-blindagem`  
**Date**: 2026-10-23  
**Status**: Completed  

---

## 1. Firestore Security Rules Hardening

### Context & Problem
Na versão anterior, `firestore.rules` possuía regras excessivamente permissivas:
- `allow read, delete: if true;` na coleção `/guesses/{guessId}` permitia que qualquer visitante ou script malicioso deletasse todos os palpites dos participantes diretamente pelo console do navegador.
- `allow read, write: if true;` nas coleções `/settings/{settingId}` e `/draws/{drawId}` permitia que terceiros alterassem a chave Pix, modificassem os nomes dos bebês ou forjassem vencedores de sorteios.
- A criação de palpites não continha validação estrutural de tipos ou campos, permitindo a injeção de documentos com status já "pago" (`confirmed`) ou valores negativos.

### Decision
Atualizar as regras de segurança do Cloud Firestore (`firestore.rules`) com validações estritas de esquema e controle de acesso:
1. **Coleção `/guesses/{guessId}`**:
   - `read`: liberada publicamente (`if true`) para alimentar o placar, ranking e contadores em tempo real.
   - `create`: permitida publicamente apenas se o documento satisfizer o esquema:
     - `guessId` não pode ser ID mock reservado (`guessId != 'mock_1' && guessId != 'mock_2' && guessId != 'mock_3'`).
     - `guestName` é uma string com tamanho entre 2 e 100 caracteres.
     - `gender` é estritamente `'boy'` ou `'girl'`.
     - `quotasCount` é número inteiro entre 1 e 100.
     - `status` inicial é obrigatoriamente `'pending'` (usuários públicos jamais podem criar apostas confirmadas diretamente).
     - `totalAmount` é número positivo (> 0).
   - `update` e `delete`: terminantemente bloqueadas para usuários anônimos (`if request.auth != null`).
2. **Coleções `/settings/{settingId}` e `/draws/{drawId}`**:
   - `read`: liberada publicamente para exibição do Pix, títulos e histórico oficial.
   - `write`: restrita a usuários autenticados (`if request.auth != null`).

### Alternatives Considered
- **Deleção pública com soft-delete**: Rejeitada porque qualquer usuário malicioso ainda poderia acionar o soft-delete de palpites alheios.
- **Armazenamento de segredo/token de admin no documento**: Rejeitado porque leituras públicas da coleção revelariam o segredo a qualquer visitante que inspecionasse as respostas de rede.

---

## 2. Admin Authentication Hardening (SHA-256 & Web Crypto API)

### Context & Problem
Em `js/auth.js`, a função de login continha senhas padrão em texto claro (`admin123` e `admin`) gravadas diretamente no código-fonte. Além disso, a credencial era gravada em texto puro no `localStorage`, permitindo inspeção e acesso indevido.

### Decision
1. **Eliminação de Senhas Hardcoded**:
   - Remover as cláusulas `cleanPassword === 'admin123' || cleanPassword === 'admin'`.
2. **Hash Criptográfico SHA-256 via Web Crypto API**:
   - Utilizar a API nativa do navegador `crypto.subtle.digest('SHA-256', ...)` para computar o hash unidirecional da senha informada.
   - Comparar o hash resultante com o hash oficial configurado para os pais.
   - Nunca persistir ou expor senhas em texto puro no `localStorage` ou no código-fonte.
3. **Mecanismo de Recuperação / Primeiro Acesso**:
   - Fornecer um hash inicial padrão seguro ou fluxo de definição de senha inicial com confirmação, acompanhado de chave mestra de emergência para recuperação em caso de esquecimento.

### Alternatives Considered
- **Biblioteca externa (bcrypt/crypto-js via CDN)**: Rejeitada para evitar overhead desnecessário e dependências externas, respeitando o Princípio I da Constituição (Zero-Build e Leveza).
- **Autenticação externa complexa (OAuth/Google/Facebook)**: Rejeitada porque exige redirecionamento, configuração de consentimento em nuvem e dificulta o acesso rápido dos pais durante a festa.

---

## 3. Brute Force Protection (Lockout & Rate Limiting)

### Context & Problem
O modal de login administrativo não possuía limite de tentativas incorretas, deixando a porta aberta para ataques de força bruta automatizados.

### Decision
Implementar controle de taxa e bloqueio temporário (lockout) no cliente:
1. **Contador de Falhas**: Registrar o número de tentativas consecutivas com erro (`bolao_admin_lockout`).
2. **Limite de Bloqueio**: Ao atingir 5 tentativas incorretas, aplicar um lockout de 5 minutos (300.000 ms).
3. **Feedback Visual e Desabilitação**: Durante o período de lockout, o botão de login permanece desabilitado, exibindo um contador regressivo (ex: "Bloqueado por mais 4m 32s").
4. **Expiração de Sessão por Inatividade**: Sessões ativas dos pais expiram automaticamente após 30 minutos sem atividade, exigindo nova inserção de credencial.
5. **Reset em Sucesso**: Uma autenticação bem-sucedida zera imediatamente o contador de tentativas falhas.

### Alternatives Considered
- **Cloud Functions / Backend Rate Limiting**: Rejeitada porque a arquitetura do projeto é Zero-Build estática no Firebase Hosting (sem servidor Node.js/Cloud Run ativo).

---

## 4. Anti-Spam (Honeypot & Submission Cooldown)

### Context & Problem
O formulário de palpites na página inicial (`index.html`) não possuía proteção contra robôs que rastreiam sites estáticos e enviam centenas de registros fictícios em segundos.

### Decision
1. **Campo Honeypot Invisível**:
   - Inserir um campo de formulário oculto via CSS e atributos de acessibilidade:
     ```html
     <div style="position: absolute; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true" tabindex="-1">
         <label for="form-website-check">Deixe este campo em branco</label>
         <input type="text" id="form-website-check" name="website_check" autocomplete="off" tabindex="-1">
     </div>
     ```
   - Spambots comuns preenchem todos os campos encontrados no DOM. Usuários humanos legítimos não o enxergam e não o preenchem.
   - Se o campo for preenchido no submit, a requisição é descartada de forma silenciosa ou simula sucesso sem persistir nada no banco de dados.
2. **Cooldown no Cliente**:
   - Aplicar um intervalo mínimo de 8 segundos entre envios sucessivos a partir do mesmo navegador.
   - Exibir feedback claro caso o usuário clique repetidamente: "Aguarde alguns segundos antes de enviar um novo palpite."

### Alternatives Considered
- **reCAPTCHA v2 / v3**: Rejeitado para evitar sobrecarga no carregamento da página e fricção visual (desafios de imagens) para convidados que usam smartphones simples.

---

## 5. Participant Privacy & Phone Number Masking (LGPD)

### Context & Problem
Em bolões públicos, os números de WhatsApp dos participantes podem ser alvo de raspagem de dados para marketing não solicitado se exibidos em texto aberto.

### Decision
1. **Mascaramento de Telefone**:
   - Implementar função utilitária `maskPhone(phone)` que formata números para o padrão `(11) 9****-1234`.
2. **Visão Pública vs. Visão Administrativa**:
   - No placar, ranking e notificações públicas, exibir somente o nome sanitizado e o palpite, sem expor o telefone.
   - O número completo permanece visível exclusivamente na Área dos Pais para os organizadores conferirem os comprovantes Pix e realizarem o contato do sorteio.
3. **Sanitização de XSS**:
   - Manter uso estrito de `escapeHtml()` e manipulação de propriedades seguras (`textContent` / `dataset`) em todos os pontos dinâmicos do DOM.

---

## 6. HTTP Security Headers in Firebase Hosting

### Context & Problem
O arquivo `firebase.json` continha apenas cabeçalhos de controle de cache (`Cache-Control`), faltando cabeçalhos fundamentais de proteção do navegador.

### Decision
Adicionar os seguintes cabeçalhos de segurança em `firebase.json`:
- `X-Frame-Options: SAMEORIGIN` (previne ataques de Clickjacking ao impedir que o site seja inserido em iframes de outros domínios).
- `X-Content-Type-Options: nosniff` (impede que o navegador tente inferir tipos MIME diferentes dos declarados).
- `Referrer-Policy: strict-origin-when-cross-origin` (limita o envio de informações de referência ao navegar para sites externos).
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (restringe acesso a recursos sensíveis de hardware).
