# Data Model: Sistema de Sorteio do Bolão, Título Oficial e Créditos de Autoria

**Feature Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16

---

## 1. Entidades de Dados

### 1.1 Entidade `DrawResult` (Registro do Vencedor do Sorteio)
Representa um sorteio concluído e registrado com sucesso no banco de dados (Firestore e LocalStorage).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | Sim | Identificador único do sorteio (UUID ou ID de documento Firestore). |
| `guessId` | `string` | Sim | Identificador do palpite premiado. |
| `winnerName` | `string` | Sim | Nome completo do participante sorteado. |
| `whatsapp` | `string` | Não | Telefone/WhatsApp do vencedor para contato e pagamento. |
| `gender` | `'boy' \| 'girl'` | Sim | Palpite realizado pelo ganhador. |
| `quotasCount` | `number` | Sim | Total de cotas que o participante possuía no momento do sorteio. |
| `totalAmount` | `number` | Sim | Valor total contribuído pelo ganhador. |
| `mode` | `'all' \| 'correct'` | Sim | Modalidade do sorteio: `'all'` (Geral) ou `'correct'` (Apenas Acertadores). |
| `targetGender` | `'boy' \| 'girl' \| null` | Não | Sexo filtrado caso a modalidade tenha sido `'correct'`. |
| `prizeTitle` | `string` | Sim | Descrição do prêmio (ex: "Prêmio Principal do Bolão"). |
| `drawnAt` | `string` (ISO 8601) | Sim | Data e hora exatas da realização do sorteio. |

---

### 1.2 Entidade `VirtualTicket` (Bilhete da Urna Ponderada)
Estrutura temporária em memória gerada dinamicamente no momento da realização do sorteio, garantindo que cada cota adquirida se converta em uma chance proporcional na amostragem.

| Campo | Tipo | Descrição |
|---|---|---|
| `ticketIndex` | `number` | Índice sequencial na urna (0 até N-1). |
| `guessId` | `string` | Referência ao palpite de origem. |
| `guestName` | `string` | Nome do participante titular da cota. |
| `gender` | `'boy' \| 'girl'` | Gênero escolhido no palpite. |
| `whatsapp` | `string` | Telefone de contato. |
| `quotaNumber` | `number` | Qual cota específica é este bilhete (ex: Cota 2 de 5). |

---

### 1.3 Entidade `DrawOptions` (Parâmetros de Execução do Sorteio)
Parâmetros selecionados pelo organizador na interface de configuração do sorteio.

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `mode` | `'all' \| 'correct'` | `'all'` | Modalidade: todos os confirmados ou apenas quem acertou o sexo do bebê. |
| `targetGender` | `'boy' \| 'girl' \| null` | `null` | Sexo revelado a ser filtrado quando `mode === 'correct'`. |
| `excludePreviousWinners`| `boolean` | `true` | Se deve remover da urna quem já foi premiado em sorteios anteriores. |
| `prizeTitle` | `string` | `"Prêmio do Bolão"` | Título descritivo do prêmio em disputa. |
| `animationDurationMs` | `number` | `4000` | Duração da animação de suspense em milissegundos (3000ms a 5000ms). |

---

## 2. Diagrama de Transição de Estados do Sorteio

```text
[Palpites Confirmados] 
         │
         ▼
[Configurar Parâmetros de Sorteio] (Modo, Sexo, Exclusão de Premiados)
         │
         ▼
[Construir Urna Ponderada] (VirtualTicket[])
         │
         ├─── Se Urna Vazia ──► [Exibir Alerta Amigável: Sem cotas elegíveis]
         │
         ▼
[Iniciar Animação de Suspense] (Roleta de nomes com desaceleração progressiva)
         │
         ▼
[Travar no Bilhete Sorteado] (Índice aleatório selecionado)
         │
         ▼
[Explosão de Confetes & Cartão do Ganhador]
         │
         ▼
[Persistir em Firestore / LocalStorage] (DrawResult)
         │
         ▼
[Disponibilizar Atalho WhatsApp & Atualizar Histórico]
```

---

## 3. Validações e Regras de Integridade

1. **Elegibilidade**: Apenas palpites com `status === 'confirmed'` podem gerar bilhetes virtuais para a urna.
2. **Prevenção de Fraude / Duplicidade**: Se `excludePreviousWinners === true`, participantes que já constam na lista de `DrawResult` são filtrados antes da montagem da urna.
3. **Imutabilidade do Histórico**: Cada `DrawResult` persistido possui carimbo de tempo inviolável e não pode ser editado manualmente, podendo apenas ser excluído em bloco pelo administrador mediante confirmação de segurança (zerar sorteios de teste).
