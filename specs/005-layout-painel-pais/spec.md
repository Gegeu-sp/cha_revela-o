# Feature Specification: Reformulação do Layout e Navegação das Abas do Painel dos Pais

**Feature Branch**: `005-layout-painel-pais`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "ARRUMAR O LAYOUT E DEIXAR TUDO ARRUMADO TEM ABA QUE NAO DA PARA VER DIREITO."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegação por Abas Clara, Ergonômica e 100% Visível (Priority: P1)

Como pai/mãe ou administrador do evento, quero que as abas de navegação do Painel dos Pais sejam perfeitamente legíveis, bem espaçadas e elegantes, sem cortes de texto, sem linhas horizontais cortando as palavras e com contraste e indicação evidente da aba ativa, para que eu possa alternar com facilidade entre o controle de palpites, as configurações do evento, o cadastro manual e o sorteio oficial.

**Why this priority**: É a dor primária evidenciada pelo usuário no feedback visual: o estilo anterior de abas com borda inferior causa artefatos visuais, recortes de linha, sobreposição estranha e oculta ou espreme abas como "Sorteio do Bolão" e "Nomes & Configurações", prejudicando a experiência de uso.

**Independent Test**: Abrir o Painel dos Pais em diferentes tamanhos de tela (desktop grande, laptop e smartphone), clicar em cada uma das abas (`Palpites & Pix`, `Nomes & Configurações`, `Adicionar Manual`, `Sorteio do Bolão`) e verificar que os botões possuem estilo pill/segmented control moderno, com cantos arredondados, contraste nítido, sem artefatos de corte e com rolagem suave quando necessário.

**Acceptance Scenarios**:

1. **Given** o administrador abre o Painel dos Pais, **When** visualiza a barra superior de abas, **Then** todas as 4 abas (`Palpites & Pix`, `Nomes & Configurações`, `Adicionar Manual` e `Sorteio do Bolão`) estão visíveis, com tipografia legível, ícones correspondentes e sem linhas cortando o texto.
2. **Given** o administrador clica em uma aba inativa, **When** o clique ocorre, **Then** a aba selecionada recebe destaque imediato (fundo contrastante, sombra suave e texto destacado), enquanto as demais permanecem suaves e harmoniosas.
3. **Given** o painel é aberto em tela mobile ou janela estreita, **When** o espaço horizontal é limitado, **Then** as abas se adaptam com rolagem horizontal fluida (sem barra de rolagem cinza feia quebrando o design), ou se organizam em grade responsiva compacta e acessível.

---

### User Story 2 - Harmonização do Cabeçalho e Ações do Painel (Priority: P2)

Como administrador do evento, quero que o topo do modal do Painel dos Pais tenha uma hierarquia visual limpa e descomplicada, exibindo o título, o badge de pendências, o status de sincronização e os controles de fechar/sair de forma organizada e sem elementos duplicados competindo pela atenção.

**Why this priority**: Atualmente o cabeçalho possui um botão de atalho "Sorteio" no canto superior direito que compete visualmente com a aba "Sorteio do Bolão" logo abaixo, além de amontoar o badge da nuvem e os botões de ação em telas menores.

**Independent Test**: Inspecionar o cabeçalho do modal, verificando o alinhamento vertical e horizontal dos elementos, a remoção de redundâncias desnecessárias e a adaptação limpa dos botões de logout e fechamento.

**Acceptance Scenarios**:

1. **Given** a exibição do cabeçalho do painel, **When** visualizado pelo usuário, **Then** o título "Painel dos Pais" e o badge de palpites pendentes têm destaque prioritário à esquerda, com ícone de coroa estilizado.
2. **Given** as ações no canto superior direito, **When** organizadas, **Then** o status da nuvem, o botão de sair e o botão de fechar (X) possuem espaçamentos padronizados (mínimo 44px de área de toque) e não empilham de forma desalinhada.

---

### User Story 3 - Respiração Visual e Enquadramento do Conteúdo Interno (Priority: P3)

Como administrador, quero que o conteúdo interno de cada aba (tabela de palpites, formulários e arena de sorteio) tenha espaçamentos confortáveis, separação nítida da barra de navegação e que a barra de rolagem vertical não encoste ou corte os botões de navegação.

