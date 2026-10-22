# Implementation Plan: Sistema de Sorteio do Bolão, Título Oficial e Créditos de Autoria

**Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

**Input**: User description: "arrumar o titulo do que sera Qual é o seu palpite para o nosso bebê? alem disso, fazer o sistema do sorteio ja colocar como criador e autor Argeu Rodrigues"

---

## Summary

Implementar as três melhorias solicitadas com excelência estética, transparência e experiência mobile-first:
1. **Atualização do Título Principal (Hero)**: Substituir o texto anterior em `index.html` e constantes por "Qual é o seu palpite para o nosso bebê?", integrando o gradiente oficial da paleta nos destaques.
2. **Créditos Formais de Criação e Autoria**: Inserir no rodapé e metadados o crédito explícito "Criador e Autor: Argeu Rodrigues", mantendo alinhamento elegante e harmônico com o tema do evento.
3. **Módulo Completo de Sorteio Festivo**:
   - Criação do módulo `js/raffle.js` com motor de urna ponderada por cotas (`VirtualTicket`).
   - Modalidades de sorteio: Geral (todos os confirmados) vs Apenas Acertadores (filtrado pelo gênero revelado).
   - Animação de suspense de 3 a 5 segundos (roleta de nomes acelerada com desaceleração exponencial suave).
   - Efeito comemorativo de clímax com confetes (`canvas-confetti`) e Cartão do Vencedor.
   - Ação imediata com 1 clique para WhatsApp com mensagem festiva pré-formatada.
   - Persistência e sincronização de histórico de sorteios (`DrawResult`) no Firestore e LocalStorage para total auditoria.

---

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+ Modules nativos no navegador).

**Primary Dependencies**: Tailwind CSS (CDN), FontAwesome 6 (CDN), Canvas Confetti 1.9.3 (CDN), Firebase Web SDK v10 Modular (`firebase-app`, `firebase-firestore`).

**Storage**: Firebase Cloud Firestore (coleção `draws`) com fallback local resiliente em `LocalStorage` (`bolao_draws`).

**Testing / Validation**: Cenários manuais e de console definidos em [quickstart.md](quickstart.md).

**Target Platform**: Navegadores modernos móveis (iOS Safari, Android Chrome, Samsung Internet) e desktop (Chrome, Edge, Firefox, Safari).

**Project Type**: Single-Page Web Application (SPA Estática / Zero-Build).

**Performance Goals**: Animação de roleta a 60 FPS; tempo de carregamento < 1s; zero layout shift indesejado.

**Constraints**: Sem dependências pesadas de build (npm/webpack/vite); código modular ES6 nativo.

---

## Constitution Check

| Princípio Constitucional | Avaliação | Justificativa |
|---|---|---|
| **I. Simplicidade e Autossuficiência (Zero-Build)** | ✅ PASSA | Módulo `raffle.js` em Vanilla JS ES6 puro com reaproveitamento do `canvas-confetti` já carregado, sem bibliotecas externas pesadas. |
| **II. Experiência Mobile-First e Acessibilidade** | ✅ PASSA | Interface de sorteio adaptável para celulares e modo projeção em telão, com tipografia legível e contrastes WCAG AA. |
| **III. Sanitização de Input e Integridade** | ✅ PASSA | Todos os nomes e observações exibidos no sorteio passam por `escapeHtml` para proteção contra XSS; sorteio seguro via amostragem balanceada. |
| **IV. Transparência de Regras e Premiação** | ✅ PASSA | Urna estritamente proporcional às cotas adquiridas; persistência do histórico com carimbo de tempo inviolável para auditoria. |
| **V. Integração Social via WhatsApp** | ✅ PASSA | Botão direto com mensagem de felicitações pré-preenchida no WhatsApp para contato instantâneo com o vencedor. |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-sistema-sorteio/
├── spec.md              # Requisitos e especificações funcionais
├── plan.md              # Este plano de implementação
├── research.md          # Pesquisa técnica e decisões de arquitetura
├── data-model.md        # Modelo de dados e entidades do sorteio
├── contracts/           # Contratos dos módulos e persistência
│   └── draw-service.md  # Contrato da API de sorteio
├── checklists/
│   └── requirements.md  # Checklist de validação de qualidade
└── quickstart.md        # Guia de validação ponta a ponta
```

### Source Code (repository root)

```text
.
├── index.html           # Título atualizado, créditos de Argeu Rodrigues e modal/seção do Sorteio
├── css/
│   └── animations.css   # Animações de suspense, roleta e pulso do vencedor
├── js/
│   ├── raffle.js        # [NOVO] Motor de sorteio ponderado, animação da roleta e WhatsApp link
│   ├── db.js            # [ATUALIZADO] Persistência em Firestore (coleção 'draws') e LocalStorage
│   ├── state.js         # [ATUALIZADO] Suporte a estado reativo de sorteios e vencedores
│   ├── admin.js         # [ATUALIZADO] Integração da aba/controles de sorteio no Painel dos Pais
│   └── app.js           # [ATUALIZADO] Renderização do novo título e inicialização do sorteador
```

---

## Complexity Tracking

> Não há violações constitucionais. A arquitetura permanece 100% estática, performática e aderente aos princípios do projeto.
