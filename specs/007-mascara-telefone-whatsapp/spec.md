# Feature Specification: Máscara Automática de Telefone/WhatsApp em Tempo Real

**Feature Branch**: `007-mascara-telefone-whatsapp`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "uma coisa que queria que arrumasse que quando digitar o numero do celular aparecer ja a edição do numero quando digitar ele ja editar com (DDD) xxxxx-xxxx"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Formatação Automática ao Digitar no Formulário Público (Priority: P1)

Como convidado participando do Bolão do Chá Revelação pelo celular ou computador, quero que o campo "Seu WhatsApp" formate automaticamente os números conforme eu digito no padrão `(DD) XXXXX-XXXX`, para que eu visualize facilmente se digitei o DDD e os 9 dígitos do celular corretamente antes de enviar meu palpite.

**Why this priority**: O formulário público é o principal ponto de entrada de todos os convidados do evento. A formatação em tempo real evita erros de digitação de telefone (que inviabilizariam o contato dos pais no sorteio) e melhora a experiência em dispositivos móveis com teclado numérico apropriado.

**Independent Test**: Pode ser testado acessando o formulário público "Faça seu Palpite", clicando no campo "Seu WhatsApp" e digitando `11987654321`. Conforme cada número é digitado, o campo deve exibir progressivamente `(11) 98765-4321`.

**Acceptance Scenarios**:

1. **Given** que o convidado está no campo "Seu WhatsApp" vazio, **When** digita os números `11987654321` sequencialmente, **Then** o texto do campo é formatado automaticamente em tempo real para `(11) 98765-4321`.
2. **Given** que o convidado tenta digitar letras, símbolos ou mais de 11 dígitos numéricos, **When** digita no campo de WhatsApp, **Then** caracteres não numéricos são ignorados e o limite máximo de 11 dígitos `(DD) XXXXX-XXXX` é respeitado.
3. **Given** que o convidado apaga dígitos usando a tecla Backspace, **When** remove números ou parênteses/hífen, **Then** o campo permite apagar suavemente sem travar o cursor nos caracteres da máscara.

---

### User Story 2 - Formatação Automática no Painel Administrativo (Adicionar Manual e Editar Palpite) (Priority: P1)

Como organizador (pai/mãe) no Painel Administrativo, quero que os campos de WhatsApp na aba "Adicionar Manual" e no modal "Editar Palpite" também apliquem automaticamente a máscara `(DD) XXXXX-XXXX` ao digitar ou ao abrir um registro existente para edição.

**Why this priority**: Mantém consistência visual e facilidade de preenchimento quando os pais cadastram palpites manuais ou editam o contato de algum participante.

**Independent Test**: Pode ser testado no Painel dos Pais → aba "Adicionar Manual" e no modal "Editar Palpite", digitando `11999887766` no campo de WhatsApp e verificando que aparece `(11) 99988-7766`.

**Acceptance Scenarios**:

1. **Given** que o administrador está na aba "Adicionar Manual", **When** digita os números do celular no campo "WhatsApp (Opcional)", **Then** o valor é formatado em tempo real como `(DD) XXXXX-XXXX`.
2. **Given** que o administrador abre o modal "Editar Palpite" de um participante, **When** o modal é carregado ou o número é editado, **Then** o telefone aparece formatado no padrão `(DD) XXXXX-XXXX`.

---

### Edge Cases

- **Colagem (Paste) de número com código do país (+55)**: Caso o usuário cole um número copiado do WhatsApp contendo o DDI `+55` (ex: `+55 11 98765-4321` ou `5511987654321` com 12 ou 13 dígitos), o sistema deve remover o prefixo `55` automaticamente e formatar como `(11) 98765-4321`.
- **Números fixos de 10 dígitos**: Caso alguém informe um número de 10 dígitos, o sistema deve suportar a formatação `(DD) XXXX-XXXX` e ajustar automaticamente para `(DD) XXXXX-XXXX` ao digitar o 11º dígito.
- **Compatibilidade com links do WhatsApp**: O valor formatado `(DD) XXXXX-XXXX` salvo no banco deve continuar funcionando perfeitamente na geração de links diretos `wa.me` e `api.whatsapp.com` (que extraem apenas os dígitos).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE aplicar formatação em tempo real no padrão `(DD) XXXXX-XXXX` durante a digitação (`input`) e colagem (`paste`) em todos os campos de telefone/WhatsApp da aplicação (`#whatsapp`, `#manual-whatsapp` e `#edit-whatsapp`).
- **FR-002**: O formatador DEVE remover automaticamente caracteres não numéricos e limitar a entrada a no máximo 11 dígitos nacionais (tratando automaticamente colagens com prefixo DDI `55` de 12 ou 13 dígitos).
- **FR-003**: Os campos de telefone/WhatsApp DEVEM utilizar `inputmode="tel"` e `maxlength="15"` para acionar o teclado numérico de telefone em smartphones Android e iOS.
- **FR-004**: Ao abrir o modal "Editar Palpite", o campo `#edit-whatsapp` DEVE exibir o telefone já formatado com a máscara `(DD) XXXXX-XXXX` mesmo que o registro tenha sido salvo anteriormente apenas com números.

### Key Entities

- **Telefone / WhatsApp (`whatsapp`)**: String formatada no padrão `(DD) XXXXX-XXXX` associada ao registro do participante (`Guess`), utilizada para exibição mascarada de privacidade e geração de links diretos de contato no WhatsApp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das entradas numéricas de 11 dígitos digitadas ou coladas nos campos de WhatsApp do site público e do painel administrativo são exibidas instantaneamente no formato `(DD) XXXXX-XXXX` (ex: `(11) 98765-4321`).
- **SC-002**: O usuário consegue apagar qualquer dígito com Backspace do fim ao início do campo sem ficar preso em parênteses, espaços ou hífens.
- **SC-003**: 100% dos links de celebração e contato via WhatsApp continuam abrindo a conversa corretamente com os números formatados.

## Assumptions

- O padrão principal utilizado pelos convidados é o celular brasileiro com DDD de 2 dígitos seguido de 9 dígitos (`(DD) 9XXXX-XXXX`), mantendo suporte transparente caso um número de 10 dígitos seja digitado.

