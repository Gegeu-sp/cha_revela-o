# Technical Research: Substituição de Ícones e Alinhamento Visual Responsivo

**Feature**: `003-icones-e-alinhamento`
**Date**: 2026-10-23
**Status**: Completed

---

## 1. Escolha e Padronização dos Ícones de Gênero

### Contexto
O usuário solicitou explicitamente a substituição dos ícones atuais de folha/ramo (🌿) e flor (🌸) por:
- **Menino**: Uma barra de peso.
- **Menina**: Uma boneca.
- Restrição: "fazer este troca onde estiver no site. apenas este ajuste".

### Análise de Compatibilidade nos Ambientes da Aplicação
Os ícones precisam renderizar corretamente em 4 contextos distintos:
1. **Elementos de layout HTML estilizados** (Header, Cards do Placar, Botões do Formulário de Voto, Modais).
2. **Elementos nativos de formulário `<select>` / `<option>`** (Filtros de gênero e cadastro na Área dos Pais). *Restrição*: Tags HTML (`<i>` ou `<svg>`) não são suportadas dentro de `<option>`. Apenas caracteres Unicode/emojis funcionam nativamente.
3. **Strings de compartilhamento e links do WhatsApp** (`https://wa.me/...`). *Restrição*: Mensagens de texto codificadas em URI não aceitam HTML; apenas caracteres e emojis Unicode são renderizados no aplicativo WhatsApp do celular do usuário.
4. **Strings dinâmicas de JavaScript** (`admin.js`, `ranking.js`, `raffle.js`, `app.js`).

### Decisões de Design de Ícones

#### Menino: Barra de Peso
- **Decisão**: Adotar o caractere Unicode **`🏋️`** (U+1F3CB - Halterofilista / Barra de Peso).
- **Justificativa**: 
  - Comunica imediatamente o conceito de "barra de peso" / musculação de forma universal.
  - Funciona de forma 100% nativa em `<option>`, mensagens do WhatsApp e nós de texto no DOM.
  - Escala perfeitamente com tamanhos de fonte utilitários do Tailwind (`text-xs`, `text-sm`, `text-4xl`).
- **Alternativas consideradas**:
  - *FontAwesome `fa-solid fa-dumbbell`*: Rejeitado como substituto universal porque quebraria os dropdowns `<select>` e mensagens de WhatsApp.
  - *Emoji de halter `🏋️‍♂️`*: Variação com modificador de gênero masculino, porém `🏋️` possui suporte mais compacto e compatível entre sistemas operacionais antigos e recentes.

#### Menina: Boneca
- **Decisão**: Adotar o caractere Unicode **`🪆`** (U+1FA86 - Boneca / Nesting Dolls).
- **Justificativa**:
  - É o símbolo padrão oficial do consórcio Unicode para "boneca" (doll).
  - É suportado nativamente pelo iOS, Android, Windows e navegadores modernos.
  - Funciona com perfeição em `<option>` e mensagens WhatsApp.
- **Alternativas consideradas**:
  - *Emoji de laço `🎀` ou ursinho `🧸`*: Rejeitados por não representarem literalmente uma "boneca" como pedido pelo usuário.
  - *Menininha `👧`*: Rejeitado por ser figura humana genérica, enquanto o usuário requisitou explicitamente o objeto "uma boneca".

---

## 2. Alinhamento Visual, Ângulo Reto e Harmonia Tipográfica

### Contexto
O usuário solicitou: *"alem disso, ajustar angulo da pagina, das letras para web e mobile. deixar alinhados"*.

### Diagnóstico de Alinhamento no Código Atual
1. **Header Principal (`#hero-baby-names`)**:
   - Atualmente possui `whitespace-nowrap overflow-hidden gap-1`. Em telas mobile pequenas (360px a 390px), os botões da direita (Área dos Pais + Participar + Menu Hamburguer) comprimem o espaço do logo, podendo cortar o nome do segundo bebê de maneira assimétrica.
   - **Solução**: Ajustar o alinhamento flex com `items-center`, `shrink-0` calibrado, baseline centralizada e garantir que o texto não fique recortado de forma desalinhada, permitindo quebra suave ou truncamento harmonioso em telas ultrapequenas.
2. **Simetria dos Cards de Menino e Menina (Placar e Formulário)**:
   - No Placar (`#score-card-boy` e `#score-card-girl`) e no Formulário de Voto (`label-boy-vote` e `label-girl-vote`), os blocos devem ter `h-full`, alinhamento vertical perfeitamente centrado (`flex flex-col items-center justify-center`), mesma linha de base para os textos e ícones em tamanho padronizado (`text-4xl`).
