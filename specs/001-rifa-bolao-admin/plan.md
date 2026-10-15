# Implementation Plan: Gestão Completa de Rifa e Bolão com Painel Administrativo

**Branch**: `001-rifa-bolao-admin` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md)

**Input**: Atualização de requisitos do usuário para:
1. **Nova Paleta de Cores Sofisticada**: Substituição das cores padrão azul/rosa pelos 6 tons fornecidos na imagem:
   - Tons Roxo/Lilás: `#3B0069` (Roxo Imperial/Profundo), `#8F56AD` (Ametista/Lilás Vibrante), `#BE9ECF` (Lavanda Suave).
   - Tons Esmeralda/Menta: `#03665A` (Verde Floresta/Esmeralda Profundo), `#689D97` (Verde Sálvia/Teal Médio), `#CEE1DF` (Menta Gelo/Aqua Claro).
2. **Sincronização Multi-Dispositivo**: Configurar credenciais reais do Firebase Web SDK geradas para o projeto `rifa-bolao` no Firestore, com listeners em tempo real (`onSnapshot`) para que configurações salvas e palpites no computador dos pais reflitam instantaneamente no smartphone dos convidados.
3. **Enquadramento Perfeito (Web & Mobile)**: Ajustar larguras máximas, margens e paddings em containers, tipografia adaptável, evitar corte de elementos ou scroll lateral e aprimorar a ergonomia dos cards e modais em telas de 320px até ultrawide.
4. **Entrega Contínua (GitHub + Firebase)**: Versionamento completo dos ajustes no GitHub e publicação em produção no Firebase Hosting.

---

## Summary

Expandir e refinar a aplicação com foco em elegância estética, sincronização em nuvem e ergonomia responsiva:
1. **Design System com Cores da Imagem**: Customizar tema Tailwind (`tailwind.config`) e `css/animations.css` mapeando os 6 tons para os lados Menino (Tons Menta/Esmeralda) e Menina (Tons Lilás/Roxo), com gradientes suaves e contrastes acessíveis (WCAG AA).
2. **Sincronização em Nuvem Firestore**: Inserir credenciais do Web App `bolao-revelacao` (`apiKey`, `projectId: rifa-bolao`, `appId`, etc.) em `js/config.js`, permitindo sincronização em nuvem automática e persistente entre múltiplos aparelhos.
3. **Indicador de Conexão**: Exibir badge de status de sincronização (ex: "☁️ Nuvem Ativa" / "💾 Local") para que os pais tenham certeza de que os dados estão sincronizados.
4. **Refinamento de Enquadramento Web & Mobile**: Padronizar containers com `max-w-5xl`, `px-4 sm:px-6`, cards com sombra suave, tabela com rolagem horizontal contida e modais com rolagem interna sem transbordar a tela do smartphone.
5. **Deploy & Versionamento**: Subir commits organizados no GitHub e executar deploy em produção via `firebase deploy --only hosting`.

---

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+ Modules nativos no navegador).

**Primary Dependencies**: Tailwind CSS (CDN), FontAwesome 6 (CDN), Firebase Web SDK v10 Modular (`firebase-app`, `firebase-firestore`, `firebase-auth`), Canvas Confetti (CDN).

**Hosting & Cloud Infrastructure**: Firebase Hosting (`rifa-bolao.web.app`), Firebase Firestore (`(default)`), Firebase Authentication.

**Target Platform**: Navegadores móveis (iOS Safari, Android Chrome, Samsung Internet) e desktop (Chrome, Edge, Firefox, Safari).

**Performance Goals**: Tempo de carregamento < 1s; 60 FPS nas animações do placar; zero layout shift indesejado.

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
