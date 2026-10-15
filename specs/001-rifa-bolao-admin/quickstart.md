# Quickstart & Validation Guide: Gestão de Rifa e Bolão

**Feature**: `001-rifa-bolao-admin`
**Date**: 2026-10-14
**Status**: Ready for Implementation

Este guia define os cenários executáveis de validação de ponta a ponta (E2E) para comprovar o funcionamento completo da funcionalidade.

---

## 1. Pré-Requisitos e Ambiente

- Navegador web moderno (Chrome, Safari, Firefox ou Edge).
- Servidor local HTTP estático (por exemplo: VS Code Live Server ou `python -m http.server 8000` ou `npx serve .`).
- Configuração do Firebase no arquivo de configuração do projeto (com modo fallback de demonstração habilitado caso não haja chaves ainda).

---

## 2. Cenários de Validação Ponta a Ponta

### Cenário 1: Autenticação do Administrador e Acesso ao Painel
- **Ação**:
  1. Abrir a página no navegador.
  2. Clicar no botão discreto "Área dos Pais" (no cabeçalho ou rodapé).
  3. Preencher e-mail e senha cadastrados no modal de login.
  4. Clicar em "Entrar".
- **Resultado Esperado**:
  - O modal de autenticação fecha com feedback de sucesso.
  - O painel de administração é exibido com abas: "Palpites & Pagamentos", "Configurações do Evento" e "Novo Palpite Manual".
  - O botão no cabeçalho passa a indicar "Painel dos Pais (Logado)" com opção de "Sair".

### Cenário 2: Configuração de Valor de Cota e Data Prevista de Nascimento
- **Ação**:
  1. No painel de administração, navegar até a aba "Configurações do Evento".
  2. Alterar o valor da cota para `R$ 20,00`.
  3. Definir a data prevista de nascimento para `2026-11-20`.
  4. Informar a chave Pix e titular.
  5. Clicar em "Salvar Configurações".
- **Resultado Esperado**:
  - Notificação de sucesso "Configurações salvas com sucesso!".
  - O texto explicativo na página pública atualiza o valor da cota para R$ 20,00.
  - O card de data prevista exibe a data formatada e o contador regressivo em dias, horas e minutos.

### Cenário 3: Registro de Palpite pelo Convidado com Múltiplas Cotas
- **Ação**:
  1. Na seção pública "Enviar Palpite", preencher o nome `Mariana Rios` e WhatsApp `(11) 98765-4321`.
  2. Selecionar o palpite "É Menina! 💖".
  3. Selecionar quantidade de cotas: `3 cotas`.
  4. Observar o valor total calculado dinamicamente (`3 x R$ 20,00 = R$ 60,00`).
  5. Clicar em "Confirmar e Salvar Palpite".
- **Resultado Esperado**:
  - O formulário limpa e exibe a mensagem de sucesso.
  - Um novo registro aparece no topo da tabela pública com status "Aguardando Pix".
  - O botão de WhatsApp abre link contendo a mensagem pré-formatada com as 3 cotas e o valor de R$ 60,00.

### Cenário 4: Confirmação de Pagamento pelo Administrador e Atualização do Placar
- **Ação**:
  1. No painel de administração, na lista de palpites pendentes, localizar o palpite de `Mariana Rios`.
  2. Clicar no botão verde "Confirmar Pagamento".
- **Resultado Esperado**:
  - O status muda instantaneamente para "Confirmado".
  - O total de arrecadação pública soma R$ 60,00.
  - O placar animado Menino vs Menina recalcula a porcentagem ao vivo e a barra da Menina cresce suavemente com animação fluida (60fps).
  - Um efeito festivo visual (confetes) é acionado celebrando a confirmação.

### Cenário 5: Adição Manual de Palpite (Pagamento em Dinheiro)
- **Ação**:
  1. No painel do administrador, acessar a aba "Novo Palpite Manual".
  2. Inserir nome `Tio Roberto`, palpite `Menino 💙`, cotas `2` e marcar nota "Pago em mãos no almoço de domingo".
  3. Clicar em "Registrar Palpite".
- **Resultado Esperado**:
  - O registro entra imediatamente com status "Confirmado" e tag visual "(Manual)".
  - Os contadores de votos e o placar contabilizam as cotas do Menino instantaneamente.

### Cenário 6: Edição e Correção de Palpite
- **Ação**:
  1. No painel do administrador, clicar em "Editar" no palpite de `Tio Roberto`.
  2. Corrigir o nome para `Tio Roberto Carlos` e cotas de 2 para 3.
  3. Salvar alterações.
- **Resultado Esperado**:
  - O nome é atualizado na tabela e o placar recalcula as cotas adicionais.