3. **Ângulo da Página e Tipografia (Retidão 0°)**:
   - Garantir que todos os containers, cards e tipografias mantenham orientação estritamente ortogonal (ângulo reto, sem rotações indesejadas, sem inclinações no eixo Z/X/Y).
   - Utilizar classes utilitárias de alinhamento (`inline-flex items-center justify-center align-middle`) para que o ícone ao lado de qualquer texto nunca fique mais alto ou mais baixo que a linha de texto adjacente.

---

## 3. Escopo Cirúrgico e Mapeamento de Ocorrências

### Mapeamento Completo de Substituições (🌿 ➔ 🏋️ e 🌸 ➔ 🪆):
1. **`index.html`**:
   - Linha 93: `Argeu Neto 🌿` ➔ `Argeu Neto 🏋️`
   - Linha 95: `Livia Rodrigues 🌸` ➔ `Livia Rodrigues 🪆`
   - Linha 315: `<span class="text-4xl">🌿</span>` ➔ `<span class="text-4xl">🏋️</span>`
   - Linha 337: `<span class="text-4xl">🌸</span>` ➔ `<span class="text-4xl">🪆</span>`
   - Linha 513: `<span class="text-4xl mb-2">🌿</span>` ➔ `<span class="text-4xl mb-2">🏋️</span>`
   - Linha 523: `<span class="text-4xl mb-2">🌸</span>` ➔ `<span class="text-4xl mb-2">🪆</span>`
   - Linha 823: `🌿 Nome Escolhido para Menino` ➔ `🏋️ Nome Escolhido para Menino`
   - Linha 831: `🌸 Nome Escolhido para Menina` ➔ `🪆 Nome Escolhido para Menina`
   - Linha 931: `<option value="boy">🌿 Menino</option>` ➔ `<option value="boy">🏋️ Menino</option>`
   - Linha 932: `<option value="girl">🌸 Menina</option>` ➔ `<option value="girl">🪆 Menina</option>`
   - Linha 992: `<option value="boy">🌿 Menino</option>` ➔ `<option value="boy">🏋️ Menino</option>`
   - Linha 993: `<option value="girl">🌸 Menina</option>` ➔ `<option value="girl">🪆 Menina</option>`
   - Linha 1131: `<option value="boy">🌿 Menino</option>` ➔ `<option value="boy">🏋️ Menino</option>`
   - Linha 1132: `<option value="girl">🌸 Menina</option>` ➔ `<option value="girl">🪆 Menina</option>`
2. **`js/admin.js`**:
   - Linha 563-564: Badges de status da tabela de palpites (`🌸 Menina` / `🌿 Menino` ➔ `🪆 Menina` / `🏋️ Menino`).
   - Linha 633: `randomTicket.gender === 'girl' ? '🌸 Menina' : '🌿 Menino'` ➔ `... '🪆 Menina' : '🏋️ Menino'`.
   - Linha 685: `winner.gender === 'girl' ? '🌸 Votou em Menina' : '🌿 Votou em Menino'` ➔ `... '🪆 Votou em Menina' : '🏋️ Votou em Menino'`.
3. **`js/app.js`**:
   - Linha 177: Mensagem de envio do WhatsApp: `isBoy ? '🌿 ' + boyName : '🌸 ' + girlName` ➔ `isBoy ? '🏋️ ' + boyName : '🪆 ' + girlName`.
4. **`js/raffle.js`**:
   - Linha 114: Notificação e compartilhamento do vencedor: `'Menina 🌸' : 'Menino 🌿'` ➔ `'Menina 🪆' : 'Menino 🏋️'`.
5. **`js/ranking.js`**:
   - Linha 45: Notificação de liderança Menino: `${boyName} está na liderança! 🌿` ➔ `${boyName} está na liderança! 🏋️`
   - Linha 52: Notificação de liderança Menina: `${girlName} está na liderança! 🌸` ➔ `${girlName} está na liderança! 🪆`
   - Linha 86: Linha de palpite do participante no ranking: `isBoy ? '🌿 ' + boyName : '🌸 ' + girlName` ➔ `isBoy ? '🏋️ ' + boyName : '🪆 ' + girlName`.

---

## 4. Conclusão
Todas as incertezas foram resolvidas. O plano preserva os contratos funcionais existentes e permite uma aplicação limpa, atômica e robusta.
