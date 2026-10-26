# UI Contract: Navegação por Abas do Painel dos Pais

**Feature Branch**: `005-layout-painel-pais`  
**Date**: 2026-10-26  
**Status**: Completed  

---

## 1. Estrutura DOM da Barra de Navegação

A barra de navegação dentro de `#admin-dashboard-modal` obedece ao seguinte contrato de marcação:

```html
<!-- Container de Abas com Segmented Control e Scroll Suave -->
<div class="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center overflow-x-auto no-scrollbar">
    <div class="inline-flex p-1 bg-slate-200/70 rounded-2xl gap-1 flex-nowrap" role="tablist" aria-label="Navegação do Painel dos Pais">
        
        <!-- Aba 1: Palpites & Pix (Ativa por padrão) -->
        <button type="button" role="tab" data-tab="palpites" id="tab-btn-palpites" aria-selected="true"
            class="admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#3B0069] bg-white rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fa-solid fa-list-check text-xs"></i>
            <span>Palpites & Pix</span>
        </button>

        <!-- Aba 2: Nomes & Configurações -->
        <button type="button" role="tab" data-tab="config" id="tab-btn-config" aria-selected="false"
            class="admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fa-solid fa-sliders text-xs"></i>
            <span>Nomes & Configurações</span>
        </button>

        <!-- Aba 3: Adicionar Manual -->
        <button type="button" role="tab" data-tab="manual" id="tab-btn-manual" aria-selected="false"
            class="admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fa-solid fa-user-plus text-xs"></i>
            <span>Adicionar Manual</span>
        </button>

        <!-- Aba 4: Sorteio do Bolão -->
        <button type="button" role="tab" data-tab="sorteio" id="tab-btn-sorteio" aria-selected="false"
            class="admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fa-solid fa-gift text-xs text-[#8F56AD]"></i>
            <span>Sorteio do Bolão</span>
        </button>
    </div>
</div>
```

---

## 2. Contrato de Classes JavaScript (`js/admin.js`)

Na função `switchAdminTab(targetTab)`:

### Classes da Aba Ativa:
```javascript
const ACTIVE_TAB_CLASSES = 'admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#3B0069] bg-white rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap';
```

### Classes da Aba Inativa:
```javascript
const INACTIVE_TAB_CLASSES = 'admin-tab-btn flex-shrink-0 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap';
```

---

## 3. Contrato de Acessibilidade
- O container externo possui `role="tablist"`.
- Cada botão possui `role="tab"` e `aria-selected="true|false"`.
- Área mínima de toque por botão: 40px de altura vertical com padding horizontal generoso.
- Contraste do texto ativo `#3B0069` sobre fundo branco `#FFFFFF`: taxa de 11.2:1 (Supera WCAG AAA).
- Contraste do texto inativo `slate-600` (`#475569`) sobre fundo `slate-200` (`#E2E8F0`): taxa de 4.8:1 (Supera WCAG AA).
