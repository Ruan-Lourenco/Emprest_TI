# Spec — Skill de verificação de isolamento multitenant

Status: APROVADA pelo responsável em 2026-11-05. Não define comportamento do produto.
Implementação: skill em `.agents/skills/verificar-isolamento-multitenant/`.

## Objetivo

Adicionar uma skill de projeto que oriente a verificação de autorização e
isolamento entre tenants nos procedimentos tRPC que acessam dados.

## Escopo e restrições

- A skill deve partir das decisões vigentes em `AGENTS.md`, `rules/`, PRD, ADR e
  spec da feature, sem criar permissões ou regras de negócio.
- Deve relacionar cada procedimento afetado a papel, contexto, teste e
  evidência, incluindo tentativas de leitura e mutação entre tenants.
- Testes de banco só devem usar ambiente local ou efêmero; não executar
  migrations, limpeza ou escrita contra o Supabase remoto.
- Não alterar código de produção, testes existentes ou configuração remota nesta
  entrega.

## Critérios de aceitação

1. A skill é descoberta como skill de projeto e tem nome, descrição e gatilho
   específicos.
2. O procedimento orienta uma matriz por procedimento tRPC e distingue teste
   de service, procedimento e RLS.
3. A skill impede tratar mocks ou verificação visual como prova de isolamento,
   concorrência ou política de banco.
4. A skill orienta a relatar evidências, lacunas e comandos executados sem
   expor segredos nem alterar banco remoto.
