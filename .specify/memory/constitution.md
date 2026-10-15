<!--
SYNC IMPACT REPORT:
- Version change: Unversioned Template -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Simplicidade e Autossuficiência (Zero-Build & Lightweight Architecture)
  - [PRINCIPLE_2_NAME] -> II. Experiência Mobile-First e Acessibilidade (Mobile-First & Delightful UX)
  - [PRINCIPLE_3_NAME] -> III. Sanitização de Input e Integridade de Dados (Data Integrity & Sanitization)
  - [PRINCIPLE_4_NAME] -> IV. Transparência de Regras e Premiação (Fair Play & Transparency)
  - [PRINCIPLE_5_NAME] -> V. Integração Social e Fluxo Descomplicado via WhatsApp (Social Integration)
- Added sections:
  - Restrições Técnicas e Padrões de Qualidade
  - Fluxo de Desenvolvimento e Validação
- Removed sections: None
- Follow-up TODOs: None
-->

# Bolão Chá Revelação Constitution

## Core Principles

### I. Simplicidade e Autossuficiência (Zero-Build & Lightweight Architecture)
O projeto DEVE priorizar uma arquitetura simples, resiliente e sem fricção de build desnecessária, permitindo execução direta em navegadores e hospedagem estática eficiente. Dependências externas devem ser deliberadas e justificadas.
*Rationale: Reduz a complexidade de manutenção, facilita o deploy imediato e assegura que qualquer pessoa possa executar o projeto localmente ou em hospedagens estáticas gratuitas sem pipelines complexos.*

### II. Experiência Mobile-First e Acessibilidade (Mobile-First & Delightful UX)
A interface DEVE ser projetada primariamente para dispositivos móveis, garantindo ergonomia táctil, tipografia com alto contraste e legibilidade, microinterações acolhedoras e feedback visual imediato em todas as ações do usuário.
*Rationale: Mais de 90% dos convidados acessarão a plataforma através de smartphones a partir de links compartilhados em mensageiros como o WhatsApp.*

### III. Sanitização de Input e Integridade de Dados (Data Integrity & Sanitization)
Todo dado recebido por formulários ou parâmetros externos DEVE ser rigorosamente validado e sanitizado antes da renderização no DOM ou persistência em camadas de dados, prevenindo vulnerabilidades como Cross-Site Scripting (XSS) ou corrupção de estado.
*Rationale: A segurança e a integridade da lista de palpites e dos nomes dos participantes são essenciais para evitar adulterações e garantir a credibilidade do evento.*

### IV. Transparência de Regras e Premiação (Fair Play & Transparency)
As regras do bolão, valores arrecadados, divisão de prêmios e status de validação de cada palpite DEVEM ser exibidos de forma clara, objetiva e em tempo hábil para todos os participantes. Nenhuma alteração de resultado ou exclusão de palpite pode ocorrer sem registro rastreável.
*Rationale: O bolão envolve arrecadação financeira voluntária e premiação de amigos e familiares, exigindo total clareza e confiança mútua.*

### V. Integração Social e Fluxo Descomplicado via WhatsApp (Social Integration)
O fluxo de participação DEVE facilitar a comunicação direta entre convidado e organizador, fornecendo links automáticos e mensagens pré-formatadas para envio de comprovantes Pix e confirmação de presença/palpite via WhatsApp.
*Rationale: Elimina barreiras de usabilidade, dispensa sistemas complexos de autenticação bancária e aproveita canais diretos de comunicação onde a família já se reúne.*

## Restrições Técnicas e Padrões de Qualidade

1. **Stack Tecnológica**: HTML5 semântico, Tailwind CSS para estilização consistente e utilitária, e JavaScript moderno (ES6+) para comportamento reativo.
2. **Consistência Visual**: Aderência estrita à identidade visual do evento (paleta de tons pastel/vibrantes para Menino 💙 e Menina 💖, fundo creme/claro acolhedor e tipografia refinada).
3. **Robustez de Execução**: Ausência de erros em console, degradação graciosa em caso de falha de conexão e tratamento de estados vazios (empty states) em listas e contadores.

## Fluxo de Desenvolvimento e Validação

1. **Ciclo de Especificação (Spec-Driven)**: Qualquer nova funcionalidade (ex: persistência em banco de dados, painel administrativo do organizador, automação de sorteio) DEVE ser especificada através do Spec Kit (`/speckit-specify` -> `/speckit-plan` -> `/speckit-tasks` -> `/speckit-implement`).
2. **Critérios de Aceite**: Toda alteração de código DEVE ser validada visualmente em resoluções mobile (360px a 428px) e desktop, garantindo que o layout seja responsivo e sem overflow horizontal.
3. **Revisão e Preservação**: Melhorias incrementais não devem quebrar funcionalidades existentes do bolão sem prévia justificativa documentada.

## Governance

Esta Constituição é a referência suprema para decisões de design, arquitetura e implementação deste projeto. Toda contribuição ou alteração de código DEVE respeitar os princípios aqui estabelecidos.

1. **Processo de Emenda**: Propostas de alteração nesta constituição devem documentar o impacto, a motivação e atualizar o versionamento semântico.
2. **Versionamento Semântico**:
   - **MAJOR**: Alteração ou remoção de princípios fundamentais ou mudanças drásticas na arquitetura.
   - **MINOR**: Adição de novas seções, princípios ou diretrizes de qualidade ampliadas.
   - **PATCH**: Ajustes de redação, correções tipográficas e clarificações de regras.
3. **Auditoria de Conformidade**: Cada plano ou especificação gerada deve ser avaliada contra estes princípios antes da implementação.

**Version**: 1.0.0 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-14
