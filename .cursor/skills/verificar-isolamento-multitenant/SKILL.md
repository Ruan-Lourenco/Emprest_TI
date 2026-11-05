---
name: verificar-isolamento-multitenant
description: Verifica autorização e isolamento entre tenants nos procedimentos tRPC do EmpresTI. Use ao criar, alterar ou revisar procedimentos que leem ou modificam dados de tenant, ou quando for solicitada evidência de isolamento, RLS ou concorrência. Não substitui a verificação final dos critérios da spec.
---

# Verificar isolamento multitenant

## Fontes e escopo

Leia `AGENTS.md`, as regras aplicáveis em `rules/`, o PRD, o ADR vigente e a
spec da mudança antes de concluir quais papéis e comportamentos são permitidos.
Leia os routers, o contexto tRPC, os services e a migration afetados. Se uma
permissão ou um comportamento não estiver decidido, registre a lacuna; não
invente uma regra.

Use esta skill para planejar, implementar ou revisar testes de uma mudança já
autorizada. Respeite o fluxo `SPEC → PLAN → TASKS → CODE → TESTS` e o escopo da
solicitação. O subagente `agents/verificador-spec.md` faz a conferência final da
spec quando aplicável.

## Matriz de verificação

Monte uma linha para cada procedimento tRPC afetado que acessa dados:

| Procedimento | Papel aprovado | Contexto (sessão e tenant) | Tentativa entre tenants | Teste | Evidência | Resultado |
| --- | --- | --- | --- | --- | --- | --- |

Para cada linha, verifique conforme o comportamento aprovado:

1. Chamada sem sessão, sem vínculo ativo ou com papel insuficiente é recusada
   pelo procedimento, inclusive quando a interface oculta a ação.
2. O tenant vem do contexto de request e do vínculo verificado; um identificador
   ou valor enviado pelo cliente não concede acesso a outro tenant.
3. Uma identidade do tenant A não lê nem altera recursos do tenant B. Para
   mutações, confirme também que o registro de B permanece inalterado.
4. Lista, detalhe, paginação e caminhos de erro não expõem dados de outro tenant
   nem detalhes sensíveis. Aplique apenas aos caminhos existentes na mudança.
5. Se a mudança envolver solicitação ou devolução, cubra as regras aprovadas e
   a concorrência no banco real, verificando o estado final persistido.

Teste o router com `createCaller` e contextos distintos para provar a fronteira
do procedimento. Testes diretos dos services complementam essa prova, mas não
substituem a verificação do middleware e do contexto tRPC. Para constraint,
transação, concorrência ou RLS, use PostgreSQL local ou efêmero com a migration
versionada. Um mock do Prisma não demonstra essas propriedades. Teste RLS com
papel sujeito às policies; a conexão dona das tabelas pode ignorá-las conforme
o ADR. Inspeção visual da interface ou do código não comprova isolamento,
concorrência nem a aplicação das policies no banco.

## Segurança da execução

Antes de rodar testes que escrevam no banco, confirme por configuração não
sensível que o destino é local ou efêmero. Se não for possível confirmar,
não execute o teste e registre a falta de evidência. Nunca imprima URLs de
conexão, tokens ou dados pessoais. Não execute `migrate reset`, seed, migration,
limpeza ou mutação no Supabase remoto por causa desta skill.

## Saída

Apresente a matriz com links ou caminhos dos testes e os comandos realmente
executados. Marque cada caso como passou, falhou ou sem evidência. Diferencie
evidência de service, procedimento e RLS; registre lacunas de autorização,
isolamento e concorrência sem declarar a spec pronta enquanto houver critério
sem prova.
