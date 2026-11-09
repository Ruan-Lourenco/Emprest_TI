---
description: Fluxo SDD para mudanças de comportamento e verificação de specs
globs: []
alwaysApply: true
---

# Fluxo de specs

> Leitor: agente

## Quando

Use este fluxo para criar ou alterar comportamento do produto. Para
documentação, configuração e manutenção sem mudança de comportamento, defina
escopo e verificação proporcionais; não crie uma spec de produto fictícia.

## Antes de implementar

1. Leia `AGENTS.md`, `rules/restrictions.md`, o trecho relevante de
   `docs/PRD.md` e os ADRs aplicáveis. Confira o código existente.
2. Se uma regra de negócio, permissão ou decisão técnica necessária estiver
   aberta, registre a pergunta e pare nessa parte. Não a resolva por palpite.
3. Crie ou atualize `docs/specs/<feature>/spec.md` com objetivo, vínculo,
   regras decididas, critérios de aceitação `CA-xx`, fora de escopo e contrato
   afetado. Alteração de comportamento começa pela spec vigente.
4. Derive `plan.md` e `tasks.md` na mesma pasta. Cada tarefa deve citar os CAs
   envolvidos, os arquivos prováveis e como será verificada.
5. Obtenha a aprovação exigida por `AGENTS.md` e `rules/operacao.md` antes de
   escrever código de produção. Aprovação de uma tarefa não autoriza decisões
   novas nem ações remotas fora do escopo.

## Implementação e checks

1. Execute as tarefas aprovadas em partes pequenas. Preserve `docs/layout.md`
   para interface e `docs/adr/001-stack.md` para arquitetura.
2. Valide entradas nos routers tRPC e mantenha regras de negócio nos services.
   Resolva identidade e tenant no contexto; não receba `tenant_id` do cliente.
3. Para schema, siga `rules/migration.md`. Para variáveis, siga
   `rules/secrets.md`. Para testes, siga `rules/tests.md`.
4. Rode o check mais específico após cada mudança e os checks de
   `rules/checks.md` antes de declarar a tarefa concluída. Registre resultados
   reais e mantenha pendente qualquer CA sem evidência.

## Antes de declarar uma spec implementada e verificada

Delegue a revisão ao `verificador-spec` definido em
`agents/verificador-spec.md`. Passe o caminho da spec e o escopo exato da
mudança (commits, diff ou arquivos). Se não houver suporte a subagentes, use
uma sessão nova com as mesmas entradas. Quem implementa corrige achados; o
verificador volta com contexto limpo. Só use o veredito `PRONTA` quando todos
os CAs tiverem evidência suficiente e os checks aplicáveis passarem.

## Handoff

Ao encerrar trabalho com pendências, siga `rules/handoff.md` e atualize
`handoff.md`. O handoff descreve o estado observado, sem substituir a spec,
o ADR ou o resultado dos checks.
