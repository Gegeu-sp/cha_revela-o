# UI Contract: Campos de Telefone / WhatsApp

## Elementos Alvo (`index.html`)

1. **`#whatsapp`** (Formulário Público `#bolao-form`)
2. **`#manual-whatsapp`** (Aba Administrativa `#admin-manual-guess-form`)
3. **`#edit-whatsapp`** (Modal de Edição `#admin-edit-guess-form`)

## Atributos HTML Obrigatórios
- `type="tel"`
- `inputmode="tel"`
- `maxlength="15"`
- `autocomplete="tel"`
- `placeholder="(00) 00000-0000"`

## Eventos Monitorados (`attachPhoneMask`)
- `input`: Formata imediatamente a cada tecla pressionada.
- `paste`: Formata após a inserção do texto colado.
- `blur`: Garante formatação final ao sair do campo.
