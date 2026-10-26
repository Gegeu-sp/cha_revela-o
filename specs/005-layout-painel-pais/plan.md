# Implementation Plan: Reformulação do Layout e Navegação das Abas do Painel dos Pais

**Branch**: `005-layout-painel-pais` | **Date**: 2026-10-26 | **Spec**: [spec.md](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revela%C3%A7%C3%A3o/specs/005-layout-painel-pais/spec.md)

**Input**: Feature specification from `specs/005-layout-painel-pais/spec.md`

## Summary

Substituir o padrão antigo de abas com borda inferior no Painel dos Pais por um container moderno estilo **Segmented Pill Control** (`bg-slate-200/70 p-1 rounded-2xl`). Esta mudança elimina por completo os conflitos de borda que geravam linhas cinzas cortando o texto das abas *"Nomes & Configurações"* e *"Adicionar Manual"*, concede espaçamento e visibilidade total para a aba *"Sorteio do Bolão"*, remove elementos redundantes no cabeçalho do modal e adiciona rolagem horizontal com scrollbar oculta para excelente ergonomia em celulares.

## Technical Context

**Language/Version**: HTML5 semântico, CSS3 (Tailwind CSS CDN v3), Vanilla JavaScript (ES6+ Modular)  
**Primary Dependencies**: Tailwind CSS, FontAwesome 6 (ícones), Google Fonts (Outfit / Fredoka)  
**Storage**: N/A (alteração puramente de layout e apresentação visual)  
**Testing**: Inspeção visual em resoluções Desktop (1024px+), Tablet (768px) e Mobile (375px a 412px)  
**Target Platform**: Web (Desktop e Mobile em navegadores modernos)  
**Project Type**: Single-page application com arquitetura Zero-Build  
**Performance Goals**: Latência de alternância de abas < 50ms, 60 FPS nas transições, 0 Cumulative Layout Shift (CLS)  
**Constraints**: Preservação da arquitetura Zero-Build (sem bundlers ou pré-processadores) e conformidade com a paleta oficial do evento  
**Scale/Scope**: 1 modal (`#admin-dashboard-modal`), 4 abas (`palpites`, `config`, `manual`, `sorteio`), afetando `index.html` e `js/admin.js`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Justificativa |
|-----------|-----------|---------------|
| **I. Simplicidade e Autossuficiência (Zero-Build)** | ✅ PASS | Implementação direta usando classes utilitárias Tailwind já carregadas e JavaScript nativo sem novas dependências. |
| **II. Mobile-First e Acessibilidade** | ✅ PASS | Área de toque expandida (>40px), navegação por pílulas com scroll por toque, sem scrollbar invasiva, contraste WCAG AA/AAA. |
| **III. Sanitização de Input e Integridade** | ✅ PASS | Nenhuma manipulação ou entrada de dados nova; não interfere com regras do Firestore ou payloads. |
| **IV. Transparência de Regras e Premiação** | ✅ PASS | Melhora a visualização da aba oficial de sorteio e do status dos palpites pendentes. |
| **V. Integração Social via WhatsApp** | ✅ PASS | Preserva integralmente todas as ações da tabela de palpites e links de contato. |

## Project Structure

### Documentation (this feature)

```text
specs/005-layout-painel-pais/
├── spec.md              # Especificação de requisitos funcionais e cenários
├── plan.md              # Este plano de implementação
├── research.md          # Pesquisa técnica e diagnóstico das quebras de layout
├── data-model.md        # Modelo de estado de UI das abas
├── quickstart.md        # Roteiro de validação visual e responsiva
├── contracts/
│   └── admin-tabs-contract.md # Contrato de marcação DOM e classes de estilo
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
├── index.html           # Modal #admin-dashboard-modal (cabeçalho e barra de abas redesenhadas)
├── js/
│   └── admin.js         # Função switchAdminTab() atualizada com classes do segmented control
└── css/
    └── animations.css   # Utilitário .no-scrollbar para rolagem limpa em navegadores móveis
```

**Structure Decision**: Modificações centralizadas no modal administrativo em `index.html` e sincronização no controlador em `js/admin.js`, sem criar arquivos supérfluos.

## Complexity Tracking

Nenhuma violação aos princípios da Constituição.
