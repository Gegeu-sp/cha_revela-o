# Feature Specification: Substituição de Ícones de Gênero (Barra de Peso e Boneca) e Alinhamento Visual Responsivo

**Feature Branch**: `003-icones-e-alinhamento`

**Created**: 2026-10-23

**Status**: Ready for Planning

**Input**: User description: "trocar este icones 🌿🌸. por menino uma barra de peso e menina uma boneca. fazer este troca onde estiver no site. apenas este ajuste. alem disso, ajustar angulo da pagina, das letras para web e mobile. deixar alinhados"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Substituição Global de Ícones de Gênero (Priority: P1)

Como participante, visitante ou organizador do chá revelação, quero que o símbolo visual associado ao Menino seja uma barra de peso / halter (🏋️) e o símbolo associado à Menina seja uma boneca (🪆) em todas as seções e mensagens do site, substituindo integralmente os ícones anteriores (🌿 e 🌸), de modo que a identidade visual do evento reflita fielmente as preferências dos pais.

**Why this priority**: É o objetivo central e explícito solicitado pelo usuário ("apenas este ajuste" na identidade iconográfica), garantindo consistência em toda a experiência da plataforma.

**Independent Test**: Navegar por todas as telas do site (cabeçalho, placar, formulário de aposta, modais de administração, roleta de sorteio, ranking de participantes e mensagens de WhatsApp) e constatar que nenhuma ocorrência de 🌿 ou 🌸 permanece visível, tendo sido substituídas de ponta a ponta por barra de peso (menino) e boneca (menina).

**Acceptance Scenarios**:

1. **Given** o visitante acessa o topo da página, **When** visualiza a logo e os nomes dos bebês no cabeçalho (`hero-baby-names`), **Then** o nome do menino vem acompanhado do ícone de barra de peso (🏋️) e o da menina acompanhado da boneca (🪆).
2. **Given** o participante consulta a seção "Placar da Disputa", **When** observa os cartões de votação e títulos dos times, **Then** o cartão do Time do Menino destaca o ícone de barra de peso e o do Time da Menina destaca o ícone de boneca.
3. **Given** o usuário preenche o formulário "Enviar Meu Palpite Oficial", **When** seleciona a opção de gênero do bebê, **Then** os botões de escolha exibem em destaque a barra de peso para o menino e a boneca para a menina.
4. **Given** os pais acessam o Painel Administrativo, **When** consultam a tabela de palpites, o modal de cadastro/edição manual ou a configuração de nomes dos bebês, **Then** todos os rótulos, badges e opções de filtro utilizam a barra de peso para menino e a boneca para menina.
5. **Given** o organizador executa o sorteio na roleta ou os convidados visualizam o ranking de maiores colaboradores, **When** os dados de apostas e vencedores são renderizados, **Then** o gênero é identificado pelos novos ícones de barra de peso e boneca.
6. **Given** o participante conclui o envio do palpite e aciona a confirmação via WhatsApp, **When** a mensagem pré-formatada é montada para o organizador, **Then** o texto exibe o palpite com o novo ícone correspondente (barra de peso ou boneca), sem qualquer resquício de 🌿 ou 🌸.

---

### User Story 2 - Alinhamento Visual, Retidão e Harmonia Tipográfica em Web e Mobile (Priority: P2)

Como usuário acessando o site tanto pelo computador (desktop) quanto pelo celular (mobile), quero que a página e as letras estejam perfeitamente alinhadas, com ângulo visual reto (sem rotações, inclinações acidentais ou desvios ortogonais), com baseline tipográfica equilibrada entre textos e ícones, e sem quebras de linha desalinhadas ou overflow horizontal.

**Why this priority**: Atende diretamente à exigência do usuário ("ajustar angulo da pagina, das letras para web e mobile. deixar alinhados") e cumpre o Princípio II da Constituição do projeto (Experiência Mobile-First e Acessibilidade).

**Independent Test**: Abrir o site em diferentes larguras de viewport (360px a 428px no mobile e 1024px+ no desktop) e certificar-se de que os textos dos cabeçalhos, os cards do placar, os botões do formulário e as etiquetas estão centrados ou alinhados harmonicamente em ângulo reto (0deg), com os ícones perfeitamente centralizados verticalmente em relação às fontes textuais.

