# 🚀 Guia de Publicação no Firebase Hosting (Deixar o Site Online)

Este projeto foi configurado com arquitetura **Zero-Build** e já contém os arquivos [`firebase.json`](firebase.json) e [`.firebaserc`](.firebaserc) prontos para publicação instantânea com certificado SSL (HTTPS gratuito) e CDN global.

---

## Passo a Passo para Publicar

### 1. Instalar as Ferramentas do Firebase (caso ainda não tenha)
Abra o terminal (PowerShell ou Prompt) e execute:
```bash
npm install -g firebase-tools
```
*(Ou use diretamente via `npx firebase-tools` se preferir).*

---

### 2. Conectar à sua Conta Google / Firebase
Faça o login seguro no terminal:
```bash
firebase login
```
Uma janela do navegador será aberta para autorizar o acesso à sua conta Google.

---

### 3. Vincular ou Criar o Projeto no Firebase Console
1. Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/) e clique em **"Adicionar projeto"** (ex: `charevelacao-bolao`).
2. Se quiser alterar o ID do projeto configurado no arquivo [`.firebaserc`](.firebaserc), edite a linha `"default": "seu-id-do-projeto"`.
3. Ou simplesmente execute no terminal:
```bash
firebase use --add
```
e selecione o seu projeto na lista.

---

### 4. Fazer o Deploy (Publicar)
Para subir o site para a internet:
```bash
firebase deploy --only hosting
```

Em poucos segundos, o terminal exibirá a URL pública oficial do seu bolão:
```text
✔ Deploy complete!
Hosting URL: https://seu-projeto.web.app
```

---

## Dica para Sincronização em Tempo Real (Firestore)
Para que os votos dos convidados em outros celulares sincronizem com o seu celular em tempo real:
1. No [Firebase Console](https://console.firebase.google.com/), ative o **Firestore Database** em modo de teste ou produção.
2. Ative o **Firebase Authentication** com o provedor **E-mail/Senha** para o login dos pais.
3. Copie as chaves do seu Web App no Firebase e cole no arquivo [`js/config.js`](js/config.js) no objeto `defaultFirebaseConfig`.
4. Execute `firebase deploy --only hosting` novamente!
