# Quickstart Validation Guide: Palpite Manual e Valor Personalizado

## Pré-requisitos
- Navegador web moderno ou ambiente Node.js para teste automatizado de módulos.
- Acesso ao Painel Administrativo ("Área dos Pais") na aplicação.

## Cenários de Validação

### 1. Validação Automatizada de Camada de Dados e Estado
Execute na raiz do projeto:
```powershell
node --check js/db.js
node --check js/admin.js
```

### 2. Teste Funcional no Painel Administrativo ("Adicionar Manual")
1. Abra o site (`https://rifa-bolao.web.app` ou `index.html` local) e entre em **Área dos Pais**.
2. Clique na aba **Adicionar Manual**.
3. Preencha:
   - **Nome da Pessoa**: `Vovô Carlos`
   - **Palpite**: `Menino`
   - **Quantidade de Cotas**: `1`
   - **Valor Total Pago (R$)**: Altere para `25.00` (outro valor personalizado).
4. Clique em **Registrar Palpite Confirmado**.
5. **Resultado Esperado**:
   - O painel muda automaticamente para a aba **Palpites & Pix**.
   - `Vovô Carlos` aparece no topo da lista com a tag `Manual`, `1 cota`, `R$ 25,00` e status `Confirmado`.
   - O Total Arrecadado e o Prêmio Estimado somam exatamente `R$ 25,00`.
   - Ao recarregar a página (`F5`), o registro permanece salvo no Firestore.

### 3. Teste de Edição de Valor Personalizado
1. Na aba **Palpites & Pix**, clique no botão **Editar** (ícone de lápis) de qualquer palpite.
2. Altere o campo **Valor Total Pago (R$)** para `35.00` e clique em **Salvar Alterações**.
3. **Resultado Esperado**: A linha da tabela e o Total Arrecadado passam a refletir `R$ 35,00` imediatamente.
