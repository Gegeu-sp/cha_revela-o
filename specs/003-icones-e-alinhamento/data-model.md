# Data Model & Entidades Visuais: Ícones e Alinhamento Responsivo

**Feature**: `003-icones-e-alinhamento`
**Date**: 2026-10-23
**Status**: Ready

---

## 1. Entidade: GenderIdentity (Identidade Visual de Gênero)

Representa os metadados de apresentação e rotulagem para cada opção de gênero do bolão.

| Campo | Tipo | Descrição | Valor Menino | Valor Menina |
|---|---|---|---|---|
| `key` | String (imutável) | Identificador canônico no banco e na lógica de dados | `'boy'` | `'girl'` |
| `name` | String | Nome de exibição da opção | `'Menino'` | `'Menina'` |
| `icon` | String (Unicode) | Símbolo oficial da opção | `'🏋️'` (Barra de Peso) | `'🪆'` (Boneca) |
| `tag` | String | Rótulo formatado para badges e mensagens | `'🏋️ Menino'` | `'🪆 Menina'` |
| `teamLabel` | String | Identificação do time | `'Time do Menino'` | `'Time da Menina'` |
| `textColor` | String (HEX) | Cor primária para textos e títulos | `#03665A` | `#3B0069` |
| `accentColor` | String (HEX) | Cor de destaque intermediária | `#689D97` | `#8F56AD` |
| `bgColor` | String (HEX) | Fundo suave temático | `#CEE1DF` | `#BE9ECF` |

### Regras de Validação:
- O valor de `key` NUNCA deve sofrer alteração para não invalidar apostas salvas no Firestore / LocalStorage.
- O campo `icon` deve conter caracteres compatíveis com Unicode BMP/SMP para garantir renderização uniforme em navegadores móveis e mensageiros.

---

## 2. Entidade: LayoutAlignmentProfile (Perfil de Alinhamento Responsivo)

Define as propriedades visuais aplicadas aos componentes para assegurar ângulo reto (0deg) e harmonia tipográfica.

| Componente | Viewport Mobile (<768px) | Viewport Desktop (≥768px) | Alinhamento Vertical | Restrição de Quebra |
|---|---|---|---|---|
| **Header Baby Names** (`#hero-baby-names`) | `flex items-center gap-1 text-xs` | `flex items-center gap-1.5 text-xs sm:text-sm` | `items-center` | `whitespace-nowrap overflow-hidden text-ellipsis` |
| **Scoreboard Cards** (`#score-card-boy/girl`) | `grid-cols-1 w-full p-5 sm:p-6` | `grid-cols-2 gap-6 p-6` | `items-center justify-between` | Altura simétrica via `flex flex-col justify-between` |
| **Vote Option Labels** (`label-boy/girl-vote`) | `flex flex-col items-center justify-center p-4` | `flex flex-col items-center justify-center p-5` | `items-center justify-center` | `min-h-[140px] text-center` |
| **Dropdown Options** (`<option>`) | Nativo do SO com emoji Unicode | Nativo do SO com emoji Unicode | Padrão do sistema operacional | Linha única com `🏋️ Menino` / `🪆 Menina` |
| **Admin Badges** | `inline-flex items-center px-2 py-0.5 rounded-full text-[11px]` | `inline-flex items-center px-2 py-0.5 rounded-full text-[11px]` | `items-center` | Linha única |

---

## 3. Matriz de Estados e Transições

Os elementos interativos (como as opções de voto) reagem ao estado de seleção mantendo estritamente o alinhamento centralizado:
- **Estado Normal**: Borda neutra `border-slate-200`, fundo sutil, ícone em escala padrão (`text-4xl`).
- **Estado Checked (Selecionado)**: Borda colorida temática (`border-[#03665A]` ou `border-[#3B0069]`), fundo translúcido suave (`bg-[#CEE1DF]/30` ou `bg-[#BE9ECF]/25`), alinhamento inalterado sem deslocamento de layout (sem layout shift).
- **Estado Hover**: Transição sutil de borda sem alterar geometria ou dimensões de caixa.
