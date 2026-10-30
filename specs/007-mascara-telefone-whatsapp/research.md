# Phase 0 Research: Máscara Automática `(DD) XXXXX-XXXX`

## 1. Algoritmo de Formatação Progressiva sem Travar o Backspace

- **Decision**: Implementar `formatPhoneInput(value)` baseado na quantidade de dígitos extraídos (`value.replace(/\D/g, '')`), fechando o parêntese do DDD apenas a partir do 3º dígito (`(11) 9...`) e inserindo o hífen a partir do 8º dígito para celulares (`(11) 98765-4...`).
- **Rationale**: Se o parêntese `)` ou o espaço fossem adicionados imediatamente ao digitar o 2º dígito (`11` -> `(11) `), pressionar Backspace removeria apenas o espaço e re-adicionaria `(11) `, impedindo o usuário de apagar o DDD. Ao aplicar `) ` somente quando o 3º dígito existe, o Backspace funciona de ponta a ponta com fluidez total.
- **Alternatives considered**:
  - Bibliotecas externas (IMask / Inputmask): descartadas pelo princípio Zero-Build da Constituição.

## 2. Tratamento de Colagem com Código do País (`+55`)

- **Decision**: Quando a string numérica possuir 12 ou 13 dígitos e iniciar com `55`, remover automaticamente os 2 primeiros dígitos (`digits.slice(2)`) antes de truncar em 11 dígitos.
- **Rationale**: Usuários frequentemente copiam números diretamente do perfil do WhatsApp no formato `+55 11 98765-4321`. Sem remover o `55`, os dois últimos dígitos do celular seriam cortados pelo limite de 11 dígitos.
- **Alternatives considered**:
  - Bloquear colagem: descartado por prejudicar a usabilidade mobile.
