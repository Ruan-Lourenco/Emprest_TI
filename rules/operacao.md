# Operação — autorização e publicação

> Leitor: agente e responsável pelo repositório

## Quando

Antes de editar código de produção, commitar, publicar ou alterar ambiente
remoto. `rules/restrictions.md` continua sendo o limite permanente.

## Matriz de ações

- Leitura, inspeção e planejamento: permitidos na tarefa solicitada.
- Spec, plano e documentação dentro do escopo solicitado: podem ser preparados
  e revisados. Aprovação explícita do responsável fecha decisões de negócio e
  arquitetura; não a infira do texto produzido pelo agente.
- Código de produção e testes: exigem spec, plano e tarefas da mudança e a
  aprovação prevista em `AGENTS.md`. Depois disso, execute o escopo aprovado
  sem pedir confirmação a cada arquivo.
- DDL e migration: apresente o DDL e siga `rules/migration.md` antes de gerar a
  migration. Testes de banco usam apenas ambiente local ou efêmero confirmado.
- Commit: só quando pedido ou previsto no plano aprovado. Revise o diff antes.
- Push e PR: só quando pedidos ou previstos no plano aprovado, após os checks.
  Nunca faça push direto para `main`.
- Deploy, migration remota, bootstrap de usuário e configuração do provedor:
  somente por pedido explícito que identifique a ação e o ambiente, seguindo
  `docs/DEVOPS.md`. Uma tarefa local não autoriza publicação.

## Verificação

Antes de agir, identifique o escopo autorizado e o ambiente atingido. Registre
o que foi feito, os checks e as ações que continuam pendentes.
