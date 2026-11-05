# Handoff

## Onde parei

Frontend e integração local de autenticação, tRPC e persistência estão no código.
O fluxo SDD, a skill de isolamento e o verificador de spec foram alinhados às
pastas de Codex e Cursor. A spec `persistencia-auth` continua parcial: migration
remota, bootstrap e login real ainda não foram comprovados.

## Decisões não óbvias

- Apenas `suporte_ti` é usado na v1 (ADR-002 aprovado).
- A skill tem fonte única em `.agents/skills/`; o verificador tem fonte em
  `agents/verificador-spec.md` e adaptadores para Cursor e Codex.

## O que tentei e não funcionou

- Antes de instalar dependências, typecheck, lint e Vitest não iniciavam porque
  os executáveis locais não estavam disponíveis.

## Próximo passo exato

Conferir `docs/specs/alinhamento-harness/tasks.md` e concluir apenas checks
locais comprovados. Depois validar `persistencia-auth` com conta real e o fluxo
remoto protegido, mantendo suas tarefas abertas até haver evidência.

## Arquivos relevantes

- `docs/specs/alinhamento-harness/`
- `docs/specs/persistencia-auth/`
- `docs/adr/002-selecao-tenant.md`
- `rules/`
