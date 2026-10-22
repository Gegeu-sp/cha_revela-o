# Research: Sistema de Sorteio do Bolão, Título Oficial e Créditos de Autoria

**Feature Branch**: `002-sistema-sorteio` | **Date**: 2026-10-16

---

## 1. Algoritmo de Sorteio Ponderado por Cotas (Weighted Raffle Sampling)

### Contexto & Problema
No Bolão e Rifa de Chá Revelação, cada participante pode adquirir 1 ou mais cotas (ex: 1 cota = R$ 15, 3 cotas = R$ 45). Para garantir o Princípio IV (Fair Play e Transparência), o sorteio deve respeitar matematicamente o peso de cada participante: quem comprou 3 cotas precisa ter 3 vezes mais chances de ser sorteado do que quem comprou 1 cota.

### Decisão
Implementar geração de bilhetes virtuais na urna (*flat ticket array*) associada ao gerador de números aleatórios criptograficamente seguro do navegador (`crypto.getRandomValues`) com fallback seguro para `Math.random()`.
- Para cada participante com status `confirmed`:
  - Se selecionada a modalidade "Apenas Acertadores", filtrar apenas participantes com `gender === targetGender`.
  - Gerar `N` bilhetes virtuais onde `N = quotasCount`.
  - Embaralhar a urna usando o algoritmo de Fisher-Yates.
  - Selecionar o bilhete vencedor no índice pseudoaleatório.

### Alternativas Consideradas
- **Sorteio por participante único (1 voto por pessoa)**: Rejeitado porque desestimularia a compra de cotas múltiplas e seria injusto com quem adquiriu maior volume de cotas para apoiar os pais.
- **Sorteio por faixa numérica sequencial pré-alocada**: Rejeitado pela complexidade desnecessária de alocação de bilhetes em tempo real durante compras rápidas via Pix. A urna virtual ponderada em tempo de sorteio garante a mesma distribuição probabilística com zero sobrecarga de estado.

---

## 2. Experiência Visual e Animação de Suspense (Zero-Build 60 FPS Roulette)

### Contexto & Problema
O sorteio é o clímax da festa do Chá Revelação. Uma revelação instantânea sem suspense perde o engajamento emocional da família. É necessário um efeito estilo roleta/roleta de nomes (slot machine / name ticker) que crie expectativa crescente e termine com uma explosão comemorativa de confetes.

### Decisão
Criar um componente de sorteio imersivo (visualizável tanto em tela cheia para projeção em telão/TV quanto no modal administrativo dos pais):
1. **Fase 1 (Aceleração e Embaralhamento Rápido)**: Durante ~2 segundos, os nomes dos participantes elegíveis alternam em alta velocidade no visor principal com efeitos de desfoque de movimento suave (`filter: blur(1px)`).
2. **Fase 2 (Desaceleração Gradual / Easing Out)**: Ao longo de ~1.5 a 2 segundos adicionais, a alternância vai desacelerando progressivamente através de intervalos exponenciais crescentes até travar no nome do vencedor.
3. **Fase 3 (Clímax e Comemoração)**: Efeito de pulso e escala (`scale-110`), disparo de confetes multicoloridos via `canvas-confetti` (já integrado na aplicação) e revelação do Cartão do Ganhador com botão de 1 clique para parabenizar via WhatsApp.

### Alternativas Consideradas
- **Bibliotecas pesadas de roleta 3D (ex: Winwheel.js, Phaser, Three.js)**: Rejeitadas por violarem o Princípio I da Constituição (Zero-Build e Lightweight Architecture) e aumentarem o peso do bundle sem necessidade.
- **Transição estática com spinner genérico**: Rejeitada por não entregar o valor emocional e festivo esperado em um Chá Revelação.

---

## 3. Persistência e Sincronização dos Vencedores (Firestore + LocalStorage)

### Contexto & Problema
Caso o sorteio ocorra no computador dos pais projetado na TV, os convidados que estiverem com a página aberta em seus smartphones devem ter a possibilidade de ver quem foi o vencedor. Além disso, se a página for recarregada, o resultado não pode ser perdido.

### Decisão
1. Criar uma nova coleção no Firestore: `draws` (e chave correspondente em LocalStorage: `bolao_draws`).
2. Cada documento de sorteio conterá:
   - `id`: identificador único;
   - `winnerName`: nome do participante sorteado;
   - `whatsapp`: telefone para contato;
   - `gender`: palpite do vencedor;
   - `quotasCount`: cotas adquiridas;
   - `mode`: `'all'` (Geral) ou `'correct'` (Acertadores);
   - `drawnAt`: timestamp ISO 8601;
   - `prizeTitle`: título da premiação.
3. O administrador pode gerenciar os sorteios realizados (consultar histórico, realizar novo sorteio com exclusão de já sorteados ou zerar sorteios de teste).

### Alternativas Consideradas
- **Guardar apenas em memória local**: Rejeitado, pois se a página sofrer refresh o histórico seria apagado, impossibilitando a auditoria dos ganhadores.

---

## 4. Atualização do Título Principal e Crédito de Autoria Argeu Rodrigues

### Contexto & Problema
1. O título no Hero atualmente é "Qual será o palpite do século?", que deve ser ajustado para a expressão afetiva e direta solicitada pelo usuário: "Qual é o seu palpite para o nosso bebê?".
2. É necessário atribuir explícita e respeitosamente os créditos ao Criador e Autor Argeu Rodrigues.

### Decisão
1. **Hero**: Atualizar o `h2#hero-title` em `index.html` e a constante correspondente para:
   ```html
   <h2 id="hero-title" class="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
       Qual é o seu palpite para o <span class="text-palette-gradient">nosso bebê?</span>
   </h2>
   ```
2. **Rodapé**: Inserir uma seção de créditos premium e estilizada com destaque para o autor:
   ```html
   <p class="font-medium text-slate-600 flex items-center justify-center gap-1.5">
       <span>Criador e Autor:</span>
       <strong class="text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">Argeu Rodrigues</strong>
   </p>
   ```
3. **Metadados**: Inserir `<meta name="author" content="Argeu Rodrigues">` na `<head>` de `index.html`.
