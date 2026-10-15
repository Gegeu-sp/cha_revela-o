# Implementation Plan: Gestão Completa de Rifa e Bolão com Painel Administrativo

**Branch**: `001-rifa-bolao-admin` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-rifa-bolao-admin/spec.md` incorporando:
- Configuração e exibição dos nomes dos bebês (Menino e Menina).
- Área de confirmação prioritária de Pix e botão seguro de Reiniciar Bolão do Zero.
- QR Code do Pix dinâmico e botão Copia e Cola.
- Arquivos e documentação para deploy no Firebase Hosting.
- Alinhamento refinado e responsividade estrita tanto para web quanto mobile.

---

## Summary

Expandir e polir a aplicação com:
1. **Identificação dos Bebês**: Campos `boyBabyName` e `girlBabyName` personalizáveis no painel administrativo, atualizando dinamicamente os botões de escolha de voto ("💙 É [Nome]!" / "💖 É [Nome]!"), textos comemorativos e placar.
2. **Fila Prioritária de Pix no Admin**: Visualização destacada de palpites com status "Aguardando Pix" com botão de aprovação imediata em 1 clique.
3. **Reinicialização do Bolão (Zerar Dados)**: Ferramenta de reset completo no painel administrativo, protegida por digitação da palavra-chave `"ZERAR"`, permitindo limpar registros de teste antes de iniciar o bolão real.
4. **Facilitador de Pagamento Pix**: Geração de QR Code Pix dinâmico de alta nitidez e botão de "Copiar Código Pix Copia e Cola" para pagamento instantâneo por celular ou computador.
5. **Prontidão para Deploy**: Criação dos arquivos `firebase.json` e `.firebaserc` para publicação imediata no Firebase Hosting.
6. **Harmonia Visual & Alinhamento**: Ajustes simétricos em `index.html` e `css/animations.css` garantindo layout perfeito, espaçamentos consistentes e zero quebra ou overflow em telas de 320px a 4K.

---

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+ Modules nativos no navegador).

**Primary Dependencies**: Tailwind CSS (CDN), FontAwesome 6 (CDN), Firebase Web SDK v10 Modular (via ESM CDN), Canvas Confetti (CDN), QR Code Service dinâmico.

**Hosting & Cloud Infrastructure**: Firebase Hosting (estático, CDN global, HTTPS automático), Firebase Firestore e Firebase Auth.

**Storage**: Firebase Cloud Firestore com persistência e fallback local realtime em LocalStorage.

**Target Platform**: Navegadores móveis (iOS Safari, Android Chrome) e desktop (Chrome, Edge, Firefox, Safari).

**Performance Goals**: Tempo de carregamento < 1.2s; 60 FPS nas animações do placar e modais; alinhamento visual sem salto de layout (Cumulative Layout Shift = 0).

---

## Constitution Check

| Princípio Constitucional | Avaliação | Justificativa |
|---|---|---|
| **I. Simplicidade e Autossuficiência (Zero-Build)** | ✅ PASSA | Hospedagem direta no Firebase Hosting sem etapas de build complexas. |
| **II. Experiência Mobile-First e Acessibilidade** | ✅ PASSA | Alinhamento rigoroso em telas pequenas e botões de toque com tamanho ergonômico. |
| **III. Sanitização de Input e Integridade** | ✅ PASSA | Validação e sanitização estrita com confirmação de segurança para reset de dados. |
| **IV. Transparência de Regras e Premiação** | ✅ PASSA | Fila clara de conferência de Pix e exibição pública dos comprovantes validados. |
| **V. Integração Social via WhatsApp & Pix** | ✅ PASSA | QR Code direto e links de WhatsApp com mensagens pré-formatadas. |

---

## Project Structure

```text
.
├── firebase.json            # Configuração do Firebase Hosting
├── .firebaserc              # Identificador do projeto no Firebase
├── index.html               # SPA com layout alinhado, QR Code Pix, modais e placar
├── js/
│   ├── config.js            # Configuração com campos boyBabyName e girlBabyName
│   ├── db.js                # Operações com suporte a resetAllGuesses()
│   ├── auth.js              # Autenticação administrativa com sessão persistente
│   ├── admin.js             # Fila rápida de Pix, reset de dados e form dos nomes
│   ├── ranking.js           # Placar animado com nomes oficiais dos bebês
│   ├── countdown.js         # Contagem regressiva para a data prevista
│   └── app.js               # Orquestrador com gerador de QR Code Pix e cópia
└── css/
    └── animations.css       # Estilos visuais, alinhamento responsivo e efeitos
```

---

## Complexity Tracking

> Não há violações constitucionais. O projeto permanece 100% estático, leve e compatível com Firebase Hosting gratuito.
