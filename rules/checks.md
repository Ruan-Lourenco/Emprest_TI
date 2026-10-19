# Checks — verificação de fim de tarefa

> Leitor: agente

## Quando

Antes de declarar uma tarefa pronta e antes de propor um push ou PR.

## Procedimento

1. Compare a entrega com a tarefa e, quando houver spec, identifique os
   critérios de aceitação atendidos e a evidência de cada um.
2. Revise o diff e rode `git diff --check` e `git status --short`. Aponte
   arquivos fora do escopo e preserve alterações preexistentes.
3. Se houver aplicação e scripts definidos em `package.json`, execute os
   comandos pertinentes de tipos, lint, testes e build. Registre os comandos
   reais e os resultados; não presuma que um script ainda inexistente passou.
4. Se a tarefa alterar comportamento, execute os testes que provam os critérios
   afetados. Se tocar em acesso a dados, verifique autorização e isolamento
   entre tenants e registre a evidência.
5. Se tocar em migrations, siga `rules/migration.md` e registre o resultado
   da aplicação completa em banco local e dos testes de banco. Não use o
   banco remoto como ambiente de teste.
6. Antes de propor push de código da aplicação, execute o build local. Confira
   também o resultado dos checks do PR quando estiverem disponíveis.

## Critério de conclusão

Relate o que foi verificado, com os comandos e resultados. Marque cada
verificação como passou, falhou ou não se aplica, com o motivo. Uma falha ou
critério sem evidência deixa a tarefa pendente; não a declare pronta.

## Não faça

- Não trate a ausência de `package.json`, testes, banco local ou CI como um
  resultado positivo de validação.
- Não oculte falhas nem tente resolver uma falha repetida sem examinar e
  apresentar a saída do erro.
