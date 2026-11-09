# Pixabay API e licença

- API oficial: https://pixabay.com/api/docs/
- Licença oficial: https://pixabay.com/service/license-summary/
- Buscar em `GET https://pixabay.com/api/` com chave local, foto horizontal,
  resolução mínima 800×600 e SafeSearch.
- Guardar `id`, `pageURL` e `user`; baixar `largeImageURL` e hospedar a cópia no
  Storage próprio. Não usar hotlink permanente.
- Manter cache de resposta de busca por 24 horas; nunca gravar a chave ou a URL
  de requisição no cache ou em logs.
- Exibir link de origem Pixabay no produto. A escolha diverge do enunciado
  da prática, que exige Pexels.
