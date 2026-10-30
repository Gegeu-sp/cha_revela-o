# Feature Specification: Correção do Registro de Palpite Manual e Suporte a Valor Personalizado

**Feature Branch**: `006-palpite-manual-valor`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Adicionar Palpite Manual nao esta funcionando e indo para o registro e nao esta registrando. arrumar pois pode ter pessoas que fazem outro valor. analisar, verificar e arrumar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro Efetivo de Palpite Manual e Redirecionamento para a Lista (Priority: P1)

Como organizador (pai/mãe) no Painel Administrativo, quero cadastrar um palpite manual (de convidados que pagaram em dinheiro vivo ou transferência direta) e vê-lo imediatamente salvo e listado na aba de registros ("Palpites & Pix") e no placar público, sem que o registro seja perdido ou bloqueado.

**Why this priority**: Atualmente, ao submeter o formulário "Adicionar Palpite Manual", o envio com status inicial confirmado é recusado pelas regras de criação ou sobrescrito pela sincronização em tempo real, fazendo com que o palpite não seja registrado nem exibido na lista de registros. Esta é a funcionalidade central solicitada.

**Independent Test**: Pode ser testado acessando o Painel dos Pais → aba "Adicionar Manual", preenchendo nome, palpite (Menino/Menina), quantidade de cotas e valor, e clicando em "Registrar Palpite Confirmado". O sistema deve redirecionar para a aba "Palpites & Pix" com o filtro em "Todos", exibindo imediatamente o novo participante com a tag "Manual" e somando suas cotas e valor no placar público.

**Acceptance Scenarios**:

1. **Given** que o administrador está autenticado na aba "Adicionar Manual", **When** preenche os dados de um convidado e clica em "Registrar Palpite Confirmado", **Then** o palpite é persistido com sucesso na nuvem e localmente, a aba muda automaticamente para "Palpites & Pix" e o registro recém-criado aparece imediatamente no topo da tabela.
2. **Given** que o administrador estava com o filtro "Aguardando Pix" selecionado antes de adicionar um palpite manual confirmado, **When** conclui o cadastro manual e é redirecionado para a lista de registros, **Then** o filtro da listagem é redefinido para exibir o novo registro confirmado imediatamente.
3. **Given** que um palpite manual foi registrado como confirmado, **When** a página é recarregada ou visualizada em outro dispositivo, **Then** o palpite permanece salvo permanentemente e contabilizado no total arrecadado, no placar Menino vs Menina e na urna do sorteio.

---

### User Story 2 - Cadastro Manual com Outro Valor (Valor Personalizado) (Priority: P1)

Como organizador no Painel Administrativo, quero informar um valor monetário personalizado ao adicionar um palpite manual (por exemplo, quando um familiar ou amigo contribui com um valor diferente do múltiplo padrão da cota, como R$ 20,00, R$ 25,00, R$ 50,00 ou qualquer outro valor), garantindo que o valor exato pago seja registrado e somado na arrecadação oficial.

**Why this priority**: Convidados frequentemente fazem contribuições espontâneas ou arredondadas de valores variados. O sistema antes calculava rigidamente `cotas × preço padrão` e ignorava valores personalizados na camada de persistência.

**Independent Test**: Pode ser testado na aba "Adicionar Manual" alterando o campo "Valor Total Pago (R$)" para um valor livre (ex: R$ 25,00 com 1 ou 2 cotas) e salvando. O registro deve exibir exatamente "R$ 25,00" na tabela administrativa, no ranking e na soma do valor total arrecadado.

**Acceptance Scenarios**:

1. **Given** que o administrador seleciona a quantidade de cotas no formulário manual, **When** altera a quantidade de cotas sem ter editado manualmente o valor, **Then** o campo "Valor Total Pago (R$)" sugere automaticamente o valor padrão (`cotas × valor da cota`).
2. **Given** que uma pessoa pagou um valor diferente do padrão (ex: R$ 20,00, R$ 35,00 ou R$ 50,00), **When** o administrador digita esse valor no campo "Valor Total Pago (R$)" e envia o formulário, **Then** o sistema respeita e salva exatamente o valor digitado pelo administrador, sem sobrescrevê-lo pelo cálculo automático.

---

### User Story 3 - Edição de Valor Total Personalizado em Palpites Existentes (Priority: P2)

Como organizador no Painel Administrativo, quero editar diretamente o "Valor Total Pago (R$)" de qualquer palpite já cadastrado no modal "Editar Palpite", para corrigir ou ajustar contribuições de convidados que enviaram um Pix de valor diferente do esperado.

**Why this priority**: Além do cadastro manual inicial, convidados que preenchem o formulário público podem transferir no Pix um valor diferente (maior ou menor). O administrador precisa ajustar facilmente o valor total pago na edição do registro sem restrições de incremento fixo.

