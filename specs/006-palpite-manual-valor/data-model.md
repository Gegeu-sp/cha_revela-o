# Data Model: Palpite (Guess) com Suporte a Valor Personalizado

## Entidade: `Guess` (Coleção `/guesses/{guessId}`)

| Campo | Tipo | Obrigatório | Validação / Regras | Descrição |
|-------|------|-------------|--------------------|-----------|
| `id` | `string` | Sim | ID gerado pelo Firestore ou prefixo `local_` | Identificador único do registro |
| `guestName` | `string` | Sim | `2 <= length <= 100` | Nome do participante |
| `whatsapp` | `string` | Não | Texto livre / máscara de telefone | Telefone para contato no WhatsApp |
| `gender` | `'boy' \| 'girl'` | Sim | Estritamente `'boy'` ou `'girl'` | Palpite escolhido |
| `babyNameChosen` | `string` | Sim | Nome configurado para Menino ou Menina | Nome do bebê associado ao voto |
| `quotasCount` | `number` | Sim | Inteiro `1 <= quotasCount <= 100` | Quantidade de cotas (bilhetes no sorteio) |
| `unitPrice` | `number` | Sim | `> 0` (calculado como `totalAmount / quotasCount`) | Valor unitário médio por cota |
| `totalAmount` | `number` | Sim | `>= 0.01` (2 casas decimais) | Valor total efetivamente pago (padrão ou personalizado) |
| `status` | `'pending' \| 'confirmed' \| 'cancelled'` | Sim | Cadastro público: `'pending'`; Manual: `'confirmed'` | Status do pagamento |
| `isManual` | `boolean` | Sim | `true` para cadastro na aba Adicionar Manual | Indica origem manual pelo administrador |
| `notes` | `string` | Não | `<= 500` caracteres | Observações do pagamento ou nota de valor personalizado |
| `createdAt` | `string (ISO 8601)` | Sim | Timestamp ISO válido | Data/hora de criação |
| `confirmedAt` | `string (ISO 8601) \| null` | Não | Preenchido quando `status === 'confirmed'` | Data/hora da confirmação do pagamento |

## Transições de Estado

- **Cadastro Público (`isManual: false`)**: Inicia em `pending` → promovido para `confirmed` (via botão "Confirmar Pix" ou modal de edição) ou `cancelled`.
- **Cadastro Manual Administrativo (`isManual: true`)**: Criado e imediatamente confirmado (`confirmed`) com `confirmedAt` preenchido, podendo ser editado a qualquer momento no modal "Editar Palpite".
