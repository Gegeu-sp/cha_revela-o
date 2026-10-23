# Security Contract: Regras do Cloud Firestore, Autenticação e Blindagem HTTP

**Feature Branch**: `004-seguranca-e-blindagem`  
**Date**: 2026-10-23  
**Status**: Completed  

---

## 1. Cloud Firestore Rules Contract (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================================
    // 1. PALPITES DO BOLÃO (/guesses/{guessId})
    // ========================================================
    match /guesses/{guessId} {
      // Leitura pública liberada para alimentação do placar e ranking
      allow read: if true;
      
      // Criação de novos palpites com esquema rígido de validação
      allow create: if (
        // IDs mock de demonstração não podem ser sobrescritos
        guessId != 'mock_1' && guessId != 'mock_2' && guessId != 'mock_3' &&
        // Nome obrigatório entre 2 e 100 caracteres
        request.resource.data.guestName is string &&
        request.resource.data.guestName.size() >= 2 &&
        request.resource.data.guestName.size() <= 100 &&
        // Gênero estritamente boy ou girl
        request.resource.data.gender in ['boy', 'girl'] &&
        // Quantidade de cotas inteira e positiva
        request.resource.data.quotasCount is number &&
        request.resource.data.quotasCount >= 1 &&
        request.resource.data.quotasCount <= 100 &&
        // Status inicial obrigatoriamente 'pending' (impede injeção de apostas já confirmadas)
        request.resource.data.status == 'pending' &&
        // Valor monetário total estritamente positivo
        request.resource.data.totalAmount is number &&
        request.resource.data.totalAmount > 0
      );
      
      // Atualização (aprovar cota, alterar status) e Exclusão terminantemente restritas a administradores
      allow update, delete: if request.auth != null;
    }
    
    // ========================================================
    // 2. CONFIGURAÇÕES DO EVENTO (/settings/{settingId})
    // ========================================================
    match /settings/{settingId} {
      // Leitura pública liberada (chave Pix, nomes dos bebês, preços de cotas)
      allow read: if true;
      // Escrita e alteração de parâmetros restritas ao administrador autenticado
      allow write: if request.auth != null;
    }

    // ========================================================
    // 3. HISTÓRICO OFICIAL DE SORTEIOS (/draws/{drawId})
    // ========================================================
    match /draws/{drawId} {
      // Leitura pública liberada para visualização do vencedor no telão
      allow read: if true;
      // Gravação de resultados de sorteio restrita ao administrador autenticado
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. Authentication & Cryptography Contract (`js/auth.js`)

### 2.1 Funções Exportadas e Assinaturas

```javascript
/**
 * Inicializa o serviço de autenticação, verificando expiração de sessão e carregando listeners.
 * @returns {Promise<void>}
 */
export async function initAuth(): Promise<void>;

/**
 * Autentica o administrador verificando bloqueio por força bruta e comparando o hash SHA-256.
 * @param {string} email - Identificador ou e-mail de acesso.
 * @param {string} password - Senha digitada em texto plano.
 * @returns {Promise<{ success: boolean, user?: AdminAuthSession, error?: string, remainingLockoutSeconds?: number }>}
 */
export async function loginAdmin(email: string, password: string): Promise<LoginResult>;

/**
 * Encerra a sessão ativa do administrador e notifica todos os ouvintes.
 * @returns {Promise<{ success: boolean }>}
 */
export async function logoutAdmin(): Promise<{ success: true }>;

/**
 * Retorna se o administrador está atualmente autenticado e com sessão válida.
 * @returns {boolean}
 */
export function isAdminAuthenticated(): boolean;

/**
 * Retorna os dados da sessão ativa do administrador, ou null se não autenticado.
 * @returns {AdminAuthSession | null}
 */
export function getCurrentUser(): AdminAuthSession | null;

/**
 * Altera a senha do administrador, gravando o novo hash SHA-256 de forma segura.
 * @param {string} currentPassword - Senha atual em texto plano.
 * @param {string} newPassword - Nova senha desejada em texto plano.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean, error?: string }>;
```

### 2.2 Algoritmo SHA-256 (Web Crypto API)

```javascript
export async function computeSha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

---

## 3. Anti-Spam & Submission Cooldown Contract (`js/app.js`)

### 3.1 Honeypot Check
- Antes de submeter o palpite ao banco, o listener do formulário deve avaliar:
  ```javascript
  const honeypotVal = document.getElementById('form-website-check')?.value.trim();
  if (honeypotVal) {
      console.warn('Spambot interceptado pelo campo honeypot.');
      // Simula resposta de sucesso para enganar o bot sem poluir o banco de dados
      showToast('Palpite registrado com sucesso!', 'success');
      form.reset();
      return;
  }
  ```

### 3.2 Cooldown Check
- Intervalo mínimo de 8 segundos entre envios sucessivos:
  ```javascript
  const lastSubmitTime = Number(sessionStorage.getItem('bolao_last_guess_submit') || 0);
  const now = Date.now();
  if (now - lastSubmitTime < 8000) {
      const waitSeconds = Math.ceil((8000 - (now - lastSubmitTime)) / 1000);
      showToast(`Aguarde mais ${waitSeconds} segundo(s) antes de enviar outro palpite.`, 'warning');
      return;
  }
  sessionStorage.setItem('bolao_last_guess_submit', String(now));
  ```

---

## 4. Privacy & Phone Masking Contract (`js/utils.js` ou helpers)

```javascript
/**
 * Mascara números de telefone para proteção da privacidade dos participantes.
 * Entrada: "(11) 98765-4321" ou "11987654321"
 * Saída: "(11) 9****-4321"
 */
export function maskPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 11) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 3)}****-${clean.slice(7)}`;
    }
    if (clean.length === 10) {
        return `(${clean.slice(0, 2)}) ****-${clean.slice(6)}`;
    }
    return phone.slice(0, 3) + '****' + phone.slice(-2);
}
```

---

## 5. HTTP Security Headers Contract (`firebase.json`)

```json
{
  "headers": [
    {
      "source": "**",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```
