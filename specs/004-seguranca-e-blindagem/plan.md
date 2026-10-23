# Implementation Plan: Blindagem de Segurança, Proteção de Dados e Controle de Acesso

**Branch**: `004-seguranca-e-blindagem` | **Date**: 2026-10-23 | **Spec**: [spec.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/spec.md)

**Input**: Feature specification from `specs/004-seguranca-e-blindagem/spec.md`

## Summary

Implementar uma blindagem abrangente de segurança em múltiplas camadas para a plataforma do bolão de chá revelação:
1. **Cloud Firestore Hardening**: Eliminar vulnerabilidades críticas (`allow delete: if true` e `allow write: if true`), implementando validação de esquema na coleção `guesses` e restrição de escrita em `settings` e `draws`.
2. **Autenticação Segura dos Pais**: Eliminar senhas hardcoded (`admin123` e `admin`), introduzir hash unidirecional seguro (SHA-256 via Web Crypto API nativa do navegador), mitigação de força bruta com bloqueio (lockout de 5 minutos após 5 erros) e expiração de sessão por inatividade.
3. **Privacidade e Proteção de Dados (LGPD)**: Ocultar e mascarar números de WhatsApp nas visualizações públicas e reforçar a sanitização contra XSS.
4. **Anti-Spam e Headers HTTP**: Campo honeypot invisível e cooldown de envio no formulário de palpites; cabeçalhos de segurança (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) no `firebase.json`.

---

## Technical Context

**Language/Version**: HTML5, Vanilla JavaScript (ES6+ Modules), Vanilla CSS / Tailwind CSS (CDN runtime).  
**Primary Dependencies**: Google Cloud Firestore & Firebase Auth (SDK v10.13.0 ESM), Web Crypto API (nativo do navegador para SHA-256 e PRNG).  
**Storage**: Cloud Firestore (banco remoto em nuvem) + `localStorage` / `sessionStorage` (fallback e cache de estado no cliente).  
**Testing**: Cenários de validação manual via DevTools / Console e inspeção de rede documentados em [quickstart.md](file:///c:/Users/MUSCULAÇÃO/Documents/Cha_revelação/specs/004-seguranca-e-blindagem/quickstart.md).  
**Target Platform**: Navegadores modernos móveis (iOS Safari, Android Chrome) e desktop.  
**Project Type**: Zero-Build Single Page Application (SPA estática hospedada no Firebase Hosting).  
**Performance Goals**: Tempo de resposta do formulário < 100ms; verificação de hash SHA-256 no cliente < 5ms; bloqueio de requisições maliciosas em 0ms no Firestore.  
**Constraints**: Zero-Build estrito (sem webpack, vite, bundlers ou pipelines adicionais); sem impacto no fluxo de envio de palpites para convidados legítimos.  
**Scale/Scope**: ~100 a 500 convidados simultâneos; proteção completa contra ataques de script bots, clickjacking e força bruta.  

---

## Constitution Check

*GATE: Avaliação contra os princípios da Constituição do Bolão Chá Revelação.*

| Princípio Constitucional | Conformidade | Justificativa |
|--------------------------|--------------|---------------|
| **I. Simplicidade e Autossuficiência (Zero-Build)** | **PASS** | Usa a Web Crypto API nativa e regras nativas do Firestore. Nenhuma biblioteca externa ou ferramenta de build adicional é inserida. |
| **II. Experiência Mobile-First e Acessibilidade** | **PASS** | Avisos de lockout e cooldown possuem feedback visual claro e amigável em telas de smartphone. |
| **III. Sanitização de Input e Integridade de Dados** | **PASS** | Validação estrutural de esquema no Firestore bloqueia injeções; honeypot intercepta spambots; textos continuam sanitizados contra XSS. |
| **IV. Transparência de Regras e Premiação** | **PASS** | O placar e o ranking permanecem públicos e auditáveis; deleções ou adulterações arbitrárias são bloqueadas. |
| **V. Integração Social e WhatsApp Descomplicado** | **PASS** | O fluxo de envio de comprovantes Pix e mensagens de parabéns via WhatsApp continua ágil, protegendo apenas a exposição pública do número. |

---

## Project Structure

### Documentation (this feature)

```text
specs/004-seguranca-e-blindagem/
├── spec.md              # Especificação de requisitos e cenários de aceite
├── plan.md              # Este arquivo (Plano de Implementação)
├── research.md          # Decisões arquiteturais e justificativas técnicas
├── data-model.md        # Entidades, estados e esquemas de validação
├── quickstart.md        # Guia de validação e testes práticos de segurança
├── contracts/           # Contratos de interface e segurança
│   └── security-rules-contract.md
└── tasks.md             # Tarefas de implementação (gerado pelo /speckit-tasks)
```

### Source Code Impacted (repository root)

```text
├── firestore.rules       # Regras endurecidas do Cloud Firestore (restringe delete/write, valida guesses)
├── firebase.json         # Cabeçalhos HTTP de segurança (X-Frame-Options, nosniff, etc.)
├── index.html            # Campo invisível honeypot no formulário de palpites
├── js/
│   ├── auth.js           # Hash SHA-256, remoção de senhas hardcoded, lockout e controle de sessão
│   ├── app.js            # Interceptador anti-spam (honeypot) e cooldown de envio
│   ├── db.js             # Validação pré-envio e tratamento gracioso de erros de permissão
│   ├── admin.js          # Feedback visual de bloqueio por força bruta e máscara de privacidade
│   └── ranking.js        # Preservação de sanitização XSS no ranking público
```

---

## Complexity Tracking

*Nenhuma violação aos princípios constitucionais. O design aproveita recursos nativos dos navegadores (Web Crypto API) e do Firebase (Firestore Rules + Hosting Headers).*

| Possível Complexidade | Como foi Mitigada |
|-----------------------|-------------------|
| Autenticação criptográfica sem servidor backend | Uso da Web Crypto API nativa (`crypto.subtle.digest`), eliminando qualquer dependência de pacotes externos |
| Bloqueio por força bruta sem banco de dados dedicado | Estado rastreado no cliente com timestamp de lockout, garantindo feedback imediato e proteção efetiva |
| Proteção anti-robô sem reCAPTCHA invasivo | Campo honeypot invisível no formulário, invisível a convidados reais mas atrativo a robôs |
