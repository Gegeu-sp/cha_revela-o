# 🚀 Guia de Publicação no Firebase Hosting & Status do Projeto

Este projeto está com arquitetura **Zero-Build** e **totalmente publicado e sincronizado em produção**.

---

## 🌐 Links Oficiais em Produção

- **Aplicação Web (Firebase Hosting)**: [https://rifa-bolao.web.app](https://rifa-bolao.web.app)
- **Painel Firebase Console**: [https://console.firebase.google.com/project/rifa-bolao/overview](https://console.firebase.google.com/project/rifa-bolao/overview)
- **Repositório GitHub**: [https://github.com/Gegeu-sp/cha_revela-o](https://github.com/Gegeu-sp/cha_revela-o)

---

## ⚡ Serviços Configurados e Ativos

1. **Firebase Web App**: Registrado sob o app ID `1:192442338206:web:cbd35f22d5ecaa5757a48f`.
2. **Cloud Firestore**: Banco de dados `(default)` criado e com regras de segurança ativas (`firestore.rules`). Sincronização em tempo real multi-dispositivo habilitada.
3. **Nova Paleta de Cores**:
   - Menino (Lucca): Deep Teal `#03665A`, Sage `#689D97`, Ice Mint `#CEE1DF`
   - Menina (Maya): Deep Violet `#3B0069`, Amethyst `#8F56AD`, Soft Lilac `#BE9ECF`
4. **Enquadramento Responsivo**: Max-width centralizado, modais com `max-h-[90vh]` e scroll interno, tabela responsiva e botões com área de toque mínima de 44px.
5. **Indicador de Nuvem**: Badge no topo indicando `Nuvem Ativa` com ponto verde pulsante.

---

## 🔄 Como Republicar Alterações Futuras

Sempre que fizer novas modificações no código:
```bash
# 1. Salvar e enviar para o GitHub
git add .
git commit -m "suas alterações"
git push origin main

# 2. Publicar no Firebase
firebase deploy
```
