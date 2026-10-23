# Implementation Plan: Substituição de Ícones de Gênero (Barra de Peso e Boneca) e Alinhamento Visual Responsivo

**Branch**: `003-icones-e-alinhamento` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

**Input**: User description: "trocar este icones 🌿🌸. por menino uma barra de peso e menina uma boneca. fazer este troca onde estiver no site. apenas este ajuste. alem disso, ajustar angulo da pagina, das letras para web e mobile. deixar alinhados"

---

## Summary

Executar a atualização visual solicitada de forma cirúrgica e atômica:
1. **Substituição Global de Ícones**:
   - Menino: Substituição de todas as ocorrências de `🌿` pelo símbolo de barra de peso / halter (`🏋️`).
   - Menina: Substituição de todas as ocorrências de `🌸` pelo símbolo de boneca (`🪆`).
   - Abrangência: `index.html` (cabeçalho, placar, formulário, inputs de configuração e dropdowns de administração) e módulos em `js/` (`admin.js`, `app.js`, `raffle.js`, `ranking.js`), incluindo geração de mensagens para WhatsApp.
2. **Alinhamento Visual Responsivo e Retidão (Web e Mobile)**:
   - Garantir ângulo reto (0deg) sem qualquer distorção ou rotação nas seções e tipografias.
   - Refinar o alinhamento vertical dos pares ícone+texto (com `items-center` e baseline nivelada).
   - Equalizar altura e simetria dos cards do placar e dos botões de seleção de palpite tanto em smartphones quanto em telas desktop.
   - Preservar o cabeçalho móvel sem quebra desalinhada de nomes e com zero overflow horizontal.
3. **Preservação de Integridade**:
   - Manter as chaves de dados (`boy`, `girl`), as regras de cálculo, a persistência no Firestore/LocalStorage e o fluxo de pagamento Pix.

---

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+ nativo no navegador).

**Primary Dependencies**: Tailwind CSS (CDN), FontAwesome 6 (CDN), Canvas Confetti (CDN), Firebase Web SDK v10 Modular.

**Storage**: Firebase Cloud Firestore com fallback em LocalStorage (inalterados).

**Testing / Validation**: Guia de verificação ponta a ponta e testes de integridade descritos em [quickstart.md](quickstart.md).

**Target Platform**: Navegadores móveis (Safari iOS, Chrome Android) e desktop (Chrome, Edge, Firefox, Safari).

**Project Type**: Single-Page Application Estática (Zero-Build).

**Performance Goals**: Zero Cumulative Layout Shift (CLS), tempo de carregamento instantâneo, 60 FPS em animações.

**Constraints**: "Apenas este ajuste" — nenhuma regra de negócio alterada; compatibilidade estrita em `<select>` e links WhatsApp através de caracteres Unicode padronizados.

---

## Constitution Check

| Princípio Constitucional | Avaliação | Justificativa |
|---|---|---|
| **I. Simplicidade e Autossuficiência (Zero-Build)** | ✅ PASSA | Utilização de emojis Unicode universais (`🏋️` e `🪆`) e classes utilitárias nativas do Tailwind, sem adicionar dependências ou scripts de build. |
| **II. Experiência Mobile-First e Acessibilidade** | ✅ PASSA | O ajuste de ângulo e alinhamento responde diretamente à ergonomia em smartphones, assegurando alinhamento vertical limpo e zero overflow lateral. |
| **III. Sanitização de Input e Integridade** | ✅ PASSA | As chaves canônicas de dados (`boy` e `girl`) são estritamente preservadas, sem impactar a validação ou integridade de palpites. |
| **IV. Transparência de Regras e Premiação** | ✅ PASSA | Nenhuma regra de pontuação, cálculo de cotas ou sorteio é modificada. |
| **V. Integração Social via WhatsApp** | ✅ PASSA | As mensagens pré-formatadas para WhatsApp são atualizadas com os novos ícones, mantendo formatação impecável no mensageiro. |

---

## Project Structure

### Documentation (this feature)

```text
specs/003-icones-e-alinhamento/
├── spec.md                     # Especificação funcional e requisitos
├── plan.md                     # Este plano de implementação
├── research.md                 # Pesquisa de ícones Unicode e alinhamento responsivo
├── data-model.md               # Modelo de dados e tokens visuais
├── contracts/
│   └── ui-alignment-tokens.md  # Contrato formal de UI e mensagens
├── checklists/
│   └── requirements.md         # Checklist de qualidade da especificação
└── quickstart.md               # Roteiro de validação ponta a ponta
```

### Source Code (repository root)

```text
.
├── index.html                  # Substituição de ícones no DOM e classes de alinhamento/simetria
├── css/
│   └── animations.css          # Garantia de retidão (0deg) e classes utilitárias de alinhamento
└── js/
    ├── admin.js                # Atualização de badges, tags e mensagens do painel administrativo
    ├── app.js                  # Atualização da mensagem de palpite formatada para WhatsApp
    ├── raffle.js               # Atualização da identificação de gênero no sorteador e WhatsApp
    └── ranking.js              # Atualização das notificações de liderança e linhas do ranking
```

---

## Complexity Tracking

> Não há violações constitucionais nem complexidades adicionais. A implementação é cirúrgica, atômica e estritamente aderente ao escopo delimitado pelo usuário.
