# Feature Specification: Sistema de Sorteio do Bolão, Título Oficial e Créditos de Autoria

**Feature Branch**: `002-sistema-sorteio`

**Created**: 2026-10-16

**Status**: Ready for Planning

**Input**: User description: "arrumar o titulo do que sera Qual é o seu palpite para o nosso bebê? alem disso, fazer o sistema do sorteio ja colocar como criador e autor Argeu Rodrigues"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Realização do Sorteio Festivo com Animação e Revelação do Ganhador (Priority: P1)

Como pai/mãe ou mestre de cerimônias do chá revelação, quero abrir uma interface dedicada de sorteio no painel do evento, selecionar a modalidade do sorteio (entre todos os participantes confirmados ou apenas entre os acertadores do sexo revelado), iniciar a roleta animada de suspense com efeitos comemorativos e ver na tela o nome do ganhador sorteado com seus dados de contato e cotas.

**Why this priority**: É a atração principal do bolão no momento da revelação. O sorteio oficial premia os participantes, gera comoção e transparência perante a família e amigos presentes física ou virtualmente.

**Independent Test**: Com pelo menos 2 palpites confirmados no sistema, acessar o módulo de sorteio, selecionar o modo "Todos os Confirmados", acionar o botão "Sortear Agora", aguardar a contagem regressiva e suspense visual, e verificar a exibição clara do vencedor com opção de envio de mensagem de parabéns via WhatsApp.

**Acceptance Scenarios**:

1. **Given** existem participantes com cotas confirmadas, **When** o organizador inicia o sorteio, **Then** o sistema exibe uma animação envolvente de roleta/embaralhamento de nomes por alguns segundos antes de travar no vencedor.
2. **Given** um participante adquiriu 3 cotas e outro adquiriu 1 cota, **When** o sorteio ponderado é executado, **Then** as chances do participante com 3 cotas são proporcionalmente 3 vezes maiores.
3. **Given** o ganhador é anunciado na tela, **When** a revelação ocorre, **Then** uma comemoração com chuva de confetes é disparada, acompanhada dos detalhes da aposta (nome, palpite, quantidade de cotas e botão direto para WhatsApp).
4. **Given** o organizador já sabe o sexo do bebê (revelado como Menino ou Menina), **When** seleciona a modalidade "Apenas Acertadores", **Then** somente os palpites confirmados que escolheram o gênero correspondente entram na urna do sorteio.

---

### User Story 2 - Histórico e Auditoria dos Sorteios Realizados (Priority: P2)

Como organizador ou participante, quero que cada resultado de sorteio fique registrado em uma lista de vencedores com data, hora, modalidade e dados da aposta, permitindo consultar os ganhadores anteriores e evitar contestações ou sorteios repetidos sem consentimento.

**Why this priority**: Garante conformidade com o Princípio de Transparência e Fair Play da constituição do projeto, assegurando que o resultado seja incontestável e auditável.

**Independent Test**: Executar um sorteio com sucesso, recarregar ou navegar pelo sistema e verificar que o cartão ou histórico de ganhadores exibe o vencedor registrado com carimbo de data e hora.

**Acceptance Scenarios**:

1. **Given** um sorteio acabou de ser concluído, **When** o organizador confirma o resultado, **Then** o vencedor é salvo no histórico oficial de sorteios do evento.
2. **Given** que já houve um sorteio anterior, **When** o organizador precisa realizar um novo sorteio (ex: 2º prêmio ou sorteio extra), **Then** o sistema permite novo sorteio sem apagar o histórico do anterior, oferecendo opção de excluir quem já foi premiado.

---

### User Story 3 - Atualização do Título Principal da Página Hero (Priority: P3)

Como visitante ou participante do bolão, ao acessar a página inicial do evento, quero ler no destaque principal a frase acolhedora e personalizada: "Qual é o seu palpite para o nosso bebê?", substituindo o texto genérico anterior, para me sentir diretamente convidado a participar da celebração familiar.

**Why this priority**: É o ponto focal da identidade do site, comunicando imediatamente o propósito afetivo da celebração aos convidados.

**Independent Test**: Acessar a página inicial em dispositivos móveis e desktop e certificar-se de que o título principal no Hero exibe a mensagem "Qual é o seu palpite para o nosso bebê?".

**Acceptance Scenarios**:

1. **Given** qualquer visitante acessa a página inicial, **When** a seção Hero é renderizada, **Then** o título principal em destaque apresenta a frase "Qual é o seu palpite para o nosso bebê?".
2. **Given** o título é exibido em telas menores (smartphones de 320px a 428px), **When** a página é redimensionada, **Then** o texto se adapta harmonicamente sem quebras deselegantes ou overflow horizontal.

---

### User Story 4 - Identificação Explícita do Criador e Autor Argeu Rodrigues (Priority: P4)

Como criador da plataforma e como visitante, quero visualizar no rodapé e nas referências do site o crédito de autoria formal e elegante: "Criador e Autor: Argeu Rodrigues", reconhecendo a criação e desenvolvimento do projeto.

**Why this priority**: Confere reconhecimento profissional e autoria clara ao responsável pela criação do sistema perante todos os participantes e futuros utilizadores.

**Independent Test**: Rolar até o rodapé da página inicial e verificar a menção destacada "Criador e Autor: Argeu Rodrigues", com visual condizente com a paleta elegante do evento.

**Acceptance Scenarios**:

1. **Given** um usuário navega até o rodapé do site, **When** visualiza as informações de copyright e autoria, **Then** encontra o texto "Criador e Autor: Argeu Rodrigues" visível e destacado com elegância.
2. **Given** a inspeção dos metadados da página (meta tags de autor no cabeçalho), **When** motores de busca ou leitores sociais inspecionam o documento, **Then** a autoria "Argeu Rodrigues" está presente.

