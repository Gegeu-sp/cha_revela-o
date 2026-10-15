# Research & Technical Decisions: Gestão Completa de Rifa e Bolão

**Feature**: `001-rifa-bolao-admin`
**Date**: 2026-10-14
**Status**: Resolved

## 1. Backend & Real-Time Sync Strategy

### Context & Problem
Os convidados do chá revelação darão seus palpites em seus próprios smartphones (via link recebido no WhatsApp), e os pais precisarão validar e confirmar os comprovantes a partir de seus próprios celulares. As atualizações nos contadores, tabela e ranking animado precisam refletir em tempo real para todos os usuários conectados.

### Decision
Utilizar **Firebase Firestore (Web SDK v10 Modular via ESM)** associado ao **Firebase Authentication (E-mail/Senha)**.

### Rationale
1. **Zero-Build & Lightweight (Princípio I da Constituição)**: O Firebase Modular v10 pode ser importado diretamente em scripts modernos do navegador (`<script type="module">` via CDN `esm.sh` ou `gstatic`), preservando a arquitetura estática do projeto sem necessidade de Node.js, Webpack, Vite ou pipelines de build complexos.
2. **Tempo Real Nativo (`onSnapshot`)**: O Firestore oferece sincronização bidirecional por WebSockets nativa, atualizando o placar e a tabela em menos de 1 segundo em todos os celulares conectados.
3. **Persistência Offline & Cache**: O SDK do Firestore gerencia cache local automático, garantindo que o aplicativo continue legível mesmo em áreas com sinal instável.
4. **Sem Pausa no Plano Gratuito**: Ao contrário de alternativas como Supabase (que pausa projetos gratuitos após 7 dias de inatividade), o Firebase Spark (gratuito) não congela e oferece 50.000 leituras e 20.000 escritas diárias, muito superior à demanda do evento.
5. **Configuração Amigável com Modo Local/Demo Fallback**: Para permitir testes imediatos sem travar a aplicação caso as chaves ainda não estejam configuradas, o sistema implementará um adaptador que alterna transparentemente para `localStorage` com modo de demonstração até as credenciais serem inseridas.

### Alternatives Considered
- **Supabase (PostgreSQL)**: Excelente solução relacional, porém a camada gratuita suspende projetos inativos após 7 dias, o que poderia derrubar a rifa dias antes do evento.
- **Armazenamento 100% Local (LocalStorage)**: Não atende ao requisito fundamental de sincronizar votos de múltiplos celulares de convidados diferentes com o painel dos pais.
- **Backend Próprio (Node.js/Express + Render/Heroku)**: Eleva o custo de manutenção, infraestrutura e complexidade desnecessária para um evento familiar.

---

## 2. Autenticação e Segurança do Administrador

### Context & Problem
O usuário especificou a necessidade de login formal com e-mail e senha para o pai e a mãe acessarem o painel de administração e confirmarem pagamentos e configurações.

### Decision
Utilizar **Firebase Authentication com Provedor de E-mail/Senha**.

### Rationale
1. **Segurança Real**: Não expõe senhas ou PINs no código fonte HTML/JS da aplicação.
2. **Sessão Persistente**: O administrador permanece logado no seu smartphone sem precisar digitar a senha a cada refresh da página.
3. **Regras de Segurança do Firestore**:
   - Leitura pública (`allow read: if true`) para as coleções de palpites e configurações do evento.
   - Criação de novos palpites pública com status estrito `"pending"`.
   - Modificação, edição e confirmação de pagamento restritas a usuários autenticados (`allow write, update, delete: if request.auth != null`).

### Alternatives Considered
- **Senha Fixa no Código JavaScript**: Extremamente insegura, pois qualquer participante experiente poderia inspecionar o código fonte no navegador e acessar o painel.
- **Link com Token Secreto na URL**: Inconveniente se o link vazar em grupos do WhatsApp ou for esquecido pelos pais.

---

## 3. Placar Animado e Ranking da Disputa (Menino 💙 vs Menina 💖)

### Context & Problem
A experiência visual deve ser vibrante, dinâmica e emocionante, incentivando a competição amigável entre os convidados.

### Decision
Construir um componente de **Placar Interativo com CSS Transitions, Animações Suaves e Efeitos Visuais de Celebração**.

### Rationale
1. **Desempenho Móvel (60 FPS)**: Animações de largura (`width`) aceleradas por transições CSS com easing suave (`cubic-bezier`), efeitos de pulso e brilho (`glow`) no gênero que estiver liderando.
2. **Cálculo Dinâmico**: O componente recalcula instantaneamente os percentuais com base nas cotas confirmadas (e exibe separadamente as cotas pendentes para criar senso de urgência).
3. **Efeito Confete / Comemoração**: Disparo de efeitos visuais comemorativos (via biblioteca leve `canvas-confetti` via CDN) quando um novo pagamento é confirmado ou quando há uma virada no placar.

### Alternatives Considered
- **Gráficos com Chart.js**: Gráficos genéricos de barra ou pizza parecem corporativos e frios para um Chá Revelação acolhedor.
- **Animações Lottie pesadas**: Aumentam o tempo de carregamento e o consumo de dados em conexões móveis 4G/3G.

---

## 4. Contagem Regressiva e Data Prevista de Nascimento

### Context & Problem
Os pais precisam configurar a data prevista de nascimento e os convidados devem visualizar um contador elegante e acolhedor.

### Decision
Implementar um módulo utilitário de contagem regressiva reativa que aceita datas no formato `YYYY-MM-DD` e atualiza a contagem a cada minuto, exibindo dias, horas e minutos, com mensagem festiva caso a data chegue ou seja ultrapassada.
