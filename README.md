# 👶🍼 Bolão & Rifa de Chá Revelação — Menino ou Menina? 🎀🎉

Uma aplicação web moderna, interativa e responsiva para **Chá Revelação e Rifa**, com placar em tempo real, compra de múltiplas cotas, integração com Pix/WhatsApp e **Painel Administrativo Completo dos Pais**.

Construído com arquitetura **Zero-Build** (HTML5, Vanilla CSS e ES6 Modules) para carregamento ultrarrápido, compatibilidade total com dispositivos móveis e publicação descomplicada.

---

## ✨ Principais Funcionalidades

### 👥 Para os Convidados (Página Pública)
- **Votação Interativa**: Escolha do palpite (Menino 💙 vs Menina 💖) com os nomes dos bebês.
- **Seletor de Múltiplas Cotas**: Opções de 1, 2, 3, 5 ou quantidade personalizada de cotas da rifa com cálculo dinâmico do valor total.
- **Pagamento via Pix Facilitado**:
  - Exibição de Chave Pix com botão de cópia com 1 clique.
  - Botão direto para o **WhatsApp dos pais** com mensagem formatada automaticamente contendo nome, palpite, cotas e valor do comprovante.
- **Placar Animado & Confetes**:
  - Barras comemorativas que mostram porcentagens e totais de votos e cotas em tempo real.
  - Efeitos festivos de confetes animados (`canvas-confetti`).
- **Contagem Regressiva**: Contador regressivo dinâmico em dias, horas e minutos até a data prevista do nascimento.
- **Tabela de Participantes**: Visualização transparente dos palpites confirmados e pendentes.

### 🛡️ Para os Pais (Painel Administrativo)
- **Acesso Seguro**: Modal de login discreto ("Área dos Pais") com e-mail e senha.
- **Gestão de Pagamentos**:
  - Lista de palpites com status ("Aguardando Pix" vs "Confirmado").
  - Botão de confirmação de pagamento com recálculo automático e comemoração.
  - Edição de nomes, telefones, opções de voto e cotas.
  - Exclusão ou cancelamento de registros.
- **Lançamento Manual**: Formulário para registrar palpites de convidados que pagaram em dinheiro ou fora do site.
- **Configuração do Evento**:
  - Ajuste do valor individual da cota (ex: R$ 10,00, R$ 15,00, R$ 20,00).
  - Configuração da Chave Pix, nome do titular e cidade.
  - Nomes personalizados para os bebês (Menino / Menina).
  - Data prevista de nascimento.
  - Percentual da premiação da rifa.
- **Revelação Oficial**: Opção para declarar o gênero vencedor e encerrar o bolão com celebração na tela.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, Vanilla CSS Moderno (Design System com variáveis CSS, responsividade mobile-first e animações fluidas a 60 FPS), JavaScript ES6 Modular.
- **Biblioteca de Animação**: [Canvas Confetti](https://www.jsdelivr.com/package/npm/canvas-confetti) via CDN.
- **Backend / Persistência**:
  - **Modo Nuvem (Produção)**: Google Firebase v10 Modular ([Firestore Database](https://firebase.google.com/docs/firestore) para sincronização em tempo real entre celulares e [Firebase Auth](https://firebase.google.com/docs/auth) para login dos pais).
  - **Modo Demonstração (Fallback Local)**: Persistência automática em `localStorage` para testes imediatos sem necessidade de chaves de API.
- **Hospedagem Recomendada**: Firebase Hosting (arquivos de configuração [`firebase.json`](firebase.json) e [`.firebaserc`](.firebaserc) incluídos).

---

## 🛠️ Como Executar Localmente

Como o projeto é **Zero-Build**, você não precisa compilar nada:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Gegeu-sp/cha_revela-o.git
   cd cha_revela-o
   ```

2. Abra o arquivo `index.html` diretamente em seu navegador ou utilize qualquer servidor web local:
   - **VS Code**: Extensão *Live Server* (clique com botão direito em `index.html` -> *Open with Live Server*).
   - **Python**:
     ```bash
     python -m http.server 8000
     ```
   - **Node.js**:
     ```bash
     npx serve .
     ```

3. Acesse `http://localhost:8000` no seu navegador ou celular na mesma rede Wi-Fi.

---

## 🌐 Publicação no Firebase Hosting (Online e Grátis)

Consulte o passo a passo completo no arquivo [**`DEPLOY_FIREBASE.md`**](DEPLOY_FIREBASE.md).

Em resumo:
```bash
# 1. Instalar as ferramentas do Firebase (caso não tenha)
npm install -g firebase-tools

# 2. Conectar sua conta Google
firebase login

# 3. Publicar o site na web
firebase deploy --only hosting
```

---

## 📁 Estrutura de Pastas

```text
├── css/
│   └── animations.css       # Animações, modais, placar e micro-interações
├── js/
│   ├── admin.js             # Lógica e interface do painel administrativo dos pais
│   ├── app.js               # Orquestrador da página pública e envio de palpites
│   ├── auth.js              # Serviço de autenticação do administrador (Firebase/Demo)
│   ├── config.js            # Parâmetros padrão do evento e detector de ambiente
│   ├── countdown.js         # Componente do contador regressivo até o nascimento
│   ├── db.js                # Camada de dados abstrata (Firestore + LocalStorage)
│   ├── ranking.js           # Placar animado, cálculo de cotas e confetes
│   └── state.js             # Gerenciamento de estado global reativo
├── index.html               # Página principal completa com design responsivo
├── DEPLOY_FIREBASE.md       # Guia para publicação na nuvem
├── firebase.json            # Configuração de deploy do Firebase Hosting
└── .firebaserc              # Identificador do projeto Firebase
```

---

## 📄 Licença

Este projeto foi desenvolvido com carinho para celebração de Chá Revelação e Rifa entre familiares e amigos.
Sinta-se livre para usar, adaptar e compartilhar!