---

### Edge Cases

- **O que acontece se o organizador tentar realizar um sorteio sem nenhum palpite confirmado?** O sistema bloqueia a ação, alertando amigavelmente que é necessário ter ao menos um palpite com pagamento confirmado para rodar a urna.
- **O que acontece se o organizador selecionar "Apenas Acertadores", mas nenhum participante tiver acertado o gênero revelado?** O sistema exibe um aviso claro informando que não há cotas elegíveis para o sexo escolhido, sugerindo sortear entre todos os confirmados ou verificar os palpites cadastrados.
- **O que acontece se a página for fechada ou a conexão cair durante a animação do sorteio?** O sorteio só é consolidado quando o resultado final é obtido e confirmado, permitindo reiniciar a animação com segurança.
- **O que acontece se um mesmo participante tiver múltiplas cotas?** Cada cota é considerada uma entrada individual no sorteio (urna ponderada), aumentando as chances matemáticas do participante de acordo com o total de cotas adquiridas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE atualizar o título principal (seção Hero) da página pública para "Qual é o seu palpite para o nosso bebê?", mantendo o estilo tipográfico refinado e a paleta de cores oficial.
- **FR-002**: O sistema DEVE incluir no rodapé de todas as páginas a atribuição de autoria "Criador e Autor: Argeu Rodrigues", mantendo alinhamento harmonioso tanto em mobile quanto em desktop.
- **FR-003**: O sistema DEVE incluir metadados no cabeçalho indicando o autor `Argeu Rodrigues`.
- **FR-004**: O sistema DEVE disponibilizar uma funcionalidade de Sorteio Oficial acessível pelo painel dos pais / organizador e também em modal/visualização de apresentação festiva em tela cheia.
- **FR-005**: O sistema DEVE permitir a escolha da modalidade do sorteio:
  - (a) *Geral*: Sorteio entre todas as cotas com status confirmado;
  - (b) *Acertadores*: Sorteio restrito aos participantes que acertaram o gênero revelado (Menino ou Menina);
  - (c) *Exclusão de já sorteados*: Opção de desconsiderar participantes previamente premiados em sorteios subsequentes.
- **FR-006**: A urna do sorteio DEVE operar de forma ponderada por cotas: se um participante comprou 5 cotas confirmadas, ele possui 5 bilhetes/chances na urna.
- **FR-007**: O sistema DEVE apresentar uma animação visual de sorteio (roleta de nomes, contagem regressiva e efeitos de suspense) antes de revelar o ganhador, durando entre 3 a 5 segundos para gerar emoção no evento.
- **FR-008**: Ao revelar o vencedor, o sistema DEVE acionar celebração visual (chuva de confetes) e apresentar um cartão de destaque com: Nome do Ganhador, Gênero Escolhido, Cotas Premiadas, Telefone/WhatsApp e Atalho Direto para envio de mensagem de parabéns.
- **FR-009**: O sistema DEVE registrar e persistir o histórico de vencedores do sorteio (com data, hora, nome, palpite e modalidade), garantindo que os resultados fiquem gravados e acessíveis para conferência.
- **FR-010**: O sistema DEVE permitir ao organizador limpar ou resetar o histórico de sorteios mediante confirmação de segurança, caso deseje reiniciar os testes antes do evento oficial.

### Key Entities

- **DrawResult (Resultado do Sorteio)**: Representa um sorteio concluído e registrado. Atributos conceituais:
  - Identificador único do sorteio;
  - Nome do vencedor;
  - Telefone / WhatsApp do vencedor;
  - Palpite do vencedor (Menino ou Menina);
  - Quantidade de cotas do vencedor;
  - Modalidade utilizada (Todos os Confirmados vs Acertadores);
  - Data e hora da premiação;
  - Valor estimado do prêmio ou descrição da premiação.
- **RaffleTicket (Bilhete da Urna)**: Representação virtual de cada cota individual confirmada associada ao participante elegível no momento do sorteio.
- **AuthorCredit (Atribuição de Autoria)**: Registro visual e semântico permanente de "Criador e Autor: Argeu Rodrigues".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O sorteio animado é executado e revela o vencedor com celebração visual em tempo total entre 3 e 5 segundos após o clique inicial do organizador.
- **SC-002**: 100% dos palpites elegíveis (de acordo com o filtro selecionado e o número de cotas confirmadas) são incluídos com peso estritamente proporcional na urna virtual.
- **SC-003**: O vencedor sorteado é registrado e permanece visível no histórico imediatamente após a conclusão da animação.
- **SC-004**: O atalho para o WhatsApp abre uma conversa pré-preenchida com mensagem parabenizando o ganhador com apenas 1 clique.
- **SC-005**: O novo título "Qual é o seu palpite para o nosso bebê?" e a assinatura "Criador e Autor: Argeu Rodrigues" são exibidos de forma perfeitamente legível e responsiva em 100% dos tamanhos de tela testados (de 320px a 1920px+).

## Assumptions

- **Público Elegível no Sorteio**: Somente palpites com status "Confirmado" (pagamento validado pelo organizador) participam do sorteio, garantindo a lisura e a conformidade financeira.
- **Critério de Ponderação**: Cada cota unitária equivale a 1 bilhete na urna. Se um convidado adquiriu 4 cotas, ele possui 4 bilhetes na amostragem aleatória.
- **Sorteio em Tempo Real**: A interface de sorteio pode ser projetada em telão ou TV pelo organizador durante a festa, proporcionando uma experiência imersiva e participativa.
- **Autoria Permanente**: O crédito ao criador e autor Argeu Rodrigues é exibido com respeito ao design minimalista e moderno do rodapé, sem poluição visual.
