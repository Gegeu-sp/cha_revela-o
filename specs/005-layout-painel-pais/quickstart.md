# Quickstart & Visual Validation Guide: Layout das Abas do Painel dos Pais

**Feature Branch**: `005-layout-painel-pais`  
**Date**: 2026-10-26  
**Status**: Ready for Verification  

Este guia orienta a validação visual e interativa das melhorias de layout no Painel dos Pais.

---

## 1. Pré-Requisitos

1. Navegador moderno (Chrome, Edge, Firefox ou Safari).
2. Acesso à aplicação local ou em produção (`https://rifa-bolao.web.app`).

---

## 2. Cenários de Validação

### Cenário 1: Inspeção Visual do Segmented Control (Sem Cortes ou Linhas Feias)
**Objetivo**: Provar que os textos e ícones das 4 abas estão 100% legíveis e que não há linhas cinzas atravessando as palavras.

- **Passo 1**: Clique em **Área dos Pais** e faça login com a credencial oficial.
- **Passo 2**: Observe a nova barra de navegação no topo do painel.
- **Resultado Esperado**:
  - As abas estão alojadas em uma pílula cinza suave (`bg-slate-200/70`).
  - A aba ativa *"Palpites & Pix"* tem fundo branco limpo, cantos arredondados e sombra sutil.
  - As abas *"Nomes & Configurações"*, *"Adicionar Manual"* e *"Sorteio do Bolão"* têm tipografia nítida sem nenhuma linha horizontal cortando as letras.

---

### Cenário 2: Alternância Suave e Estado Ativo das Abas
**Objetivo**: Validar a interatividade e a atualização do conteúdo de cada aba.

- **Passo 1**: Clique na aba **Nomes & Configurações**.
  - **Resultado**: A aba ganha o fundo branco com sombra instantaneamente; o painel de configurações é exibido; as demais abas voltam ao estado suave inativo.
- **Passo 2**: Clique na aba **Adicionar Manual**.
  - **Resultado**: O formulário de registro de palpite manual é renderizado com espaçamento confortável.
- **Passo 3**: Clique na aba **Sorteio do Bolão**.
  - **Resultado**: A arena da urna e o contador de cotas confirmadas elegíveis são atualizados e exibidos sem cortes no canto direito.
- **Passo 4**: Retorne para **Palpites & Pix**.
  - **Resultado**: A tabela de palpites reaparece com os filtros e status intactos.

---

### Cenário 3: Responsividade Mobile e Respiro Lateral
**Objetivo**: Confirmar que telas estreitas não quebram o layout nem sobrepõem barras de rolagem.

- **Passo 1**: Abra as Ferramentas do Desenvolvedor (F12) e ative a visualização móvel (dimensões de 375px a 412px, ex: iPhone ou Galaxy).
- **Passo 2**: Deslize horizontalmente sobre a barra de abas.
- **Resultado Esperado**:
  - As abas deslizam suavemente sem quebrar em duas linhas.
  - Não há scrollbar cinza feia nativa poluindo o design.
  - A última aba mantém espaçamento de respiro à direita, sem ser sobreposta pela barra de rolagem vertical do modal.

---

### Cenário 4: Cabeçalho Despoluído e Sem Redundâncias
**Objetivo**: Verificar que o topo do modal está limpo e elegante.

- **Resultado Esperado**:
  - Título *"Painel dos Pais"* e badge *"X pendentes"* bem alinhados à esquerda.
  - Badge *"Firebase Nuvem"* e botão *"Sair"* organizados à direita, sem botão duplicado de sorteio no topo.
