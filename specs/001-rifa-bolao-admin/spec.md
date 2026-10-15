# Feature Specification: Gestão Completa de Rifa e Bolão com Painel Administrativo

**Feature Branch**: `001-rifa-bolao-admin`

**Created**: 2026-10-14 | **Last Updated**: 2026-10-15

**Status**: Ready for Planning (Updated with Custom Palette, Cross-Device Sync & Framing Refinements)

**Input**: User description: "trocar a cor da lading page para as cores em anexo (#3B0069, #8F56AD, #BE9ECF, #CEE1DF, #689D97, #03665A). alem disso, quando atualizo a pagina e nas configurações nao esta atualizando a pagina quando abro em outro dispositivo. alem disso, melhor o enquadramento do site tanto web e o mobile. arrumar tudo subir para github e firebase"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validação e Gestão de Pagamentos pelo Administrador (Priority: P1)

Como pai ou mãe (administradores do evento), quero autenticar com e-mail e senha, visualizar uma lista/filtro prioritário de palpites com status "Aguardando Pix" e poder marcar pagamentos como confirmados em 1 clique, editar dados digitados incorretamente ou adicionar novos palpites manualmente.

**Why this priority**: É a funcionalidade central de controle financeiro para os pais conferirem os pagamentos recebidos na conta antes de validar a participação.

**Independent Test**: Realizar login no painel administrativo, visualizar a fila de pendências de Pix, clicar em "Confirmar Pagamento" e verificar se o status muda para "Confirmado" e o total arrecadado é recalculado em tempo real.

**Acceptance Scenarios**:

1. **Given** um participante enviou um palpite com status "Aguardando Pix", **When** o administrador acessa o painel, **Then** encontra uma lista prioritária de pendências e botão de 1 clique para aprovação.
2. **Given** um participante errou a grafia do nome ou o telefone, **When** o administrador seleciona a opção de edição no registro, **Then** um formulário permite alterar nome, telefone, valor e palpite, salvando os novos dados imediatamente.
3. **Given** um convidado pagou em dinheiro presencialmente, **When** o administrador usa a opção "Adicionar Palpite Manual", **Then** o palpite é inserido diretamente com status "Confirmado".

---

### User Story 2 - Configuração Personalizável do Evento e Nomes dos Bebês (Priority: P2)

Como administrador do bolão, quero configurar o nome escolhido para o Menino (ex: Lucca) e o nome para a Menina (ex: Maya), além do valor unitário da cota, chave Pix, titular da conta e data prevista de nascimento com contagem regressiva, para que toda a página exiba os nomes oficiais dos filhos.

**Why this priority**: Personaliza a celebração da família, permitindo que os convidados votem especificamente no nome do menino ou da menina escolhido pelos pais.

**Independent Test**: Alterar o nome do menino para "Lucca" e da menina para "Maya" nas configurações e verificar se a página pública exibe "É o Lucca! 💙" e "É a Maya! 💖".

**Acceptance Scenarios**:

1. **Given** os pais cadastraram `boyBabyName` e `girlBabyName`, **When** qualquer visitante acessa o site, **Then** os botões de palpite, placar da disputa e textos comemorativos exibem os nomes definidos.
2. **Given** a data prevista de nascimento foi cadastrada, **When** o visitante acessa o cabeçalho/hero da página, **Then** visualiza a data esperada e a contagem regressiva em dias, horas e minutos.
3. **Given** os pais definem uma nova chave Pix, **When** um participante visualiza a tela de pagamento, **Then** a chave atualizada e o titular configurados são apresentados com botões de cópia e QR Code dinâmico.

---

### User Story 3 - Pagamento Pix Facilitado (QR Code Dinâmico & Copia e Cola) e Múltiplas Cotas (Priority: P3)

Como convidado, quero escolher a quantidade de cotas desejada e realizar o pagamento Pix de forma extremamente fácil, podendo ler o QR Code diretamente na tela pelo celular ou copiar o código Pix Copia e Cola com 1 clique, além de enviar o comprovante pronto no WhatsApp.

**Why this priority**: Remove qualquer barreira de pagamento, acelerando a arrecadação e evitando que o convidado desista por dificuldade em copiar a chave.

**Independent Test**: Selecionar 2 cotas, clicar em "Copiar Código Pix" ou escanear o QR Code gerado na tela e verificar a abertura do WhatsApp com mensagem pré-formatada.

**Acceptance Scenarios**:

1. **Given** o formulário de palpite, **When** o participante escolhe cotas e palpite, **Then** visualiza o QR Code Pix dinâmico e o botão para copiar o código Pix.
2. **Given** a submissão do formulário, **When** o registro é salvo, **Then** o modal de sucesso oferece o link direto do WhatsApp com nome, palpite e valor total.

---

### User Story 4 - Placar Animado, Responsividade Perfeita e Reinicialização do Bolão (Priority: P4)

