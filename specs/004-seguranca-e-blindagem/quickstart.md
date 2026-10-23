# Quickstart & Security Validation Guide: Blindagem de Segurança

**Feature Branch**: `004-seguranca-e-blindagem`  
**Date**: 2026-10-23  
**Status**: Ready for Verification  

Este guia fornece cenários de teste práticos e reprodutíveis para validar a eficácia de todas as camadas de segurança implementadas no sistema.

---

## 1. Pré-Requisitos

1. Servidor local ativo ou ambiente de testes:
   ```powershell
   npx serve . -l 3000
   ```
   ou acesso à URL de homologação/produção: `https://rifa-bolao.web.app`.
2. Navegador com Developer Tools habilitado (F12) para inspeção de rede e console.

---

## 2. Cenários de Validação

### Cenário 1: Teste de Bloqueio de Deleção e Escrita Não Autorizada no Firestore
**Objetivo**: Provar que usuários anônimos não conseguem deletar palpites nem adulterar configurações ou sorteios.

- **Passo 1**: Abra a página inicial no navegador e abra o Console DevTools (F12).
- **Passo 2**: Tente deletar um palpite existente através do SDK do Firestore no console:
  ```javascript
  const { getFirestore, doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
  const db = getFirestore();
  await deleteDoc(doc(db, 'guesses', 'qualquer_id_existente'));
  ```
- **Resultado Esperado**: O Firestore rejeita imediatamente com erro `FirebaseError: [code=permission-denied]: Missing or insufficient permissions.`
- **Passo 3**: Tente alterar a chave Pix ou nomes em `settings`:
  ```javascript
  const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
  await setDoc(doc(db, 'settings', 'event_config'), { pixKey: 'hacker@malicioso.com' }, { merge: true });
  ```
- **Resultado Esperado**: Operação rejeitada com erro `permission-denied`.

---

### Cenário 2: Validação Rígida de Esquema na Criação de Palpites
**Objetivo**: Confirmar que o Firestore rejeita tentativas de criar apostas confirmadas ou campos inválidos.

- **Passo 1**: No console, tente injetar um palpite com `status: "confirmed"`:
  ```javascript
  const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
  await addDoc(collection(db, 'guesses'), {
      guestName: 'Invasor Falso',
      gender: 'boy',
      quotasCount: 1,
      totalAmount: 15,
      status: 'confirmed' // Tentativa de forjar status confirmado
  });
  ```
- **Resultado Esperado**: Rejeição imediata com `permission-denied`, pois a regra exige `status == 'pending'`.
- **Passo 2**: Tente enviar um palpite com gênero inválido (ex: `gender: 'alien'`):
- **Resultado Esperado**: Rejeição imediata com `permission-denied`.

---

### Cenário 3: Proteção Contra Força Bruta (Lockout de 5 Tentativas)
**Objetivo**: Verificar que adivinhação contínua de senhas bloqueia o login por 5 minutos.

- **Passo 1**: Clique no botão "Área dos Pais" para abrir o modal de login.
- **Passo 2**: Digite senhas incorretas consecutivas (ex: `teste1`, `teste2`, `teste3`, `teste4`, `teste5`).
- **Passo 3**: Na 5ª tentativa incorreta:
- **Resultado Esperado**:
  - O sistema exibe o alerta: *"Muitas tentativas incorretas. Acesso bloqueado por segurança por 5 minutos."*
  - O botão de envio fica desabilitado (`disabled`).
  - Um cronômetro regressivo é exibido indicando o tempo restante.

---

### Cenário 4: Eliminação de Senhas Padrão e Hash Criptográfico SHA-256
**Objetivo**: Confirmar que senhas genéricas (`admin123`, `admin`) foram removidas e que senhas não são gravadas em texto puro.

- **Passo 1**: No modal de login administrativo, tente inserir a senha antiga `admin123` ou `admin`.
- **Resultado Esperado**: O sistema rejeita com erro de credenciais inválidas.
- **Passo 2**: Inspecione o `localStorage` no console do DevTools:
  ```javascript
  localStorage.getItem('bolao_admin_custom_password');
  ```
- **Resultado Esperado**: Nenhuma senha em texto puro está armazenada; apenas o hash criptográfico de 64 caracteres hexadecimais é mantido para verificação.

---

### Cenário 5: Teste do Campo Invisível Anti-Spam (Honeypot)
**Objetivo**: Provar que robôs automatizados que preenchem todos os campos são interceptados silenciosamente.

- **Passo 1**: No formulário de envio de palpites, simule a ação de um spambot preenchendo o campo oculto:
  ```javascript
  document.getElementById('form-website-check').value = 'http://site-de-spam.com';
  ```
- **Passo 2**: Submeta o formulário de palpite.
- **Resultado Esperado**: O sistema intercepta o envio, não gera nenhuma gravação na coleção `guesses` do Firestore, e protege o banco contra poluição de dados fictícios.

---

### Cenário 6: Teste de Intervalo de Submissão (Cooldown)
**Objetivo**: Garantir que múltiplos cliques consecutivos não disparam envios duplicados em rajada.

- **Passo 1**: Preencha o formulário e clique em "Confirmar Palpite".
- **Passo 2**: Tente imediatamente (em menos de 8 segundos) enviar outro palpite.
- **Resultado Esperado**: Exibição de aviso visual amigável: *"Aguarde mais X segundo(s) antes de enviar outro palpite."*

---

### Cenário 7: Verificação de Cabeçalhos HTTP de Segurança
**Objetivo**: Validar que as respostas HTTP do Firebase Hosting possuem os cabeçalhos de proteção contra Clickjacking e MIME Sniffing.

- **Passo 1**: Execute uma requisição `HEAD` ou `GET` inspecionando os headers de resposta:
  ```powershell
  curl.exe -I https://rifa-bolao.web.app
  ```
- **Resultado Esperado**: A resposta HTTP contém:
  - `x-frame-options: SAMEORIGIN`
  - `x-content-type-options: nosniff`
  - `referrer-policy: strict-origin-when-cross-origin`
  - `permissions-policy: camera=(), microphone=(), geolocation=()`