**Why this priority**: Evita que tabelas ou formulários fiquem colados na linha divisória das abas, conferindo um acabamento profissional e moderno de aplicativo premium.

**Independent Test**: Alternar entre todas as abas e conferir o padding interno superior, as divisórias de cards e o comportamento da rolagem vertical do modal.

**Acceptance Scenarios**:

1. **Given** a aba "Palpites & Pix" ativa, **When** a tabela com múltiplos palpites é renderizada, **Then** a barra de filtros ("Todos", "Aguardando Pix", "Confirmados") e a tabela possuem espaçamento superior generoso e respiração visual.
2. **Given** a rolagem vertical de uma lista longa de palpites, **When** o usuário rola o modal, **Then** a barra de navegação de abas permanece ancorada no topo sem sobreposição gráfica ou glitches de sombra.

---

### Edge Cases

- **Telas muito estreitas (320px a 375px)**: A barra de abas deve usar estilo pílula com rolagem por toque (`touch-pan-x`) e scrollbar oculta (`no-scrollbar`), permitindo deslizar horizontalmente sem quebrar o layout do modal.
- **Nomes longos nas abas**: Textos como "Nomes & Configurações" não devem quebrar em linhas feias de apenas 1 palavra; devem manter `whitespace-nowrap` e espaçamento equilibrado de padding.
- **Transição rápida entre abas**: A alternância de classes no JavaScript não deve recalcular estilos com salto de layout (layout shift / CLS).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE redesenhar a barra de abas do Painel dos Pais utilizando um container estilo *segmented pill control* moderno (fundo neutro suave, botões com cantos arredondados e preenchimento sólido com sombra para a aba ativa).
- **FR-002**: O sistema DEVE garantir que todos os 4 botões de abas (`Palpites & Pix`, `Nomes & Configurações`, `Adicionar Manual` e `Sorteio do Bolão`) possuam contraste adequado (WCAG AA), ícones nítidos e rótulos totalmente visíveis sem cortes.
- **FR-003**: O sistema DEVE sincronizar a função de troca de abas em `js/admin.js` para aplicar as classes consistentes de estado ativo e inativo do novo design segmented.
- **FR-004**: O sistema DEVE manter a barra de navegação de abas com suporte a rolagem horizontal suave em dispositivos móveis, sem exibir barras de rolagem cinzas nativas que cortem os botões.
- **FR-005**: O sistema DEVE harmonizar o cabeçalho superior do painel, ajustando o botão de atalho de sorteio e garantindo que o status da nuvem, botão sair e fechar fiquem perfeitamente alinhados.
- **FR-006**: O sistema DEVE assegurar que a barra de abas não sofra corte ou sobreposição com a barra de rolagem vertical do modal administrativo.

### Key Entities

- **Painel Administrativo (`#admin-dashboard-modal`)**: Modal central onde os pais gerenciam todo o evento.
- **Abas de Navegação (`.admin-tab-btn`)**: Conjunto de botões de alternância de visualização (`palpites`, `config`, `manual`, `sorteio`).
- **Painéis de Conteúdo (`.admin-tab-pane`)**: Seções correspondentes que são exibidas ou ocultadas conforme a aba selecionada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos botões de abas visíveis e sem cortes de texto ou de bordas em telas desktop (1024px+), tablet (768px) e smartphone (375px+).
- **SC-002**: Redução do deslocamento visual de layout (Cumulative Layout Shift) a 0 durante a alternância entre abas.
- **SC-003**: Tempo de alternância e resposta ao clique entre abas inferior a 50ms, com feedback visual instantâneo.
- **SC-004**: 0 sobreposições visuais entre a barra de rolagem vertical do modal e os botões de navegação horizontal.

## Assumptions

- O projeto continua seguindo a arquitetura Zero-Build em Tailwind CSS e JavaScript modular nativo.
- As 4 abas existentes cobrem todas as funcionalidades necessárias para os pais no chá revelação.
- As cores continuarão alinhadas com a paleta oficial da identidade visual do evento (Teal `#03665A` para Menino, Violeta `#3B0069` e Ametista `#8F56AD` para Menina).