**Acceptance Scenarios**:

1. **Given** o usuário visualiza o cabeçalho em telas estreitas de smartphones, **When** o bloco com os nomes dos bebês ("Argeu Neto vs Livia Rodrigues") é renderizado, **Then** os nomes e ícones mantêm alinhamento vertical centrado e espaçamento uniforme, sem cortes deselegantes ou quebras desalinhadas.
2. **Given** a seção de cartões do placar e botões de voto do formulário, **When** exibida em mobile (empilhada ou em grade de 2 colunas) e em desktop (lado a lado), **Then** os cartões possuem alturas equivalentes, alinhamento simétrico, espaçamentos internos idênticos e proporção balanceada entre as opções de menino e menina.
3. **Given** todos os elementos textuais e contêineres da página, **When** inspecionados em qualquer dispositivo, **Then** possuem alinhamento reto (sem skew, rotações ou desvios angulares indesejados nas letras ou caixas), garantindo leitura confortável e visual profissional.

---

### User Story 3 - Preservação Cirúrgica das Regras e Operações Existentes (Priority: P3)

Como organizador do evento, quero que esta atualização visual mantenha intacta toda a lógica funcional do bolão (cálculo de cotas, pagamentos Pix, regras do sorteio ponderado, persistência no Firebase/LocalStorage e envio para WhatsApp), sem efeitos colaterais indesejados.

**Why this priority**: Atende à restrição "apenas este ajuste" especificada pelo usuário, preservando a estabilidade da plataforma já validada.

**Independent Test**: Executar uma aposta de teste com cálculo de cotas, verificar o valor gerado, testar a geração do link WhatsApp e conferir que o console do navegador permanece livre de erros.

**Acceptance Scenarios**:

1. **Given** a alteração dos ícones e das classes de alinhamento, **When** um palpite é submetido, **Then** os identificadores internos de gênero (`boy` e `girl`) permanecem íntegros, assegurando compatibilidade com os dados já existentes.
2. **Given** a navegação e interação com todas as áreas da página, **When** qualquer botão ou link é acionado, **Then** nenhum erro de script ou quebra de layout ocorre.

---

### Edge Cases

- **Compatibilidade dos novos ícones em múltiplos sistemas operacionais (Android, iOS, Windows, macOS)**: O emoji de barra de peso (`🏋️` / `🏋️‍♂️`) e o emoji de boneca (`🪆`) devem ser renderizados de forma limpa e consistente; quando integrados a elementos HTML estilizados, classes flexíveis e tamanhos de fonte proporcionais evitam discrepâncias de altura de linha.
- **Opções nativas de `<select>`**: Elementos nativos `<option>` aceitam caracteres Unicode (emojis), mas não tags HTML (`<i>` ou `<span>`). O uso do emoji direto garante renderização perfeita nos dropdowns do painel administrativo e de filtros.
- **Mensagens para mensageiros externos (WhatsApp)**: No texto codificado para URL do WhatsApp, o uso de emojis Unicode nativos garante legibilidade direta no smartphone do destinatário sem tags quebradas.
- **Telas ultrapequenas (320px a 360px)**: Em telas com largura muito reduzida, textos com nomes longos e ícones devem manter `flex-wrap` gracioso ou encolhimento proporcional sem gerar rolagem horizontal ou sobreposição de letras.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE substituir todas as ocorrências do ícone 🌿 pelo ícone representativo de barra de peso (🏋️) em todo o conteúdo HTML estático e em templates dinâmicos de JavaScript.
- **FR-002**: O sistema DEVE substituir todas as ocorrências do ícone 🌸 pelo ícone representativo de boneca (🪆) em todo o conteúdo HTML estático e em templates dinâmicos de JavaScript.
- **FR-003**: A substituição dos ícones DEVE abranger obrigatoriamente:
  - Cabeçalho / Barra superior (identificação dos bebês);
  - Cartões da seção "Placar da Disputa";
  - Botões de seleção de gênero no formulário oficial de palpites;
  - Rótulos e dropdowns de configuração e filtragem na Área dos Pais;
  - Badges de gênero nas tabelas de palpites confirmados e pendentes;
  - Cartões e avisos da roleta de sorteio oficial;
  - Alertas de liderança no ranking dos maiores participantes;
  - Textos das mensagens automáticas de confirmação e compartilhamento para WhatsApp.
