# Quickstart Validation Guide: Máscara de Celular `(DD) XXXXX-XXXX`

## 1. Teste Automatizado via Node.js
Execute na raiz do projeto:
```powershell
node --input-type=module -e "import('./js/auth.js').then(m => console.log(m.formatPhoneInput('11987654321')))"
```
Saída esperada: `(11) 98765-4321`

## 2. Teste Manual no Navegador
1. Acesse https://rifa-bolao.web.app.
2. No formulário "Faça seu Palpite", clique no campo **Seu WhatsApp** e digite `11987654321`.
3. Verifique que o número aparece automaticamente editado como `(11) 98765-4321`.
4. No **Painel dos Pais** → **Adicionar Manual** e **Editar Palpite**, digite no campo **WhatsApp** e verifique a mesma formatação instantânea `(DD) XXXXX-XXXX`.