Como administrador ou participante, quero usufruir de um layout perfeitamente alinhado e responsivo (tanto no mobile quanto no desktop), com placar animado a 60 FPS, e poder reiniciar o bolão do zero a qualquer momento através de uma ferramenta de reset com confirmação de segurança.

**Why this priority**: Garante excelência estética, adaptação a qualquer tamanho de smartphone e permite aos pais limpar dados de teste antes de enviar o link para a família.

**Independent Test**: Clicar no botão "Reiniciar Bolão (Zerar Dados)" no painel, confirmar a ação de segurança e verificar que a tabela de palpites e contadores são zerados para um novo começo.

**Acceptance Scenarios**:

1. **Given** a existência de palpites de teste, **When** o administrador clica em "Reiniciar Bolão" e confirma a operação, **Then** todos os palpites são removidos e contadores retornam a zero.
2. **Given** qualquer dispositivo móvel (360px a 428px) ou desktop (1080p+), **When** a página é navegada, **Then** todos os componentes apresentam alinhamento centralizado, tipografia proporcional e ausência de scroll horizontal indesejado.

---

### Edge Cases

- O que acontece se o administrador acidentalmente clicar em "Reiniciar Bolão"? O sistema exige confirmação explícita digitando a palavra "ZERAR" para evitar perda acidental de dados.
- O que acontece se os pais ainda não definiram os nomes do menino e da menina? O sistema adota os termos acolhedores padrão "Menino 💙" e "Menina 💖" como fallback.
- O que acontece se a chave Pix for alterada durante o evento? O QR Code dinâmico e o botão de cópia são recalculados instantaneamente sem necessidade de recarregar a página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir aos pais configurar o Nome do Menino (`boyBabyName`) e o Nome da Menina (`girlBabyName`) no painel administrativo.
- **FR-002**: O sistema DEVE exibir dinamicamente os nomes dos bebês no Hero, nos botões de votação ("💙 É [Nome]!" / "💖 É [Nome]!") e nos cartões do placar.
- **FR-003**: O sistema DEVE exibir na área do administrador um painel/filtro prioritário para "Aguardando Confirmação Pix" com contadores visuais e botão de aprovação rápida com 1 clique.
- **FR-004**: O sistema DEVE disponibilizar uma funcionalidade de "Reiniciar Bolão do Zero", limpando todos os palpites armazenados mediante confirmação de segurança com palavra-chave.
- **FR-005**: O sistema DEVE gerar e exibir um QR Code Pix dinâmico para facilitar o pagamento tanto em computadores quanto em smartphones.
- **FR-006**: O sistema DEVE disponibilizar botão de 1 clique para "Copiar Chave Pix" e "Copiar Código Pix Copia e Cola".
- **FR-007**: O sistema DEVE incluir arquivos de configuração para deploy no Firebase Hosting (`firebase.json` e `.firebaserc`).
- **FR-008**: O layout DEVE ter enquadramento perfeito, margens e padding simétricos e responsividade total testada tanto em telas mobile (320px-480px) quanto em telas desktop, eliminando rolagem horizontal indesejada e proporcionando espaçamento arejado.
- **FR-009**: O administrador DEVE poder autenticar via e-mail e senha, com persistência de sessão.
- **FR-010**: O sistema DEVE atualizar placares, contadores e tabelas em tempo real via Firestore com fallback local resiliente.
- **FR-011**: O sistema DEVE aplicar a paleta de cores personalizada fornecida nas imagens do evento: escala Lilás/Roxo (`#3B0069`, `#8F56AD`, `#BE9ECF`) e escala Esmeralda/Menta (`#03665A`, `#689D97`, `#CEE1DF`), substituindo o padrão azul/rosa anterior por um design sofisticado e equilibrado.
- **FR-012**: As configurações do evento e novos palpites DEVEM sincronizar entre diferentes dispositivos em tempo real, garantindo que alterações feitas no computador ou celular dos pais reflitam instantaneamente no celular dos convidados.
- **FR-013**: O projeto DEVE estar pronto para deploy automatizado no Firebase Hosting e versionado no repositório GitHub.

### Key Entities

- **EventConfig**: Adição dos campos `boyBabyName` (string) e `girlBabyName` (string), além de `pixQrCodeUrl` ou payload dinâmico.
- **Guess**: Estrutura de palpite vinculada ao gênero e nome correspondente do bebê.
- **AdminSession**: Gerenciamento de credenciais e permissões para reset e auditoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O administrador consegue aprovar um pagamento Pix com 1 clique em menos de 3 segundos na lista de pendências.
- **SC-002**: O reset do bolão é executado com segurança em menos de 2 segundos, zerando contadores e tabela.
- **SC-003**: O QR Code do Pix é renderizado instantaneamente na tela sem atraso de carregamento.
- **SC-004**: 100% dos elementos da interface estão alinhados sem overflow horizontal em telas móveis a partir de 320px.
- **SC-005**: Deploy no Firebase Hosting executável através de um comando padronizado (`firebase deploy`).
