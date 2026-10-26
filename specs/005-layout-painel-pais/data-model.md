# Data Model & UI State: Navegação do Painel dos Pais

**Feature Branch**: `005-layout-painel-pais`  
**Date**: 2026-10-26  
**Status**: Completed  

---

## 1. UI State Model: Abas Administrativas

O controle de navegação do modal de administração é gerenciado pelo estado efêmero de UI em memória (DOM + `js/admin.js`).

### Entidade: `AdminTab`

| Propriedade | Tipo | Valores Permitidos | Descrição |
|-------------|------|--------------------|-----------|
| `id` | `string` | `'palpites' \| 'config' \| 'manual' \| 'sorteio'` | Identificador único da aba |
| `label` | `string` | Nome exibido na interface | Ex: `"Palpites & Pix"`, `"Nomes & Configurações"` |
| `icon` | `string` | Classe FontAwesome | Ex: `"fa-solid fa-list-check"` |
| `targetPaneId` | `string` | ID do container DOM | Ex: `"admin-tab-palpites"` |
| `badge` | `string \| null` | Contador opcional | Ex: `"7 pendentes"` (para palpites) |
| `isActive` | `boolean` | `true \| false` | Indica se a aba está visível no momento |

---

## 2. Transições de Estado

```text
[Aba Ativa: Palpites]
   │
   ├── Clique em "Nomes & Configurações" ──> [Aba Ativa: Config] (exibe formulário, esconde tabela)
   │
   ├── Clique em "Adicionar Manual"     ──> [Aba Ativa: Manual] (exibe cadastro rápido)
   │
   └── Clique em "Sorteio do Bolão"     ──> [Aba Ativa: Sorteio] (exibe urna, atualiza resumo)
```

### Regras de Transição:
1. **Exclusividade**: Apenas uma única aba (`.admin-tab-pane`) pode estar sem a classe `.hidden` simultaneamente.
2. **Atualização Visual Atômica**:
   - A aba selecionada ganha as classes de pílula ativa: `bg-white text-[#3B0069] shadow-sm font-bold`.
   - As abas desmarcadas voltam às classes inativas: `text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium`.
3. **Trigger de Atualização**:
   - Quando a aba `'sorteio'` se torna ativa, a função `updateRaffleUI()` é invocada imediatamente para recalcular participantes elegíveis e cotas confirmadas.
