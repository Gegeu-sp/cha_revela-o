# Quickstart & Guia de Validação: Ícones e Alinhamento Visual Responsivo

**Feature**: `003-icones-e-alinhamento`
**Date**: 2026-10-23
**Status**: Ready for Validation

---

## 1. Pré-Requisitos

- Navegador moderno (Google Chrome, Edge, Safari ou Firefox).
- Servidor local HTTP estático (ex: `npx serve`, Python `http.server` ou extensão Live Server).

---

## 2. Cenários de Validação Visual Ponta a Ponta

### Cenário 1: Inspeção de Ícones no Cabeçalho e Placar
1. Abrir a aplicação no navegador em `http://localhost:[porta]` ou direto no arquivo `index.html`.
2. Verificar no cabeçalho superior (`#hero-baby-names`):
   - **Esperado**: O nome do menino está acompanhado de `🏋️` (barra de peso) e o da menina de `🪆` (boneca). Exemplo: `Argeu Neto 🏋️ vs Livia Rodrigues 🪆`.
3. Rolar até a seção **"Placar da Disputa"**:
   - **Esperado**: O card do Time do Menino exibe o ícone de barra de peso (`🏋️`) em destaque e o card do Time da Menina exibe a boneca (`🪆`). Ambos com altura perfeitamente alinhada e simétrica.

### Cenário 2: Formulário de Envio de Palpite
1. Rolar até a seção **"Qual é o seu palpite para o nosso bebê?"**:
2. Observar os dois botões de rádio estendidos:
   - Botão Menino: Ícone `🏋️` grande, rótulo "É o Argeu Neto!" e subtítulo "Time do Menino".
   - Botão Menina: Ícone `🪆` grande, rótulo "É a Livia Rodrigues!" e subtítulo "Time da Menina".
   - **Esperado**: Ambos os cartões possuem a mesma altura mínima, textos alinhados ao centro e espaçamentos idênticos.

### Cenário 3: Validação do Alinhamento Responsivo em Mobile
1. Abrir as Ferramentas de Desenvolvedor (F12) e alternar para a visualização de dispositivos móveis (Toggle Device Toolbar).
2. Testar nas larguras:
   - **360px** (Galaxy S8/S9 / telas estreitas)
   - **375px** (iPhone SE)
   - **390px / 414px** (iPhone 12/13/14 / Android padrão)
3. Verificar:
   - Cabeçalho: Sem quebras desordenadas e sem overflow horizontal (sem barra de rolagem lateral na página).
   - Ângulo reto: Nenhum bloco com inclinação estranha. Textos e ícones mantêm alinhamento vertical harmonioso.

### Cenário 4: Área dos Pais e Filtros
1. Clicar no botão **"Área dos Pais"** e autenticar-se.
2. Na aba de Configurações:
   - **Esperado**: Os rótulos exibem `🏋️ Nome Escolhido para Menino` e `🪆 Nome Escolhido para Menina`.
3. Na aba de Palpites e no modal de cadastro/edição manual:
   - **Esperado**: Os seletores dropdown contêm `<option value="boy">🏋️ Menino</option>` e `<option value="girl">🪆 Menina</option>`. As tags na tabela mostram `🏋️ Menino` e `🪆 Menina`.

### Cenário 5: Sorteio, Roleta e WhatsApp Link
1. No módulo de sorteio, realizar uma rodada de teste com participante vencedor:
   - **Esperado**: O resultado destaca o voto com `🏋️` ou `🪆`.
2. Ao acionar o link para WhatsApp:
   - **Esperado**: A mensagem gerada contém `🏋️` para menino ou `🪆` para menina, sem qualquer menção residual a `🌿` ou `🌸`.

---

## 3. Checklist Rápido de Teste Automatizado via Terminal / Ripgrep

Execute no terminal para assegurar que nenhum resíduo de 🌿 ou 🌸 permaneceu no projeto:

```bash
# Não deve retornar nenhuma linha no código do projeto:
rg "🌿|🌸" index.html js/
```
Resultado esperado: **0 ocorrências**.