- **FR-004**: O sistema DEVE garantir alinhamento visual ortogonal reto (0 grau de rotação/inclinação) para todos os blocos de conteúdo, títulos, parágrafos e elementos interativos nas versões web e mobile.
- **FR-005**: O sistema DEVE padronizar o alinhamento vertical e a altura de linha entre ícones e letras (utilizando alinhamento flex com `items-center` e margens harmoniosas), eliminando desníveis visuais entre símbolos e tipografia.
- **FR-006**: Os cartões e opções de Menino e Menina DEVEM apresentar alturas e larguras simétricas, margens padronizadas e alinhamento de texto centrado/equilibrado tanto no layout mobile empilhado quanto no layout desktop lado a lado.
- **FR-007**: A área do cabeçalho DEVE manter os nomes e ícones dos bebês perfeitamente alinhados e legíveis em telas a partir de 320px sem causar overflow horizontal na janela do navegador.
- **FR-008**: As chaves internas de controle e lógica de dados (`boy`, `girl`) DEVEM ser estritamente preservadas para evitar incompatibilidade com palpites já registrados.

### Key Entities *(include if feature involves data)*

- **VisualIdentityTokens**: Conjunto de símbolos e tokens visuais que representam a identidade de cada opção do bolão:
  - Time Menino: Ícone principal de barra de peso (`🏋️`), cor primária verde esmeralda (`#03665A`), cor de suporte sálvia (`#689D97`), fundo temático (`#CEE1DF`).
  - Time Menina: Ícone principal de boneca (`🪆`), cor primária roxo imperial (`#3B0069`), cor de suporte ametista (`#8F56AD`), fundo temático (`#BE9ECF`).
- **ResponsiveAlignmentProfile**: Regras de alinhamento e geometria visual garantindo layout ortogonal reto, alinhamento vertical de texto/ícone (`inline-flex items-center`) e simetria de blocos tanto em resoluções compactas (mobile) quanto amplas (desktop).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das ocorrências visíveis e dinâmicas de 🌿 e 🌸 no site são substituídas por barra de peso (🏋️) e boneca (🪆), com zero menções residuais aos ícones antigos no código renderizado e mensagens geradas.
- **SC-002**: 100% dos blocos de texto e ícones de identificação de gênero apresentam alinhamento vertical centrado e simetria de layout em resoluções móveis (360px a 428px) e desktop (1024px+).
- **SC-003**: Zero overflow horizontal (nenhuma barra de rolagem horizontal indesejada) em viewports entre 320px e 1920px de largura.
- **SC-004**: Zero regressão funcional nas regras de aposta, formulário, cálculo de cotas, integração com WhatsApp e módulo de sorteio.

## Assumptions

- O símbolo de barra de peso para menino é representado prioritariamente pelo caractere Unicode 🏋️ (ou conjunto semântico com classes de suporte quando necessário), assegurando compatibilidade universal com elementos `<option>`, mensagens WhatsApp e navegadores modernos.
- O símbolo de boneca para menina é representado prioritariamente pelo caractere Unicode 🪆 (boneca / matryoshka) com fallback semântico limpo, garantindo compatibilidade direta em todas as plataformas sem dependência de fontes externas proprietárias.
- A expressão "ajustar ângulo da página, das letras para web e mobile. deixar alinhados" refere-se à retificação e harmonização de alinhamentos tipográficos, baselines de ícone/texto, eliminação de inclinações/distorções visuais e perfeito enquadramento responsivo em telas verticais (smartphones) e horizontais (computadores).
- Nenhum valor financeiro, chave Pix ou regra de negócio deve ser alterado durante esta intervenção ("apenas este ajuste").
