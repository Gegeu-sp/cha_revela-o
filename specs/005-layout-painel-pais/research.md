# Technical Research: Reformulação do Layout e Navegação das Abas do Painel dos Pais

**Feature Branch**: `005-layout-painel-pais`  
**Date**: 2026-10-26  
**Status**: Completed  

---

## 1. Problema Visual Diagnosticado

Ao analisar o código de [index.html](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/index.html) e [js/admin.js](file:///c:/Users/MUSCULA%C3%87%C3%83O/Documents/Cha_revelação/js/admin.js), e comparar com o print enviado pelo usuário, identificamos as seguintes causas de quebra de layout:

1. **Conflito de Bordas e Linha Cortando as Abas**:
   - O container utilizava `px-6 pt-3 border-b border-slate-200`.
   - As abas ativas recebiam `border-b-2 border-[#8F56AD] rounded-t-xl bg-[#BE9ECF]/20`.
   - As abas inativas não tinham altura compensada nem borda inferior correspondente.
   - Como o container tinha `overflow-x-auto` e padding superior sem margem negativa inferior (`-mb-px`), a linha cinza do container (`border-b border-slate-200`) e a altura de linha criavam um corte horizontal cinza/escuro atravessando as palavras das abas inativas (*"Nomes & Configurações"* e *"Adicionar Manual"*).

2. **Corte e Prensagem da Aba de Sorteio**:
   - A aba *"Sorteio do Bolão"* ficava no extremo direito. A barra de rolagem vertical nativa do modal (`overflow-y-auto` em `.p-6`) causava sobreposição e recorte no botão quando a tela tinha menos de 1100px de largura.

3. **Superlotação do Cabeçalho**:
   - O cabeçalho continha simultaneamente:
     1. Título + Ícone de Coroa + Badge de Pendentes + Subtítulo
     2. Botão de Atalho "Sorteio" (`#btn-quick-raffle`)
     3. Badge "Firebase Nuvem"
     4. Botão "Sair"
     5. Botão "X" de fechar
   - Ter um botão de "Sorteio" no cabeçalho e uma aba de "Sorteio" imediatamente abaixo causava redundância e empurrava os elementos em resoluções menores.

---

## 2. Decisões Arquiteturais e de Design

### Decisão 1: Migração para Segmented Pill Control Moderno
- **Abordagem Escolhida**: Substituir o padrão frágil de abas com borda inferior por um container estilo **Segmented Pill Control** (`bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 inline-flex flex-nowrap gap-1.5`).
- **Aba Ativa**: `bg-white text-[#3B0069] shadow-sm font-bold rounded-xl`.
- **Aba Inativa**: `text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium rounded-xl`.
- **Vantagens**:
  - Elimina completamente bordas inferiores conflitantes e linhas cortando o texto.
  - Cada botão se comporta como uma cápsula independente com cantos arredondados elegantes.
  - Oferece alto contraste (WCAG AA) e indicação tátil imediata.

### Decisão 2: Tratamento de Overflow Horizontal Elegante
- **Abordagem Escolhida**:
  - Adicionar utilitário de scroll suave sem scrollbar visível no container das abas (`no-scrollbar` com `scrollbar-width: none; -ms-overflow-style: none; &::-webkit-scrollbar { display: none; }`).
  - Garantir `whitespace-nowrap` e `flex-shrink-0` em cada botão.
  - Adicionar padding lateral de respiro no container (`px-6 py-2.5`) para que a última aba nunca encoste na borda ou na barra de rolagem vertical.

### Decisão 3: Despoluição e Harmonização do Cabeçalho
- **Abordagem Escolhida**:
  - Remover a duplicidade do botão de atalho "Sorteio" do cabeçalho direito, já que a aba *"Sorteio do Bolão"* é um item de primeiro nível perfeitamente acessível com 1 clique na barra de navegação.
  - Manter o badge *"Firebase Nuvem"*, botão *"Sair"* e botão *"X"* com alinhamento vertical rigoroso (`items-center gap-2`), garantindo área de toque ergonômica mínima de 44px.

---

## 3. Alternativas Rejeitadas

| Alternativa | Por que foi rejeitada |
|-------------|-----------------------|
| Manter abas com borda e usar `-mb-px` | Muito frágil em navegadores com zoom ou renderizadores mobile com sub-pixel rendering (continua apresentando linhas de 0.5px cortando o texto). |
| Transformar abas em menu dropdown | Adiciona 1 clique a mais e esconde seções vitais dos pais (palpites e sorteio). |
| Quebrar abas em 2 linhas (wrap) | Consome muito espaço vertical do modal em smartphones, empurrando a tabela de palpites para fora do viewport inicial. |
