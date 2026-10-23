# UI & Component Contract: Tokens de Ícones e Alinhamento Visual

**Feature**: `003-icones-e-alinhamento`
**Date**: 2026-10-23
**Status**: Formal Contract

---

## 1. Contrato dos Tokens de Ícones

Todos os módulos do sistema que renderizam ou formatam textos com ícones de gênero DEVEM obedecer às seguintes constantes canônicas:

```javascript
// Contrato de Identidade Visual
export const GENDER_ICONS = {
  boy: '🏋️',  // Barra de peso / Halter
  girl: '🪆'   // Boneca
};

export const GENDER_TAGS = {
  boy: '🏋️ Menino',
  girl: '🪆 Menina'
};

export const GENDER_VOTED_LABELS = {
  boy: (name) => `🏋️ ${name}`,
  girl: (name) => `🪆 ${name}`
};
```

---

## 2. Contrato de Alinhamento Tipográfico e Ortogonalidade

Todos os componentes visuais que contêm ícone e texto adjacente DEVEM implementar as seguintes diretrizes de CSS/Tailwind:

1. **Alinhamento Vertical de Ícones e Textos**:
   - Elementos em linha: `inline-flex items-center gap-1.5` ou `flex items-center gap-2`.
   - Proibido uso de alinhamento com margens manuais assimétricas (`mt-[-3px]`, `top-1` avulso) que distorçam em diferentes resoluções.
2. **Retidão Angular (0deg)**:
   - Nenhum container ou tipografia deve possuir `transform: rotate(...)` ou `skew(...)` exceto se expressamente delimitado como microanimação de clique temporário.
3. **Simetria dos Blocos de Voto e Placar**:
   - Os cards do Time Menino e Time Menina devem ter classes equivalentes:
     - Placar: `p-6 rounded-3xl bg-gradient-to-br border-2 border-slate-100 flex flex-col justify-between`
     - Formulário: `min-h-[140px] flex flex-col items-center justify-center p-4 sm:p-5 text-center`
4. **Header Responsivo em Telas Pequenas**:
   - O container `#hero-baby-names` deve permanecer contido sem quebrar a barra de navegação:
     `text-xs text-slate-500 font-semibold flex items-center gap-1 shrink min-w-0 overflow-hidden`

---

## 3. Contrato de Mensagens de Compartilhamento (WhatsApp)

As funções que geram URLs para WhatsApp (`js/app.js` e `js/raffle.js`) DEVEM formatar o gênero utilizando exclusivamente os novos símbolos Unicode:

- **Confirmação de Aposta**:
  ```text
  "Olá! Acabei de registrar meu palpite no Bolão do Baby! 🍼✨\n\nNome: [NOME]\nPalpite: 🏋️ [NOME_MENINO] (ou 🪆 [NOME_MENINA])\nQuantidade: [COTAS] cota(s)..."
  ```
- **Parabéns ao Sorteado**:
  ```text
  "Parabéns [NOME]! 🎉 Você foi o grande vencedor do sorteio do Bolão do Baby com a aposta em 🏋️ Menino (ou 🪆 Menina)!..."
  ```