**Independent Test**: Pode ser testado clicando no botão de editar (ícone de lápis) de qualquer palpite na aba "Palpites & Pix", informando qualquer valor em reais/centavos no campo "Valor Total Pago (R$)" e salvando.

**Acceptance Scenarios**:

1. **Given** que o administrador abre o modal "Editar Palpite" de um registro existente, **When** altera o campo "Valor Total Pago (R$)" para qualquer valor positivo (incluindo centavos livres) e clica em "Salvar Alterações", **Then** o registro e o total arrecadado do evento são atualizados imediatamente com o novo valor.

---

### Edge Cases

- **Nome muito curto no cadastro manual**: Caso o administrador digite apenas 1 letra no nome, o formulário deve validar no mínimo 2 caracteres para evitar rejeição pelas regras de integridade do banco de dados.
- **Deduplicação em múltiplos cadastros rápidos**: Caso o administrador cadastre dois palpites manuais seguidos para a mesma pessoa ou com dados semelhantes, cada envio intencional deve gerar um registro próprio sem ser descartado indevidamente.
- **Queda ou restrição temporária de conexão**: Caso haja falha de comunicação ou atraso na nuvem, o registro local não deve ser apagado pela sincronização subsequente.
- **Valores com casas decimais ou vírgula**: O campo de valor deve aceitar valores inteiros (ex: 20, 50) e decimais (ex: 25.50) maiores que zero.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE persistir corretamente novos palpites criados pelo formulário "Adicionar Palpite Manual" tanto no banco em nuvem quanto no armazenamento local, garantindo que palpites criados já com status confirmado não sejam rejeitados pelas regras de segurança nem apagados pelo listener de sincronização.
- **FR-002**: O formulário "Adicionar Palpite Manual" DEVE disponibilizar um campo editável de "Valor Total Pago (R$)" que é preenchido automaticamente com base na quantidade de cotas (`cotas × valor da cota`), mas que permite ao administrador digitar qualquer outro valor personalizado positivo.
- **FR-003**: A camada de persistência de dados DEVE preservar o `totalAmount` personalizado informado no cadastro ou edição do palpite, utilizando o cálculo `cotas × valor unitário` apenas quando nenhum valor total válido for especificado.
- **FR-004**: Ao concluir o envio do formulário "Adicionar Palpite Manual", o sistema DEVE redirecionar o administrador para a aba "Palpites & Pix", redefinir o filtro de visualização caso estivesse ocultando confirmados, e atualizar imediatamente a tabela de registros, o placar público e a urna de sorteio.
- **FR-005**: O modal "Editar Palpite" DEVE permitir a edição direta do "Valor Total Pago (R$)" com suporte a qualquer valor monetário positivo (passo de R$ 0,01), recalculando apenas quando o administrador alterar a quantidade de cotas sem definir outro valor manual.
- **FR-006**: O botão de submissão do formulário manual DEVE exibir estado de carregamento durante o salvamento para impedir cliques duplicados acidentais e fornecer confirmação visual clara de sucesso.

### Key Entities

- **Palpite (Guess)**: Registro de participação no bolão contendo nome do convidado (`guestName`), telefone (`whatsapp`), palpite (`gender`: menino/menina), quantidade de cotas (`quotasCount`), preço unitário de referência (`unitPrice`), valor total efetivamente pago (`totalAmount`), status de confirmação (`status`), indicador de criação manual (`isManual`) e observações (`notes`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos palpites cadastrados na aba "Adicionar Manual" são gravados com sucesso e exibidos imediatamente na aba "Palpites & Pix" e no placar público em menos de 1 segundo após o envio.
- **SC-002**: 100% dos palpites manuais permanecem visíveis e íntegros após recarregar a página ou sincronizar entre múltiplos dispositivos.
- **SC-003**: O administrador consegue registrar e editar palpites com qualquer valor monetário personalizado (ex: R$ 10,00, R$ 20,00, R$ 25,50, R$ 50,00) em menos de 15 segundos, com cálculo exato refletido no Total Arrecadado e no Prêmio Estimado.

## Assumptions

- A quantidade de cotas (`quotasCount`) continua determinando o número de bilhetes na urna de sorteio e o peso no placar de cotas (Menino vs Menina), enquanto o "Valor Total Pago (R$)" (`totalAmount`) determina o valor financeiro contabilizado na arrecadação total, divisão de prêmio e ranking financeiro.
- Todo palpite registrado na aba "Adicionar Manual" entra por padrão com status "Confirmado", pois destina-se a pagamentos já recebidos pelos pais (em dinheiro vivo ou transferência direta), podendo também ser alterado no modal de edição a qualquer momento.

