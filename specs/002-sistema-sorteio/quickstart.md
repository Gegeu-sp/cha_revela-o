# Quickstart: Validação do Sistema de Sorteio, Título e Autoria

**Feature Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16

---

## 1. Pré-Requisitos e Inicialização

1. Abrir o projeto em um navegador moderno (Chrome, Edge, Firefox, Safari ou Safari Mobile).
2. Servidor de desenvolvimento local (opcional) ou abertura direta de `index.html` via Live Server:
   ```powershell
   # Exemplo via npx serve ou Live Server
   npx serve .
   ```

---

## 2. Cenários de Validação Ponta a Ponta

### Cenário 1: Verificação do Novo Título e Créditos de Autoria
- **Passo 1**: Acessar a página inicial.
- **Resultado Esperado**:
  - No Hero principal, o título exibido é: **"Qual é o seu palpite para o nosso bebê?"**.
  - O visual mantém a harmonia com o gradiente da paleta oficial (#3B0069 / #03665A).
- **Passo 2**: Rolar a página até o rodapé.
- **Resultado Esperado**:
  - Exibição destacada e elegante da autoria: **"Criador e Autor: Argeu Rodrigues"**.
  - A tag `<meta name="author" content="Argeu Rodrigues">` está presente no inspecionar elemento.

---

### Cenário 2: Execução de Sorteio com Urna Ponderada e Celebração
- **Passo 1**: Fazer login no Painel dos Pais (senha: `admin123`).
- **Passo 2**: Certificar-se de que há pelo menos 2 palpites com status **Confirmado** (caso não haja, use a aba "Adicionar Manual" para criar, por exemplo: "Mariana" com 3 cotas Menino e "Carlos" com 1 cota Menina).
- **Passo 3**: Clicar na nova aba ou botão **"🎉 Sorteio da Rifa"**.
- **Passo 4**: Selecionar a modalidade **"Todos os Confirmados"** e clicar em **"Sortear Vencedor"**.
- **Resultado Esperado**:
  - Inicia-se a animação da roleta com alternância veloz dos nomes participantes.
  - A roleta desacelera gradativamente ao longo de ~3 a 4 segundos.
  - Trava no nome do ganhador com efeito de destaque.
  - Disparo imediato da chuva de confetes (`canvas-confetti`).
  - O Cartão do Vencedor exibe nome, palpite, cotas e botão de 1 clique para WhatsApp.

---

### Cenário 3: Validação da Modalidade "Apenas Acertadores"
- **Passo 1**: No modal de sorteio, escolher a modalidade **"Apenas Acertadores"**.
- **Passo 2**: Selecionar o gênero revelado (ex: Menino).
- **Passo 3**: Executar o sorteio.
- **Resultado Esperado**:
  - Apenas palpites confirmados que votaram no gênero escolhido entram na urna.
  - O ganhador sorteado pertence obrigatoriamente ao grupo vencedor do bolão.

---

### Cenário 4: Persistência do Histórico e Auditoria
- **Passo 1**: Após concluir o sorteio, recarregar a página (F5).
- **Passo 2**: Acessar novamente a aba de Sorteio no Painel dos Pais.
- **Resultado Esperado**:
  - O histórico de sorteios lista o ganhador sorteado anteriormente com data, horário e modalidade.
  - Caso o organizador queira realizar um 2º sorteio, a opção "Excluir já sorteados" impede a repetição do mesmo ganhador.
