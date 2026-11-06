# Tarefas — Alinhamento do harness e da documentação

Status: CORREÇÕES DOCUMENTAIS CONCLUÍDAS em 2026-11-05; checks da aplicação
pendentes por instalação local de dependências incompleta.

- [x] Registrar spec e plano aprovados pelo responsável nesta conversa.
- [x] Corrigir fluxo SDD e completar regras de testes, operação e handoff.
- [x] Tornar a skill de isolamento descoberta no projeto com uma fonte única.
- [x] Configurar o verificador de spec para Codex e Cursor.
- [x] Alinhar AGENTS, handoff e status; registrar `suporte_ti` no ADR-002.
- [ ] Concluir typecheck, lint, testes e build após `npm ci` terminar.

## Resultado da validação

- `quick_validate.py .agents/skills/verificar-isolamento-multitenant`:
  `Skill is valid!`.
- `.codex/agents/verificador-spec.toml`: analisado por `tomllib` sem erro.
- Antes do `npm ci`, typecheck, lint e Vitest não iniciavam: executáveis
  ausentes em `node_modules/.bin`.
- `npm ci` foi interrompido por prazo solicitado pelo responsável. Os checks
  da aplicação não foram repetidos; não há veredito de app pronto.
